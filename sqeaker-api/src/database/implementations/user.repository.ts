import { IRepository } from '../interfaces/repsoitory.interface';
import {
  DocumentData,
  Firestore,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  query,
  setDoc,
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
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { NotFoundError } from 'rxjs';

export class UserRepositry implements IRepository<CreateUserDto> {
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

  private async validateUniqueConstraints(entity: CreateUserDto) {
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

  async create(entity: CreateUserDto) {
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

  update(id: string, entity: CreateUserDto) {
    throw new Error('Method not implemented.');
  }

  delete(id: string) {
    throw new Error('Method not implemented.');
  }
}
