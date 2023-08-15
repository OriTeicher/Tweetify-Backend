import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async hashNonDeterministic(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }

  async hashDeterministic(data: string | Buffer): Promise<string> {
    return hash(data, this.configService.get<string>('SECRET_SALT'));
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
