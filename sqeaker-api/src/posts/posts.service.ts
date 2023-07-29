import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepsitory } from 'src/database/repositories/posts.repository';
import { UserRepositry } from 'src/database/repositories/user.repository';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepsitory,
    private readonly userRepsitory: UserRepositry,
  ) {}

  private async createEmptyPost(
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const user = await this.userRepsitory.findOneUser(createPostDto.userId);
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

    return await this.postRepository.createPost(post);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
