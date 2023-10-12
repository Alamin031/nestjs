import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUserById(payload.sub);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid user token');
    }
    return user;
  }
}
