import { IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly userId: string;

  @IsPositive()
  readonly createdAt: number;

  @IsUrl()
  @IsOptional()
  readonly imgUrl: string;

  @IsString()
  @IsOptional()
  readonly content: string;
}
