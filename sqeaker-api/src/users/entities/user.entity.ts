import { Exclude, Expose } from 'class-transformer';
import {
  SetID,
  SetCreatedAt,
} from 'src/common/reflection/decorators/setCreatedAt.decorator';
import { USERS_UUID_PREFIX } from 'src/database/constants';

@Expose()
export class UserEntity {
  @SetID(USERS_UUID_PREFIX)
  readonly id: string;

  @Exclude()
  readonly email: string;

  @Exclude()
  readonly hashedEmail: string;

  @Exclude()
  readonly refreshToken: string;

  readonly username: string;

  @SetCreatedAt()
  readonly createdAt: number;

  readonly postsId: string[];

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
