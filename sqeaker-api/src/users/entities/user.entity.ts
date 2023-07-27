import { Exclude, Expose } from 'class-transformer';

@Expose()
export class User {
  readonly id: string;

  readonly email: string;

  readonly username: string;

  @Exclude()
  readonly password: string;

  readonly displayName: string;
}
