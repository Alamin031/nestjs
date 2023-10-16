import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { loginDtoType } from 'src/customer/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-registration-otp')
  async sendRegistrationOTP(@Body() data: { email: string }) {
    try {
      const { email } = data;
      await this.authService.sendRegistrationOTP(email);
      return { message: 'OTP sent to your email' };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Post('register')
  async verifyOTPAndRegister(
    @Body()
    data: {
      email: string;
      otp: string;
      name: string;
      password: string;
    },
  ) {
    try {
      const { email, otp, name, password } = data;

      const isOtpValid = await this.authService.validateRegistrationOTP(
        email,
        otp,
      );

      if (!isOtpValid) {
        return { message: 'Invalid OTP' };
      }

      await this.authService.registerUser(email, name, password);

      return { message: 'Registration successful' };
    } catch (error) {
      return { message: error.message };
    }
  }
  //password change
  @Post('forgettoken')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.createPasswordResetToken(email);
  }
  //password reset
  @Put('reset/:otp')
  async resetPassword(
    @Param('otp') otp: string,
    @Body('password') password: string,
  ) {
    const isValid = await this.authService.validateToken(otp);
    if (!isValid) {
      throw new BadRequestException('Invalid otp');
    }
    return this.authService.resetPassword(otp, password);
  }
  //validate token
  @Post('validate/:otp')
  async validateToken(@Param('otp') otp: string) {
    const isValid = await this.authService.validateToken(otp);
    if (!isValid) {
      throw new BadRequestException('Invalid otp');
    }
    return { message: 'valid otp' };
  }
  @Post('validatee')
  async validateToken1(@Body('otp') otp: string) {
    const isValid = await this.authService.validateToken(otp);
    console.log(isValid);
    console.log(otp);
    if (!isValid) {
      throw new BadRequestException('Invalid otp');
    }
    return { message: 'valid otp' };
  }
  @Post('adminsignup')
  async adminsignup(@Body() data: adminSignupDtoType) {
    try {
      const user = await this.authService.adminsignup(data);
      return {
        message: 'admin registered successfully',
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //admin login
  @Post('adminlogin')
  async adminlogin(@Body() data: loginDtoType) {
    try {
      const admin = await this.authService.adminlogin(data);
      return {
        message: 'admin login successfully',
        admin,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  //customer login
  @Post('login')
  async login(@Body() data: loginDtoType) {
    try {
      const user = await this.authService.login(data);
      return {
        message: 'User login successfully',
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
