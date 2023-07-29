import { Exclude, Expose } from 'class-transformer';
import {
  SetUUID,
  SetCreatedAt,
} from 'src/common/deserialize/decorators/setCreatedAt.decorator';
import { USERS_UUID_PREFIX } from 'src/database/constants';

@Expose()
export class UserEntity {
  @SetUUID(USERS_UUID_PREFIX)
  readonly id: string;

  readonly email: string;

  readonly username: string;

  @SetCreatedAt(Date.now())
  readonly createdAt: number;

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
