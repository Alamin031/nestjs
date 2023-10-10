import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  async generateToken(payload: Record<string, any>): Promise<string> {
    return this.nestJwtService.sign(payload);
  }

  // async verifyToken(token: string): Promise<Record<string, any>> {
  //   try {
  //     const decoded = this.nestJwtService.verify(token);
  //     return decoded;
  //   } catch (error) {
  //     throw new Error('Invalid token');
  //   }
  // }
}
