import { BaseRepository } from './base-repsoitory.repository';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { USERS_COLLECTION, USERS_UUID_PREFIX } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class UserRepositry extends BaseRepository<UserEntity> {
  constructor(db: Firestore) {
    super(db, UserEntity);
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

  async createUser(entity: UserEntity): Promise<UserEntity> {
    Object.assign(entity, { id: USERS_UUID_PREFIX + uuidv4() });
    await this.validateUniqueConstraints(entity);
    return super.create(USERS_COLLECTION, entity);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return super.findAll(USERS_COLLECTION);
  }

  async findOneUser(id: string): Promise<UserEntity> {
    return await super.findOne(USERS_COLLECTION, id);
  }

  async updateUser(
    id: string,
    entity: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return await super.update(USERS_COLLECTION, id, entity);
  }

  async removeUser(id: string) {
    await super.remove(USERS_COLLECTION, id);
  }
}
