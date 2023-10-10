import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Put,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { user1dtoType } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async registerUser(@Body() data: user1dtoType) {
    const otp = this.userService.generateOTP();
    await this.userService.sendOtpEmail(data.email, otp);
    return { message: 'OTP sent to your email' };
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('name') name: string,
    @Body('password') password: string,
  ) {
    const isOtpValid = this.userService.validateOtp(email, otp);

    if (!isOtpValid) {
      return { message: 'Invalid OTP' };
    }

    await this.userService.registerUser(email, name, password);

    return { message: 'Registration successful' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfilee(@Request() request): Promise<any> {
    const userId = request.user.id;
    try {
      const user = await this.userService.getProfile(userId);
      console.log('User Profile:', user);
      return { user };
    } catch (error) {
      console.error('Error fetching user profile:', error);

      throw new NotFoundException('User not found');
    }
  }
  //update profile
  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() request, @Body() data: any): Promise<any> {
    const userId = request.user.id;
    try {
      const user = await this.userService.updateProfile(userId, data);
      console.log('User Profile:', user);
      return { user };
    } catch (error) {
      console.error('Error fetching user profile:', error);

      throw new NotFoundException('User not found');
    }
  }
  //delete profile
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Request() request): Promise<any> {
    const userId = request.user.id;
    try {
      const user = await this.userService.deleteProfile(userId);
      console.log('User Profile:', user);
      return { user };
    } catch (error) {
      console.error('Error fetching user profile:', error);

      throw new NotFoundException('User not found');
    }
  }
  //update profile by id
  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updated_data: any,
  ): Promise<object> {
    return await this.userService.update(id, updated_data);
  }
  //delete profile by id
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return await this.userService.delete(id);
  }
  //gel all user
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getAllUser(): Promise<object> {
    return await this.userService.getAllUser();
  }
  //password change
  @Post('request')
  async requestPasswordReset(@Body('email') email: string) {
    return this.userService.createPasswordResetToken(email);
  }
  //password reset
  @Put('reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    const isValid = await this.userService.validateToken(token);
    if (!isValid) {
      throw new BadRequestException('Invalid token');
    }
    return this.userService.resetPassword(token, password);
  }
}
