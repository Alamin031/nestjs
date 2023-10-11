import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignupDtoType, loginDtoType } from 'src/customer/dto/signup.dto';

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
  @Post('forget')
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
  @Post('usersignup')
  async usersignup(@Body() data: SignupDtoType) {
    try {
      const user = await this.authService.usersignup(data);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
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
