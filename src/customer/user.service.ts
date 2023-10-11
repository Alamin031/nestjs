import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService, // eslint-disable-next-line no-unused-vars
  ) {}

  //get profile
  async getProfile(id: number): Promise<User> {
    try {
      const profile = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //update profile
  async updateProfile(id: number, data: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const profile = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //delete profile
  async deleteProfile(id: number): Promise<User> {
    try {
      const profile = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  //update profile by id
  async update(id: number, data: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const profile = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
      if (!profile) {
        throw new NotFoundException('User not found');
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
  async getAllUser(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();
      if (!users) {
        throw new NotFoundException('User not found');
      }
      return users;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
