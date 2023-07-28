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
import { User } from 'src/users/entities/user.entity';

export class UserRepositry implements IRepository<User> {
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

  private async validateUniqueConstraints(entity: User) {
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

  private getUserFromDoc(doc: DocumentData): User {
    return {
      id: doc.get('id'),
      username: doc.get('username'),
      email: doc.get('email'),
      displayName: doc.get('displayName'),
      password: null,
    };
  }

  async create(entity: User) {
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

  async findAll(): Promise<User[]> {
    const docs = await getDocs(query(collection(this.db, USERS_COLLECTION)));
    const users: User[] = [];

    docs.forEach((doc: DocumentData) => {
      users.push(this.getUserFromDoc(doc));
    });

    return users;
  }

  async findOne(id: string): Promise<User> {
    const userDoc = await getDoc(doc(this.db, USERS_COLLECTION, id));
    if (!userDoc.exists())
      throw new NotFoundException(`User with id: ${id} does not exist`);
    return this.getUserFromDoc(userDoc);
  }

  async update(id: string, entity: Partial<User>): Promise<User> {
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
