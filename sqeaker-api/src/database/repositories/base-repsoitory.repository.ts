import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAt,
  updateDoc,
  where,
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
import { PaginationQueryDto } from 'src/comments/dto/pagination-query.dto';
import { ORDER_BY } from '../constants';
import { Investigator } from 'src/common/reflection/investigator';

class EntityBase {
  id: string;
}

export class BaseRepository<E extends EntityBase> {
  private readonly investigator: Investigator<E>;

  constructor(
    protected readonly db: Firestore,
    protected readonly entityCtor: ClassConstructor<E>,
  ) {
    this.investigator = new Investigator<E>(this.entityCtor);
  }

  protected async create(entity: E): Promise<E>;
  protected async create(entity: E, collectionPath?: string): Promise<E>;

  protected async create(entity: E, collectionPath?: string): Promise<E> {
    try {
      Object.assign(entity, this.investigator.collectMetadata(entity));
      await setDoc(
        doc(this.db, collectionPath, entity.id),
        instanceToPlain(entity),
      );
      return entity;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  protected async findAll(paginationQueryDto: PaginationQueryDto): Promise<E[]>;
  protected async findAll(
    paginationQueryDto: PaginationQueryDto,
    collectionPath?: string,
  ): Promise<E[]>;

  protected async findAll(
    paginationQueryDto: PaginationQueryDto,
    collectionPath?: string,
  ): Promise<E[]> {
    let docs;

    if (Object.entries(paginationQueryDto).length !== 0) {
      docs = await getDocs(
        query(
          collection(this.db, collectionPath),
          limit(paginationQueryDto?.limit),
          orderBy(ORDER_BY),
          startAt(paginationQueryDto?.offset),
        ),
      );
    } else {
      docs = await getDocs(query(collection(this.db, collectionPath)));
    }
    return docs.docs.map((doc) => plainToInstance(this.entityCtor, doc.data()));
  }

  protected async findOne(id: string): Promise<E>;
  protected async findOne(id: string, collectionPath?: string): Promise<E>;

  protected async findOne(id: string, collectionPath?: string): Promise<E> {
    const entityDoc = await getDoc(doc(this.db, collectionPath, id));
    if (!entityDoc.exists())
      throw new NotFoundException(
        `${this.investigator.getClassName()} with id: ${id} does not exist`,
      );
    return plainToInstance(this.entityCtor, entityDoc.data());
  }

  protected async findOneEmail(id: string): Promise<E>;
  protected async findOneEmail(id: string, collectionPath?: string): Promise<E>;

  protected async findOneEmail(
    email: string,
    collectionPath?: string,
  ): Promise<E> {
    const entityDoc = await getDocs(
      query(
        collection(this.db, collectionPath),
        where('hashedEmail', '==', email),
      ),
    );

    if (entityDoc.docs.length <= 0)
      throw new NotFoundException(
        `${this.investigator.getClassName()} does not exist`,
      );
    return entityDoc.docs.map((doc) => {
      return plainToInstance(this.entityCtor, doc.data(), {
        ignoreDecorators: true,
      });
    })[0];
  }

  protected async update(id: string, entity: Partial<E>): Promise<E>;
  protected async update(
    id: string,
    entity: Partial<E>,
    collectionPath?: string,
  ): Promise<E>;

  protected async update(
    id: string,
    entity: Partial<E>,
    collectionPath?: string,
  ): Promise<E> {
    try {
      const dbEntity = await this.findOne(id, collectionPath);
      await updateDoc(
        doc(this.db, collectionPath, id),
        instanceToPlain(entity),
      );
      Object.assign(dbEntity, entity);
      return dbEntity;
    } catch (error) {
      throw new NotFoundException(
        `${this.entityCtor.name} with id: ${id} does not exist`,
      );
    }
  }

  protected async remove(id: string): Promise<void>;
  protected async remove(id: string, collectionPath?: string): Promise<void>;

  protected async remove(id: string, collectionPath?: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, collectionPath, id));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
