import { IsNotEmpty, IsString } from 'class-validator';

export class LikePostDto {
  //@IsString()
  //@IsNotEmpty()
  readonly postid: string;
}
