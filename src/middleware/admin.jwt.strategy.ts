import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const admin = await this.authService.validateAdminById(payload.sub);
    console.log('admin Profile:', admin);

    if (!admin) {
      throw new UnauthorizedException('Invalid admin token');
    }
    return admin;
  }
}
