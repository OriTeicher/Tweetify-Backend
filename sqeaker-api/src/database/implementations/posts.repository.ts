import { BaseRepository } from '../base-repsoitory.repository';
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

  async createPost(entity: PostEntity): Promise<PostEntity> {
    Object.assign(entity, { id: POSTS_UUID_PREFIX + uuidv4() });
    return super.create(POSTS_COLLECTION, entity);
  }

  async findAllPosts(): Promise<PostEntity[]> {
    return super.findAll(POSTS_COLLECTION);
  }

  async findOnePost(id: string): Promise<PostEntity> {
    return await super.findOne(POSTS_COLLECTION, id);
  }

  async updatePost(
    id: string,
    entity: Partial<PostEntity>,
  ): Promise<PostEntity> {
    return await super.update(POSTS_COLLECTION, id, entity);
  }

  async removePost(id: string) {
    await super.remove(POSTS_COLLECTION, id);
  }
}
