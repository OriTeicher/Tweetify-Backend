import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsArray, IsOptional, Min } from 'class-validator';
import { CommentEntity } from 'src/comments/entities/comment.entity';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @Min(0)
    @IsOptional()
    readonly likes: number;

    @Min(0)
    @IsOptional()
    readonly resqueaks: number;
  
    @IsArray()
    @IsOptional()
    readonly comments: CommentEntity[];
}
