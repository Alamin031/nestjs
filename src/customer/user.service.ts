import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // eslint-disable-next-line no-unused-vars
  ) {}
  async sendOtpEmail(email: string, otp: string) {
    // Check if the user already exists in the database
    const existingUser = await this.prisma.user1.findUnique({
      where: { email },
    });

    if (existingUser) {
      // User exists, update OTP and OTP expiration time
      const otpExpiresAt = new Date();
      otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15);

      await this.prisma.user1.update({
        where: { email },
        data: { otp, otpExpiresAt },
      });
    } else {
      // User doesn't exist, create a new user without the password
      const otpExpiresAt = new Date();
      otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15);

      await this.prisma.user1.create({
        data: {
          email,
          otp,
          otpExpiresAt,
        },
      });
    }

    // Send OTP to the user's email
    this.sendEmail(email, otp);
  }

  async validateOtp(email: string, otp: string): Promise<boolean> {
    const user1 = await this.prisma.user1.findUnique({ where: { email } });

    if (!user1 || user1.otp !== otp || user1.otpExpiresAt < new Date()) {
      return false;
    }

    return true;
  }

  async registerUser(email: string, name: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set the user's password when registering
    await this.prisma.user1.update({
      where: { email },
      data: { password: hashedPassword, name: name },
    });

    // Delete the OTP entry
    await this.prisma.user1.update({
      where: { email },
      data: { otp: null, otpExpiresAt: null },
    });
  }

  public generateOTP(): string {
    return otpGenerator.generate(6, { digits: true });
  }
  private sendEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mridoy031@gmail.com',
        pass: 'usjnybztrzrqlzll',
      },
    });
    const mailOptions = {
      from: 'mridoy031@gmail.com',
      to: email,
      subject: 'OTP for Registration',
      text: `Your OTP for registration is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  //get profile
  async getProfile(id: number): Promise<User> {
    try {
      const profile = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //update profile
  async updateProfile(id: number, data: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const profile = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //delete profile
  async deleteProfile(id: number): Promise<User> {
    try {
      const profile = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //update profile by id
  async update(id: number, data: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const profile = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();
      if (!users) {
        throw new NotFoundException('User not found');
      }
      return users;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async createPasswordResetToken(email: string) {
    const token = this.generateOTP();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Save token in the database
    await this.prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    this.sendResetEmail(email, token);
  }
  async validateToken(token: string): Promise<boolean> {
    const resetEntry = await this.prisma.passwordReset.findUnique({
      where: {
        token,
      },
    });
    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      return false; // Token not found or expired
    }
    return true;
  }

  async resetPassword(token: string, newPassword: string) {
    // Find token in database
    const resetEntry = await this.prisma.passwordReset.findUnique({
      where: {
        token,
      },
    });
    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      throw new Error('Invalid or expired token');
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

    await this.prisma.passwordReset.delete({
      where: {
        token,
      },
    });
  }
  private generateOTPP(): string {
    const token = otpGenerator.generate(6, { digits: true });
    return token;
  }
  private sendResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mridoy031@gmail.com',
        pass: 'usjnybztrzrqlzll',
      },
    });
    const mailOptions = {
      from: 'mridoy031@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
