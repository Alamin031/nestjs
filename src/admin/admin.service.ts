import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: number): Promise<Admin> {
    try {
      console.log('id:', id);
      const profile = await this.prisma.admin.findUnique({
        where: {
          id: id,
        },
      });
      console.log('profile:', profile);
      if (!profile) {
        throw new NotFoundException('admin not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //update profile by id
  async updateProfile(id: number, data: any): Promise<Admin> {
    try {
      const profile = await this.prisma.admin.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });
      if (!profile) {
        throw new NotFoundException('admin not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }

  //delete profile by id
  async deleteProfile(id: number): Promise<Admin> {
    try {
      const profile = await this.prisma.admin.delete({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('admin not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
}
