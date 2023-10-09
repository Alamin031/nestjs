import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
// import { SignupDtoType } from 'src/customer/dto/signup.dto';
import { PG_CONNECTION } from 'src/drizzle/constants';
import * as schema from 'src/drizzle/schema';

function DBConn() {
  return Inject(PG_CONNECTION);
}

@Injectable()
export class AdminService {
  constructor(
    // eslint-disable-next-line no-unused-vars
    @DBConn() private conn: NodePgDatabase<typeof schema>,
  ) {}

  //show profile by id
  // async getAdminById(id: number): Promise<SignupDtoType> {
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
