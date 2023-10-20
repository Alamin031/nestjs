import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminJwtAuthGuard } from 'src/auth/jwt/admin.jwt.guard';
import { multerOptions } from 'src/middleware/multer.config';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserSignupDtoType, updateDtoType } from 'src/customer/dto/signup.dto';

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

  // * Feature 7 : View Customer Images
  @Get('getimagebycustomerid/:userid')
  async getimg(@Param('userid', ParseIntPipe) userid: number, @Res() res) {
    const filename = await this.adminService.getCustomerImages(userid);
    res.sendFile(filename, { root: './uploads/profile' });
  }

  @Get('allcustomerdata')
  async viewAllCustomerData(): Promise<any> {
    try {
      const users = await this.adminService.getAllCustomerData();

      if (users.length === 0) {
        throw new NotFoundException('No customer data found');
      }

      const usersWithProfilePictures = users.map((user) => {
        if (user.avatar) {
          user.avatar = `/uploads/avatar/${user.avatar}`;
          // console.log('user.profile:', user.avatar);
        }
        return user;
      });

      // console.log('usersWithProfilePictures:', usersWithProfilePictures);
      return usersWithProfilePictures;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      throw new NotFoundException('Error in request');
    }
  }

  //add customer
  @Post('adduser')
  @UseInterceptors(AnyFilesInterceptor(multerOptions('files')))
  async adduser(@UploadedFiles() files: any, @Body() data: UserSignupDtoType) {
    try {
      console.log('data:', data);
      console.log('files:', files);
      const newUser = await this.adminService.addUser(files, data);
      console.log('newUser:', newUser);
      return { message: 'Registration successful', user: newUser };
    } catch (registrationError) {
      return {
        message: 'Registration failed',
        error: registrationError.message,
      };
    }
  }
  catch(error) {
    return { message: error.message };
  }

  //delete user by id
  @Delete('deleteuser/:id')
  async deleteuser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.adminService.deleteuser(id);
      console.log('user:', user);
      return { user };
    } catch (error) {
      console.error('Error deleting user:', error);
      console.log('error:', error);

      throw new NotFoundException('user not found');
    }
  }

  //update user by id
  @Put('updateuser/:id')
  @UseInterceptors(AnyFilesInterceptor(multerOptions('files')))
  async updateuser(
    @UploadedFiles() files: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: updateDtoType,
  ) {
    try {
      const user = await this.adminService.updateuser(files, id, data);

      // Add prefix to avatar field if it exists
      if (user.avatar) {
        user.avatar = `/uploads/avatar/${user.avatar}`;
        console.log('user.avatar:', user.avatar);
      }

      // console.log('user:', user);
      return { user };
    } catch (error) {
      console.error('Error updating user:', error);
      console.log('error:', error);

      throw new NotFoundException('user not found');
    }
  }
}
