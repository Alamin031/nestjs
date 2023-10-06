import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto, LoginUserDto } from 'src/customer/customer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signup(createUserDto);
      return {
        message: 'User registered successfully',
        user,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginDto);
      return {
        message: 'Login successful',
        data: result,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
