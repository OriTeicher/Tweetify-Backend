import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { PostEntity } from './entities/post.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepsitory,
    private readonly userRepsitory: UserRepositry,
  ) {}

  private async createEmptyPost(
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const user = await this.userRepsitory.findOne(createPostDto.userId);
    return {
      id: undefined,
      owner: user,
      imgUrl: createPostDto?.imgUrl || null,
      createdAt: createPostDto.createdAt,
      likes: 0,
      resqueaks: 0,
      content: createPostDto?.content || null,
      comments: [],
    };
  }

  async create(createPostDto: CreatePostDto) {
    const post = await this.createEmptyPost(createPostDto);
    return await this.postRepository.create(post);
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return await this.postRepository.findAll(paginationQueryDto);
  }

  async findOne(id: string) {
    return await this.postRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);
    return await this.postRepository.update(id, post);
  }

  async remove(id: string) {
    await this.postRepository.remove(id);
  }
}
