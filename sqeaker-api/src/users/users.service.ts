import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositry } from 'src/database/implementations/user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepositry) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.createUser({ ...createUserDto } as UserEntity);
  }

  findAll() {
    return this.usersRepository.findAllUsers();
  }

  findOne(id: string) {
    return this.usersRepository.findOneUser(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.updateUser(id, {
      ...updateUserDto,
    } as UserEntity);
  }

  remove(id: string) {
    return this.usersRepository.removeUser(id);
  }
}
