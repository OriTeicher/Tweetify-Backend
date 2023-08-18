import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Req() request: Request) {
    const user = await this.authService.signin(request);
    return user;
  }

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('sign-out')
  signOut(@Req() request: Request) {
    return this.authService.signout(request);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }
}
