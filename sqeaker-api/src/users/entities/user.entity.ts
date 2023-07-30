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

  readonly email: string;

  readonly username: string;

  @SetCreatedAt(Date.now())
  readonly createdAt: number;

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
