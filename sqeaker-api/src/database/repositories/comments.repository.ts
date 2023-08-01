import { BaseRepository } from './base-repsoitory.repository';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Injectable()
export class CommentsRepository extends BaseRepository<CommentEntity> {
  constructor(db: Firestore) {
    super(db, CommentEntity);
  }

  async create(entity: CommentEntity): Promise<CommentEntity> {
    throw new Error('Not implemented');
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<CommentEntity[]> {
    throw new Error('Not implemented');
  }

  async findOne(id: string): Promise<CommentEntity> {
    throw new Error('Not implemented');
  }

  async update(
    id: string,
    entity: Partial<CommentEntity>,
  ): Promise<CommentEntity> {
    throw new Error('Not implemented');
  }

  async remove(id: string) {
    throw new Error('Not implemented');
  }
}
