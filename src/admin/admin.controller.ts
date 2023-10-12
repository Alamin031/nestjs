import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Request,
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
}
