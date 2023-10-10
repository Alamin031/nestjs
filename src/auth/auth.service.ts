import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';
import { PG_CONNECTION } from 'src/drizzle/constants';
import * as schema from 'src/drizzle/schema';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDtoType, loginDtoType } from 'src/customer/dto/signup.dto';
import { JwtService } from '@nestjs/jwt';

function DBConn() {
  return Inject(PG_CONNECTION);
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private prisma: PrismaService,
    // eslint-disable-next-line no-unused-vars
    @DBConn() private conn: NodePgDatabase<typeof schema>,
  ) {}
  async adminsignup(data: adminSignupDtoType): Promise<adminSignupDtoType> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      // const { email } = data;

      const admin = await this.conn.query.admin.findFirst();
      console.log(admin);

      // if (user) {
      //   throw new ConflictException('Email already exists');
      // }
      // const newUser = await this.conn.admin.insert(data).exec();
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async createUser() {
    const user = await this.prisma.user.create({
      data: {
        name: 'hridoy',
        email: 'hridoy@mail.com',
        password: 'hridouhghfj',
      },
    });

    return user;
  }
  async usersignup(data: SignupDtoType): Promise<SignupDtoType> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);

      const newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }
  //login and token jenerete
  async login(data: loginDtoType): Promise<{ accessToken: string }> {
    const { email, password } = data;
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const accessToken = this.jwtService.sign({ sub: user.id });
    return { accessToken };
  }
  // Validate user by ID (usually called from JwtStrategy)
  async validateUserById(id: number): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // // Validate user by ID (usually called from JwtStrategy)
  // async validateUserById(id: number): Promise<any> {
  //   const user = await this.conn.query.admin.findFirst({
  //     // where: {
  //     //   id,
  //     // },
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   return user;
  // }
}
