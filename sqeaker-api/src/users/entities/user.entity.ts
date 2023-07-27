import { Exclude, Expose } from 'class-transformer';

@Expose()
export class User {
  readonly email: string;

  readonly userName: string;

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
