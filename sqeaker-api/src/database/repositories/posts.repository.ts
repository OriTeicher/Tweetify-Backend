import { BaseRepository } from './base-repsoitory.repository';
import { Firestore } from '@firebase/firestore';
import { POSTS_COLLECTION } from '../constants';
import { Injectable } from '@nestjs/common';
import { PostEntity } from 'src/posts/entities/post.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';

@Injectable()
export class PostRepsitory extends BaseRepository<PostEntity> {
  constructor(db: Firestore) {
    super(db, PostEntity);
  }

  async create(entity: PostEntity): Promise<PostEntity> {
    return await super.create(entity, POSTS_COLLECTION);
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<PostEntity[]> {
    return await super.findAll(paginationQueryDto, POSTS_COLLECTION);
  }

  async findOne(id: string): Promise<PostEntity> {
    return await super.findOne(id, POSTS_COLLECTION);
  }

  async update(id: string, entity: Partial<PostEntity>): Promise<PostEntity> {
    return await super.update(id, entity, POSTS_COLLECTION);
  }

  async remove(id: string) {
    await super.remove(id, POSTS_COLLECTION);
  }
}
