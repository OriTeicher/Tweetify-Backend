import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import JwtConfig from '../config/jwt.config';
import { Request } from 'express';
import { TokenDto } from '../auth/dto/token.dto';
import { UsersService } from 'src/users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, tokenDto: TokenDto) {
    const refreshToken = request?.cookies?.refresh;
    const user = await this.usersService.findOne(tokenDto.sub);

    if (!user) throw new UnauthorizedException();

    const cmpResult = await this.hashService.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!cmpResult) throw new UnauthorizedException();

    return user;
  }
}
