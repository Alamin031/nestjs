import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';
import { PG_CONNECTION } from 'src/drizzle/constants';
import * as schema from 'src/drizzle/schema';
import * as bcrypt from 'bcrypt';

function DBConn() {
  return Inject(PG_CONNECTION);
}

@Injectable()
export class AuthService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @DBConn() private conn: NodePgDatabase<typeof schema>,
  ) {}
  async adminsignup(data: adminSignupDtoType): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      // const { email } = data;

      const user = await this.conn.query.admin.findFirst();
      console.log(user);

      // if (user) {
      //   throw new ConflictException('Email already exists');
      // }
      // const newUser = await this.conn.admin.insert(data).exec();
      return 0;
    } catch (error) {
      throw error;
    }
  }
  // //login and token jenerete
  // async login(data: adminLoginDtoType): Promise<{ accessToken: string }> {
  //   const { email, password } = data;
  //   const user = await this.conn.query.admin.findFirst({
  //     // where: {
  //     //   email,
  //     // },
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   const valid = await bcrypt.compare(password, user.password);
  //   if (!valid) {
  //     throw new Error('Invalid password');
  //   }
  //   const accessToken = 'token';
  //   return { accessToken };
  // }

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
