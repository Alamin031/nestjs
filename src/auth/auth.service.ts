import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDtoType, loginDtoType } from 'src/customer/dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { sendEmail } from 'src/middleware/sendemail';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private prisma: PrismaService,
  ) {}

  private readonly OTP_EXPIRATION_TIME = 1000 * 60 * 5;

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  }

  async sendRegistrationSuccessEmail(user: User): Promise<void> {
    const emailContent = `
      <p>Dear ${user.name},</p>
      <p>Your registration was successful. Welcome to our platform!</p>
      <p>Email: ${user.email}</p>
      <p>Name: ${user.name}</p>
    `;

    try {
      await sendEmail(user.email, 'Registration Successful', emailContent);
    } catch (error) {
      throw new Error('Error sending registration success email');
    }
  }

  async sendRegistrationOTP(email: string): Promise<void> {
    const otp = this.generateOTP();
    await this.createRegistrationOTP(email, otp);
    await this.sendRegistrationEmail(email, otp);
  }

  async createRegistrationOTP(email: string, otp: string): Promise<void> {
    await this.prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRATION_TIME),
      },
    });
  }
  async sendRegistrationEmail(email: string, otp: string): Promise<void> {
    const emailContent = `Your OTP for registration is: ${otp}`;

    try {
      await sendEmail(email, 'OTP for Registration', emailContent);
    } catch (error) {
      throw new Error('Error sending registration email');
    }
  }

  async validateRegistrationOTP(email: string, otp: string): Promise<boolean> {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        email,
        otp,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    return !!otpRecord;
  }

  async registerUser(
    email: string,
    name: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await this.deleteRegistrationOTP(email);

    await this.sendRegistrationSuccessEmail(newUser);

    return newUser;
  }

  async deleteRegistrationOTP(email: string): Promise<void> {
    const otpRecord = await this.prisma.oTP.findFirst({
      where: { email },
    });
    if (otpRecord) {
      await this.prisma.oTP.delete({
        where: { id: otpRecord.id },
      });
    }
  }

  async createPasswordResetToken(email: string): Promise<void> {
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    await this.sendResetEmail(email, otp); // Send the reset email
  }
  async sendResetEmail(email: string, otp: string): Promise<void> {
    const emailContent = `Your OTP for password reset is: ${otp}`;

    try {
      await sendEmail(email, 'Password Reset OTP', emailContent);
    } catch (error) {
      throw new Error('Error sending reset email');
    }
  }
  // async sendResetEmail(email: string, otp: string): Promise<void> {
  //   const resetLink = `https://yourwebsite.com/reset-password?otp=${otp}`;
  //   const emailContent = `
  //     <p>Click the following link to reset your password:</p>
  //     <a href="${resetLink}">Reset Password</a>
  //   `;

  //   try {
  //     await sendEmail(email, 'Password Reset', emailContent);
  //   } catch (error) {
  //     throw new Error('Error sending reset email');
  //   }
  // }

  async validateToken(otp: string): Promise<boolean> {
    const resetEntry = await this.prisma.oTP.findFirst({
      where: {
        otp,
      },
    });
    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      return false;
    }
    return true;
  }

  async resetPassword(otp: string, newPassword: string): Promise<void> {
    const resetEntry = await this.prisma.oTP.findFirst({
      where: {
        otp,
      },
    });
    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(newPassword, salt);

    await this.prisma.user.update({
      where: {
        email: resetEntry.email,
      },
      data: {
        password,
      },
    });

    await this.prisma.oTP.delete({
      where: {
        otp,
      },
    });
  }
  async usersignup(data: SignupDtoType): Promise<SignupDtoType> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
  //login and token jenerete
  async login(data: loginDtoType): Promise<{ accessToken: string }> {
    const { email, password } = data;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const accessToken = this.jwtService.sign({ sub: user.id });
    return { accessToken };
  }
  // Validate user by ID (usually called from JwtStrategy)
  async validateUserById(id: number): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
