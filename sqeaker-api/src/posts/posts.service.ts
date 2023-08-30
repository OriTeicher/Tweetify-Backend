import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { PostEntity } from './entities/post.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { REQUEST_USER_KEY } from 'src/iam/constants';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepsitory,
    private readonly usersRepository: UserRepositry,
  ) {}

  private createEmptyPost(
    request: Request,
    createPostDto: CreatePostDto,
  ): PostEntity {
    return {
      id: null,
      owner: request[REQUEST_USER_KEY] as UserEntity,
      imgUrl: createPostDto?.imgUrl || null,
      createdAt: null,
      likes: 0,
      resqueaks: 0,
      content: createPostDto?.content || null,
      comments: [],
      likedId: [],
    };
  }

  private async updateUser(user: UserEntity, savedPost: PostEntity) {
    user.postsId.push(savedPost.id);
    await this.usersRepository.update(user.id, user);
  }

  async create(request: Request, createPostDto: CreatePostDto) {
    const post = this.createEmptyPost(request, createPostDto);
    const savedPost = await this.postRepository.create(post);

    const user = request[REQUEST_USER_KEY] as UserEntity;
    this.updateUser(user, savedPost);

    return savedPost;
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return await this.postRepository.findAll(paginationQueryDto);
  }

  async findOne(id: string) {
    return await this.postRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (post.likes < updatePostDto.likes) {
      post.likedId.push(updatePostDto.userId);
    } else {
      const index = post.likedId.findIndex((id) => id === updatePostDto.userId);
      post.likedId.splice(index, 1);
    }
    Object.assign(post, updatePostDto);

    return await this.postRepository.update(id, post);
  }

  async remove(id: string) {
    await this.postRepository.remove(id);
  }
}
