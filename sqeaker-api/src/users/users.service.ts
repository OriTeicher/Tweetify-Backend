import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import SearchUserService from 'src/search/services/search-user.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepositry,
    private readonly postsRepository: PostRepsitory,
    private readonly usersSearchService: SearchUserService,
  ) {}

  async search(text: string) {
    return await this.usersSearchService.searchDocument(text);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return await this.usersRepository.findAll(paginationQueryDto);
  }

  async findOneEmail(hashedEmail: string) {
    return await this.usersRepository.findOneEmail(hashedEmail);
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create({
      ...createUserDto,
    } as UserEntity);

    await this.usersSearchService.indexEntity(user.id, user);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.update(id, {
      ...updateUserDto,
    } as UserEntity);

    await this.usersSearchService.updateEntity(user);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.postsId.forEach(async (postId: string) => {
      await this.postsRepository.remove(postId);
    });
    await this.usersSearchService.deleteDocument(user.id);
    this.usersRepository.remove(id);
  }
}
