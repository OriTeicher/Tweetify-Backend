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
  runTransaction,
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
        paginationQueryDto?.startAt
          ? query(
              collection(this.db, collectionPath),
              orderBy(ORDER_BY, 'desc'),
              limit(paginationQueryDto?.limit || 25),
              startAt(paginationQueryDto.startAt),
            )
          : query(
              collection(this.db, collectionPath),
              orderBy(ORDER_BY, 'desc'),
              limit(paginationQueryDto?.limit || 25),
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
    return plainToInstance(this.entityCtor, entityDoc.data(), {
      ignoreDecorators: true,
    });
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
    updatedEntity: Partial<E>,
    collectionPath?: string,
  ): Promise<E>;

  protected async update(
    id: string,
    updatedEntity: Partial<E>,
    collectionPath?: string,
  ): Promise<E> {
    try {
      const newEntity = await this.findOne(id, collectionPath);
      await updateDoc(
        doc(this.db, collectionPath, id),
        instanceToPlain(updatedEntity),
      );
      Object.assign(newEntity, updatedEntity);

      return newEntity;
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

  protected async transaction(
    entityId: string,
    transactionCb: (entity: unknown) => unknown,
  );
  protected async transaction(
    entityId: string,
    transactionCb: (entity: unknown) => unknown,
    collectionPath?: string,
  );

  protected async transaction(
    entityId: string,
    transactionCb: (entity: unknown) => unknown,
    collectionPath?: string,
  ) {
    const docRef = doc(this.db, collectionPath, entityId);
    return runTransaction(this.db, async (transaction) => {
      try {
        const doc = await transaction.get(docRef);
        const cbResult = transactionCb(doc.data());
        transaction.update(docRef, cbResult);
        return cbResult;
      } catch (error) {
        console.log(error);
      }
    });
  }
}
