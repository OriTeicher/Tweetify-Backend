import { BaseRepository } from './base-repsoitory.repository';
import { Firestore } from '@firebase/firestore';
import { POSTS_COLLECTION, POSTS_UUID_PREFIX } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { PostEntity } from 'src/posts/entities/post.entity';

@Injectable()
export class PostRepsitory extends BaseRepository<PostEntity> {
  constructor(db: Firestore) {
    super(db, PostEntity);
  }

  async create(entity: PostEntity): Promise<PostEntity> {
    Object.assign(entity, { id: POSTS_UUID_PREFIX + uuidv4() });
    return super.create(entity, POSTS_COLLECTION);
  }

  async findAll(): Promise<PostEntity[]> {
    return super.findAll(POSTS_COLLECTION);
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
