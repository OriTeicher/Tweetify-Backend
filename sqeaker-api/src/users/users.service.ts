import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositry } from 'src/database/implementations/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepositry) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({ ...createUserDto } as User);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, { ...updateUserDto } as User);
  }

  remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
