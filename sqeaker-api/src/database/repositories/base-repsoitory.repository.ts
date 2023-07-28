import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';

class EntityBase {
  id: string;
}

export class BaseRepository<E extends EntityBase> {
  constructor(
    protected readonly db: Firestore,
    private readonly entityCtor: ClassConstructor<E>,
  ) {}

  protected async create(collectionPath: string, entity: E): Promise<E> {
    try {
      await setDoc(doc(this.db, collectionPath, entity.id), {
        ...entity,
      });
      return entity;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  protected async findAll(collectionPath: string): Promise<E[]> {
    const docs = await getDocs(query(collection(this.db, collectionPath)));
    const entities: E[] = [];

    docs.forEach((doc) => {
      entities.push(plainToInstance(this.entityCtor, doc.data()));
    });

    return entities;
  }

  protected async findOne(collectionPath: string, id: string): Promise<E> {
    const entityDoc = await getDoc(doc(this.db, collectionPath, id));
    if (!entityDoc.exists())
      throw new NotFoundException(
        `${this.entityCtor.name} with id: ${id} does not exist`,
      );
    return plainToInstance(this.entityCtor, entityDoc.data());
  }

  protected async update(
    collectionPath: string,
    id: string,
    entity: Partial<E>,
  ): Promise<E> {
    const dbEntity = await this.findOne(collectionPath, id);
    await updateDoc(doc(this.db, collectionPath, id), instanceToPlain(entity));
    Object.assign(dbEntity, entity);
    return dbEntity;
  }

  protected async remove(collectionPath: string, id: string): Promise<void> {
    await this.findOne(collectionPath, id);
    await deleteDoc(doc(this.db, collectionPath, id));
  }
}
