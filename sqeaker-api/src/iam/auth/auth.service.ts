import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from '../hash/hash.service';
import { EncryptService } from '../encrypt/encrypt.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly JwtCofnig: ConfigType<typeof jwtConfig>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const email = this.encryptService.encrypt(createUserDto.email);
    const password = await this.hashService.hashNonDeterministic(
      createUserDto.password,
    );
    const hashedEmail = await this.hashService.hashDeterministic(
      createUserDto.email,
    );

    const user = await this.usersService.create({
      ...createUserDto,
      email,
      username: createUserDto.username,
      displayName: createUserDto.displayName,
      password,
      hashedEmail,
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const hashedEmail = await this.hashService.hashDeterministic(email);
    const user = await this.usersService.findOneEmail(hashedEmail);
    const cmpResult = await this.hashService.compare(password, user.password);

    if (user === undefined || !cmpResult) return null;

    return user;
  }

  async signin(request: Request) {
    const user = request[REQUEST_USER_KEY] as UserEntity;
    const accessToken = await this.signToken(
      user,
      this.JwtCofnig.accessTokenTTL,
    );
    const refreshToken = await this.signToken(
      user,
      this.JwtCofnig.refreshTokenTtl,
    );

    await this.usersService.update(user.id, {
      refreshToken: await this.hashService.hashNonDeterministic(refreshToken),
    });

    request.res.setHeader('Set-Cookie', [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${this.JwtCofnig.accessTokenTTL}`,
      `refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.JwtCofnig.refreshTokenTtl}`,
    ]);

    return user;
  }

  private async signToken(payload: UserEntity, expiresIn: number) {
    return await this.jwtService.signAsync(
      {
        sub: payload?.id,
        email: payload?.email,
      },
      { expiresIn },
    );
  }

  async refresh(request: Request) {
    const user = request['user'] as UserEntity;
    const accessToken = await this.signToken(
      user,
      this.JwtCofnig.accessTokenTTL,
    );

    request.res.setHeader(
      'Set-Cookie',
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${this.JwtCofnig.accessTokenTTL}`,
    );

    return user;
  }

  async signout(request: Request) {
    request.res.setHeader('Set-Cookie', [
      'accessToken=; HttpOnly; Path=/; Max-Age=0',
      'refresh=; HttpOnly; Path=/; Max-Age=',
    ]);
  }
}
