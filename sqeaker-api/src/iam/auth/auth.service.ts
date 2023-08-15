import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { HashService } from '../hash/hash.service';
import { EncryptService } from '../encrypt/encrypt.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const email = this.encryptService.encrypt(createUserDto.email);
    const phoneNumber = this.encryptService.encrypt(createUserDto.phoneNumber);
    const password = await this.hashService.hashNonDeterministic(
      createUserDto.password,
    );
    const hashedEmail = await this.hashService.hashDeterministic(
      createUserDto.email,
    );

    const user = await this.usersService.create({
      ...createUserDto,
      email,
      phoneNumber,
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
    const user = request['user'] as UserEntity;
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: accessToken,
    };
  }
}
