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

@Injectable()
export class UserRepositry extends BaseRepository<UserEntity> {
  constructor(db: Firestore) {
    super(db, UserEntity);
  }

  private getEmptyUser(): UserEntity {
    return {
      id: null,
      email: null,
      hashedEmail: null,
      password: null,
      username: null,
      displayName: null,
      createdAt: null,
      postsId: [] as string[],
    };
  }

  private async isUnique(
    field: string,
    fieldToMatch: string,
  ): Promise<boolean> {
    const isUniqueQuery = query(
      collection(this.db, USERS_COLLECTION),
      where(fieldToMatch, '==', field),
    );

    return (await getDocs(isUniqueQuery)).empty;
  }

  private async validateUniqueConstraints(entity: UserEntity) {
    const isEmailUnique = await this.isUnique(entity.email, 'email');
    const isUsernameUnique = await this.isUnique(entity.username, 'username');

    if (!isEmailUnique)
      throw new ConflictException(
        `User with email: '${entity.email}' already exists`,
      );

    if (!isUsernameUnique)
      throw new ConflictException(
        `User with username: '${entity.username}' already exists`,
      );
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const newEntity = Object.assign(this.getEmptyUser(), entity);
    await this.validateUniqueConstraints(newEntity);
    return await super.create(newEntity, USERS_COLLECTION);
  }

  async findAll(paginationQueryDto: PaginationQueryDto): Promise<UserEntity[]> {
    return await super.findAll(paginationQueryDto, USERS_COLLECTION);
  }

  async findOne(id: string): Promise<UserEntity> {
    return await super.findOne(id, USERS_COLLECTION);
  }

  async findOneEmail(email: string): Promise<UserEntity> {
    return await super.findOneEmail(email, USERS_COLLECTION);
  }

  async update(id: string, entity: Partial<UserEntity>): Promise<UserEntity> {
    return await super.update(id, entity, USERS_COLLECTION);
  }

  async remove(id: string) {
    await super.remove(id, USERS_COLLECTION);
  }
}
