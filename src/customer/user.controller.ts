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
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
