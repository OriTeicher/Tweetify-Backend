import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserEntity {
  readonly id: string;

  readonly email: string;

  readonly username: string;

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
