import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/middleware/jwt.strategy';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { AdminService } from './admin.service';

@Module({
  // imports: [TypeOrmModule.forFeature([User])],
  imports: [DrizzleModule],

  providers: [AdminService, AuthService, JwtService, JwtStrategy],
})
export class UserModule {}
