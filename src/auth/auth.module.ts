import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    DrizzleModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
    }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
