import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/customer/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Get('profile/:email')
  // @UseGuards(JwtAuthGuard)
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log({ user });

    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  // delete by id
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.userService.delete(id);
  }
  //update by id
  @Put('update/:id')
  async update(@Param('id') id: number, @Body() user: User) {
    return await this.userService.update(id, user);
  }

  //gel all user
  @Get('user')
  async getAllUser(): Promise<User[]> {
    return await this.userService.getAllUser();
  }

  // //get profile potek by jwt
  // @Get('profile')
  // async getProfileByJwt(@Request() request): Promise<any> {
  //   const userId = request.user.userId;
  //   console.log({ userId });

  //   try {
  //     const user = await this.userService.findById(userId);
  //     return { user };
  //   } catch (error) {
  //     throw new NotFoundException('User not found');
  //   }
  // }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfilee(@Request() request): Promise<any> {
    const userId = request.user.id;
    try {
      const user = await this.userService.getProfilee(userId);
      console.log('User Profile:', user);
      return { user };
    } catch (error) {
      console.error('Error fetching user profile:', error);

      throw new NotFoundException('User not found');
    }
  }
}
