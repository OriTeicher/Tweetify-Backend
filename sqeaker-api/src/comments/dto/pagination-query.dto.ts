import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  readonly limit: number;

  @IsString()
  @IsOptional()
  readonly startAt: string;
}
