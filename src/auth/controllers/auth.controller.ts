import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LogInDto } from '../dtos/login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() logInDto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.login(logInDto);
    res.cookie('jwt', jwt, { httpOnly: true });
    return { user: logInDto };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User logged out.' };
  }
}
