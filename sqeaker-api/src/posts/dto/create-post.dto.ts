import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly userId: string;

  @IsUrl()
  @IsOptional()
  readonly imgUrl: string;

  @IsString()
  @IsOptional()
  readonly content: string;
}
