import { User } from 'src/users/entities/user.entity';
import { IRepository } from '../interfaces/repsoitory.interface';
import { Firestore, doc, setDoc } from '@firebase/firestore';
import { USERS_COLLECTION, USERS_UUID_PREFIX } from '../constants';
import { uuid } from 'uuidv4';

export class UserRepositry implements IRepository<User> {
  constructor(private readonly db: Firestore) {}

  async create(entity: User) {
    try {
      const userUuid = USERS_UUID_PREFIX + uuid();
      await setDoc(doc(this.db, userUuid, USERS_COLLECTION), entity);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    throw new Error('Method not implemented.');
  }

  findOne(id: string) {
    throw new Error('Method not implemented.');
  }

  update(id: string, entity: User) {
    throw new Error('Method not implemented.');
  }

  delete(id: string) {
    throw new Error('Method not implemented.');
  }
}
