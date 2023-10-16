import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminJwtAuthGuard } from 'src/auth/jwt/admin.jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('profile')
  @UseGuards(AdminJwtAuthGuard)
  async getProfilee(@Request() request): Promise<any> {
    const userId = request.user.id;
    try {
      const admin = await this.adminService.getProfile(userId);
      console.log('admin Profile:', admin);
      return { admin };
    } catch (error) {
      console.error('Error fetching admin profile:', error);

      throw new NotFoundException('admin not found');
    }
  }
  //update profile by id
  @Put('update/:id')
  @UseGuards(AdminJwtAuthGuard)
  async updateProfile(@Request() request, @Param('id') id: number) {
    try {
      const admin = await this.adminService.updateProfile(id, request.body);
      return { admin };
    } catch (error) {
      console.error('Error updating admin profile:', error);

      throw new NotFoundException('admin not found');
    }
  }

  //delete profile by id
  @Delete('delete/:id')
  @UseGuards(AdminJwtAuthGuard)
  async deleteProfile(@Param('id') id: number) {
    try {
      const admin = await this.adminService.deleteProfile(id);
      return { admin };
    } catch (error) {
      console.error('Error deleting admin profile:', error);

      throw new NotFoundException('admin not found');
    }
  }
}
