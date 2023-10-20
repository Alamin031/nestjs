import { Injectable, NotFoundException } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
import { UserSignupDtoType, updateDtoType } from 'src/customer/dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

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

  // * Feature 7 : View Customer Images
  async getCustomerImages(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user.avatar;
    } catch (error) {
      throw new Error('Error fetching customer data: ' + error.message);
    }
  }

  async getAllCustomerData(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();

      return users;
    } catch (error) {
      throw new Error('Error fetching customer data: ' + error.message);
    }
  }

  //add customer
  async addUser(
    files: Express.Multer.File[],
    signup: UserSignupDtoType,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signup.email },
    });
    console.log('existingUser:', existingUser);
    console.log('files:', files);

    if (existingUser) {
      throw new Error('Email already registered');
    }
    let avatar = files.find((file) => file.fieldname === 'avatar');
    console.log('avatar:', avatar);
    console.log('avatar.filename:', avatar.filename);
    if (!avatar) {
      avatar = null;
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signup.password, salt);
    // Parse 'age' and 'Visits' as integers
    const age = parseInt(signup.age, 10);
    const Visits = parseInt(signup.Visits, 10);
    const newUser = await this.prisma.user.create({
      data: {
        email: signup.email,
        firstName: signup.firstName,
        lastName: signup.lastName,
        age: age,
        Visits: Visits,
        password: hashedPassword,
        avatar: avatar.filename,
      },
    });
    console.log('newUser:', newUser);
    // files.forEach((file) => {
    //   console.log(file);
    //   const filePath = file.path;
    //   console.log(filePath);
    //   fs.unlinkSync(filePath);
    // });

    return newUser;
  }

  //delete user by id
  // async deleteuser(id: number): Promise<User> {
  //   try {
  //     const user = await this.prisma.user.delete({
  //       where: {
  //         id: id,
  //       },
  //     });
  //     if (!user) {
  //       throw new NotFoundException('user not found');
  //     }
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async deleteuser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user has an avatar
      if (user.avatar) {
        const avatarPath = `./public/uploads/avatar/${user.avatar}`;

        try {
          fs.unlinkSync(avatarPath);
        } catch (error) {
          console.error('Error deleting user avatar:', error);
        }
      }

      await this.prisma.user.delete({
        where: {
          id: id,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  //update user by id
  async updateuser(
    files: Express.Multer.File[],
    id: number,
    data: updateDtoType,
  ): Promise<User> {
    let avatar = files.find((file) => file.fieldname === 'avatar');
    console.log('my img:', avatar);
    if (!avatar) {
      avatar = null;
    }
    const updateData: Record<string, any> = {};
    if (data.age) {
      updateData.age = parseInt(data.age, 10);
    }
    if (data.Visits) {
      updateData.Visits = parseInt(data.Visits, 10);
    }
    if (data.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(data.password, salt);
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (avatar) {
        if (user.avatar) {
          // const avatarPath = `${avatar.destination}/${user.avatar}`;
          const avatarPath = `./public/uploads/avatar/${user.avatar}`;

          if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
          }
          console.log('avatarPath:', avatarPath);
          console.log('avatar:', avatar);
          console.log('avatar.filename:', avatar.filename);
        }
        // Set the new avatar
        updateData.avatar = avatar.filename;
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          ...updateData,
        },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
