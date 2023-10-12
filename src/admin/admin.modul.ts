import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AdminService } from './admin.service';
import { AdminJwtStrategy } from 'src/middleware/admin.jwt.strategy';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin' }), // Use the 'admin' strategy here
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
  ],
  controllers: [AdminController],

  providers: [
    AdminService,
    AuthService,
    JwtService,
    AdminJwtStrategy,
    PrismaService,
  ],
})
export class AdminModule {}
