import { IRepository } from '../interfaces/repsoitory.interface';
import {
  DocumentData,
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@firebase/firestore';
import { USERS_COLLECTION, USERS_UUID_PREFIX } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import {
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';

export class UserRepositry implements IRepository<UserEntity> {
  constructor(
    @Inject(Firestore)
    private readonly db: Firestore,
  ) {}

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

  private getUserFromDoc(doc: DocumentData): UserEntity {
    return {
      id: doc.get('id'),
      username: doc.get('username'),
      email: doc.get('email'),
      displayName: doc.get('displayName'),
      password: null,
    };
  }

  async create(entity: UserEntity) {
    await this.validateUniqueConstraints(entity);
    try {
      const userUuid = USERS_UUID_PREFIX + uuidv4();
      await setDoc(doc(this.db, USERS_COLLECTION, userUuid), {
        id: userUuid,
        ...entity,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<UserEntity[]> {
    const docs = await getDocs(query(collection(this.db, USERS_COLLECTION)));
    const users: UserEntity[] = [];

    docs.forEach((doc: DocumentData) => {
      users.push(this.getUserFromDoc(doc));
    });

    return users;
  }

  async findOne(id: string): Promise<UserEntity> {
    const userDoc = await getDoc(doc(this.db, USERS_COLLECTION, id));
    if (!userDoc.exists())
      throw new NotFoundException(`User with id: ${id} does not exist`);
    return this.getUserFromDoc(userDoc);
  }

  async update(id: string, entity: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findOne(id);
    await updateDoc(doc(this.db, USERS_COLLECTION, id), { ...entity });
    Object.assign(user, entity);
    return user;
  }

  async remove(id: string) {
    await this.findOne(id);
    await deleteDoc(doc(this.db, USERS_COLLECTION, id));
  }
}
