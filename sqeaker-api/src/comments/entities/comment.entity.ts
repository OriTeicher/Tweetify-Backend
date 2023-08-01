import {
  SetCreatedAt,
  SetID,
} from 'src/common/reflection/decorators/setCreatedAt.decorator';
import { COMMENTS_UUID_PREFIX } from 'src/database/constants';

export class CommentEntity {
  @SetID(COMMENTS_UUID_PREFIX)
  readonly id: string;

  @SetCreatedAt()
  readonly createdAt: number;

  readonly ownerId: string;

  readonly postId: string;

  readonly likes: number;

  readonly resqueaks: number;

  readonly content: string;
}
