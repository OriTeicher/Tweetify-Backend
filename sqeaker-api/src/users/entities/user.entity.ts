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

  @Exclude()
  readonly password: string;

  @SetCreatedAt()
  readonly createdAt: number;

  readonly description: string;

  readonly followers: string[];

  readonly following: string[];

  readonly isAdmin: boolean;

  readonly isVerified: boolean;

  readonly username: string;

  readonly postsId: string[];

  readonly displayName: string;

  readonly profileBgUrl?: string;

  readonly profileImgUrl?: string;
}
