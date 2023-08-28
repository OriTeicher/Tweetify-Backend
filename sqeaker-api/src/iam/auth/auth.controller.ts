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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CacheType } from 'src/cache/cache.enum';
import { Cache } from 'src/cache/cache.decorator';

@Cache(CacheType.SHOULD_NOT_CACHE)
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

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Req() request: Request) {
    return this.authService.signout(request);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Cache(CacheType.SHOULD_CACHE)
  @Post('/ping')
  ping(@Req() request: Request) {
    return this.authService.ping(request);
  }
}
