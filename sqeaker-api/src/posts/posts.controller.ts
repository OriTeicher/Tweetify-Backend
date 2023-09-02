import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SerializeInterceptor } from 'src/common/serialize/serialize.interceptor';
import { PostEntity } from './entities/post.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { JwtAuthGuard } from 'src/iam/auth/guards/jwt-auth.guard';
import { CacheType } from 'src/cache/cache.enum';
import { Cache } from 'src/cache/cache.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@UseInterceptors(new SerializeInterceptor(PostEntity))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Cache(CacheType.SHOULD_NOT_CACHE)
  @Post()
  create(@Req() request: Request, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(request, createPostDto);
  }

  @Post(':id/like')
  like(@Req() request: Request, @Param('id') id: string) {
    return this.postsService.likePost(request, id);
  }

  @Post(':id/dislike')
  dislike(@Req() request: Request, @Param('id') id: string) {
    return this.postsService.dislikePost(request, id);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.postsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
