import {
  IsArray,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  @IsEmpty()
  readonly hashedEmail: string;

  @IsOptional()
  @IsEmpty()
  readonly refreshToken: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly displayName: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly profileBgUrl: string;

  @IsString()
  @IsOptional()
  readonly profileImgUrl: string;
}
