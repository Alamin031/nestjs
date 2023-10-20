import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDtoType, loginDtoType } from 'src/customer/dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { sendEmail } from 'src/middleware/sendemail';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';

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
      <p>Dear ${user.firstName},</p>
      <p>Your registration was successful. Welcome to our platform!</p>
      <p>Email: ${user.email}</p>
      <p>Name: ${user.firstName}</p>
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
    files: Express.Multer.File[],
    signup: SignupDtoType,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signup.email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }
    let avatar = files.find((file) => file.fieldname === 'profile');
    if (!avatar) {
      avatar = null;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signup.password, salt);
    // Parse 'age' and 'Visits' as integers
    const age = parseInt(signup.age, 10);
    const Visits = parseInt(signup.Visits, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: signup.email,
        firstName: signup.firstName,
        lastName: signup.lastName,
        age: age,
        Visits: Visits,
        password: hashedPassword,
        avatar: avatar.filename,
      },
    });

    await this.deleteRegistrationOTP(signup.email);

    await this.sendRegistrationSuccessEmail(newUser);
    // files.forEach((file) => {
    //   console.log(file);
    //   const filePath = file.path;
    //   console.log(filePath);
    //   fs.unlinkSync(filePath);
    // });

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

  async createPasswordResetToken(email: string): Promise<any> {
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const newOtp = await this.prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });
    await this.sendResetEmail(email, otp); // Send the reset email
    return newOtp;
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
  //validate otp by email

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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  async validateTokenAndSetIsOTP(otp: string): Promise<boolean> {
    const otpEntry = await this.prisma.oTP.findFirst({
      where: {
        otp,
      },
    });

    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return false;
    }

    const email = otpEntry.email;
    await this.prisma.admin.update({
      where: { email },
      data: {
        isOTP: true,
      },
    });
    await this.prisma.oTP.delete({
      where: {
        otp,
      },
    });
    return true;
  }

  async resetPasswordd(email: string, newPassword: string): Promise<boolean> {
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (admin && admin.isOTP) {
      const salt = await bcrypt.genSalt();
      console.log('password:', newPassword);
      const password = await bcrypt.hash(newPassword, salt);
      console.log('password:', password);
      await this.prisma.admin.update({
        where: { email },
        data: {
          password,
          isOTP: false,
        },
      });

      return true;
    }

    return false;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
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
  async adminsignup(data: adminSignupDtoType): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const newUser = await this.prisma.admin.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          permissions: data.permissions,
        },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
  //admin login and token jenerete
  async adminlogin(data: loginDtoType): Promise<{ accessToken: string }> {
    const { email, password } = data;
    const admin = await this.prisma.admin.findFirst({
      where: {
        email,
      },
    });
    if (!admin) {
      throw new Error('Admin not found');
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const accessToken = this.jwtService.sign({ sub: admin.id });
    console.log('accessToken:', accessToken);
    return { accessToken };
  }
  //user login and token jenerete
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

  async validateAdminById(id: number): Promise<any> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        id,
      },
    });
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  }
}
