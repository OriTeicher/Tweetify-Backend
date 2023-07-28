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
import { POSTS_COLLECTION, POSTS_UUID_PREFIX } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostEntity } from 'src/posts/entities/post.entity';

export class PostRepsitory implements IRepository<PostEntity> {
  constructor(
    @Inject(Firestore)
    private readonly db: Firestore,
  ) {}

  private getPostFromDoc(doc: DocumentData): PostEntity {
    return {
      id: doc.get('id'),
      owner: doc.get('owner'),
      imgUrl: doc.get('imgUrl'),
      createdAt: doc.get('createdAt'),
      likes: doc.get('likes'),
      resqueaks: doc.get('resqueaks'),
      content: doc.get('content'),
      comments: doc.get('comments'),
    };
  }

  async create(entity: PostEntity): Promise<PostEntity> {
    try {
      const postUuid = POSTS_UUID_PREFIX + uuidv4();
      Object.assign(entity, { id: postUuid });
      await setDoc(doc(this.db, POSTS_COLLECTION, postUuid), {
        ...entity,
      });
      return entity;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<PostEntity[]> {
    return null;
  }

  async findOne(id: string): Promise<PostEntity> {
    return null;
  }

  async update(id: string, entity: Partial<PostEntity>): Promise<PostEntity> {
    return null;
  }

  async remove(id: string) {
    return null;
  }
}
