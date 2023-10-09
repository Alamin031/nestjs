import { Module } from '@nestjs/common';
import { UserController } from 'src/customer/user.controller';
// import { UserService } from 'src/customer/user.service';
// import { AuthService } from 'src/auth/auth.service';
// import { JwtService } from '@nestjs/jwt';
// import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [DrizzleModule],
  controllers: [UserController],
  // providers: [UserService, AuthService, JwtService, JwtStrategy],
  providers: [UserService, AuthService],
})
export class UserModule {}
