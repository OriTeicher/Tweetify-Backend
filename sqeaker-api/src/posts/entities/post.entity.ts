import { Type } from 'class-transformer';
import { Comment } from 'src/comments/entities/comment.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class PostEntity {
  readonly id: string;

  @Type(() => UserEntity)
  readonly owner: UserEntity;

  readonly imgUrl?: string;

  readonly createdAt: number;

  readonly likes: number;

  readonly resqueaks: number;

  readonly content?: string;

  readonly comments: Comment[];
}
