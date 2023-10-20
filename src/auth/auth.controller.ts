import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';
import { AuthService } from 'src/auth/auth.service';
import { SignupDtoType, loginDtoType } from 'src/customer/dto/signup.dto';
import { multerOptions } from 'src/middleware/multer.config';

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
  @UseInterceptors(AnyFilesInterceptor(multerOptions('files')))
  async verifyOTPAndRegister(
    @UploadedFiles() files: any,
    @Body() data: SignupDtoType,
  ) {
    try {
      const isOtpValid = await this.authService.validateRegistrationOTP(
        data.email,
        data.otp,
      );

      if (!isOtpValid) {
        // files.forEach((file) => {
        //   console.log(file);
        //   const filePath = file.path;
        //   console.log(filePath);
        //   fs.unlinkSync(filePath);
        // });
        return { message: 'Invalid OTP' };
      }

      // If the OTP is valid, proceed with user registration
      try {
        const newUser = await this.authService.registerUser(files, data);
        return { message: 'Registration successful', user: newUser };
      } catch (registrationError) {
        return {
          message: 'Registration failed',
          error: registrationError.message,
        };
      }
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
  /////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('validat')
  async validateToken2(@Body('otp') otp: string) {
    const isValid = await this.authService.validateTokenAndSetIsOTP(otp);

    if (!isValid) {
      throw new BadRequestException('Invalid otp');
    }

    return { message: 'valid otp', isOTPSet: true };
  }

  @Post('reset-password')
  async resetPasswordd(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const isReset = await this.authService.resetPasswordd(email, password);

    if (!isReset) {
      throw new BadRequestException('Invalid email');
    }

    return { message: 'Password reset successful' };
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
