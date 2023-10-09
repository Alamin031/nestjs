import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { adminSignupDtoType } from 'src/admin/dto/admin.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async adminsignup(@Body() data: adminSignupDtoType) {
    try {
      const user = await this.authService.adminsignup(data);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  // @Post('login')
  // async login(@Body() data: adminLoginDtoType) {
  //   try {
  //     const user = await this.authService.login(data);
  //     return {
  //       message: 'User login successfully',
  //       user,
  //     };
  //   } catch (error) {
  //     throw new UnauthorizedException(error.message);
  //   }
  // }
}
