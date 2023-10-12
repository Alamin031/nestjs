import { Module } from '@nestjs/common';
import { UserController } from 'src/customer/user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserJwtStrategy } from 'src/middleware/user.jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    PrismaService,
    JwtService,
    UserJwtStrategy,
  ],
})
export class UserModule {}
