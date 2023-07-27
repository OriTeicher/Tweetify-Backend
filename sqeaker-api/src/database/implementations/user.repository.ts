import { IRepository } from '../interfaces/repsoitory.interface';
import { Firestore, doc, setDoc } from '@firebase/firestore';
import { USERS_COLLECTION, USERS_UUID_PREFIX } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UserRepositry implements IRepository<CreateUserDto> {
  constructor(
    @Inject(Firestore)
    private readonly db: Firestore,
  ) {}

  async create(entity: CreateUserDto) {
    try {
      const userUuid = USERS_UUID_PREFIX + uuidv4();

      console.log({ id: userUuid, ...entity });

      await setDoc(doc(this.db, USERS_COLLECTION, userUuid), {
        id: userUuid,
        ...entity,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    throw new Error('Method not implemented.');
  }

  findOne(id: string) {
    throw new Error('Method not implemented.');
  }

  update(id: string, entity: CreateUserDto) {
    throw new Error('Method not implemented.');
  }

  delete(id: string) {
    throw new Error('Method not implemented.');
  }
}
