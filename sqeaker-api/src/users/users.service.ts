import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepositry) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({ ...createUserDto } as UserEntity);
  }

  findAll(paginationQueryDto: PaginationQueryDto) {
    return this.usersRepository.findAll(paginationQueryDto);
  }

  findOne(id: string) {
    return this.usersRepository.findOne(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, {
      ...updateUserDto,
    } as UserEntity);
  }

  remove(id: string) {
    return this.usersRepository.remove(id);
  }
}
