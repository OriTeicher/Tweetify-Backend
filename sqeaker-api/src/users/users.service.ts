import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { PostRepsitory } from 'src/database/repositories/posts.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepositry,
    private readonly postsRepository: PostRepsitory,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create({
      ...createUserDto,
    } as UserEntity);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return await this.usersRepository.findAll(paginationQueryDto);
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, {
      ...updateUserDto,
    } as UserEntity);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.postsId.forEach(async (postId: string) => {
      await this.postsRepository.remove(postId);
    });
    this.usersRepository.remove(id);
  }
}
