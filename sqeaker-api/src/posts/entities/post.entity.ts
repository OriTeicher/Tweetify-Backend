import { Type } from 'class-transformer';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import {
  SetCreatedAt,
  SetID,
} from 'src/common/reflection/decorators/setCreatedAt.decorator';
import { POSTS_UUID_PREFIX } from 'src/database/constants';
import { UserEntity } from 'src/users/entities/user.entity';

export class PostEntity {
  @SetID(POSTS_UUID_PREFIX)
  readonly id: string;

  @Type(() => UserEntity)
  readonly owner: UserEntity;

  readonly imgUrl?: string;

  @SetCreatedAt(Date.now())
  readonly createdAt: number;

  readonly likes: number;

  readonly resqueaks: number;

  readonly content?: string;

  readonly comments: CommentEntity[];
}
