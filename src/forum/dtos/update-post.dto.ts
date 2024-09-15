import { IsEnum } from 'class-validator';
import { PostStatusEnum } from '../../shared/enums/post-status.enum';

export class UpdatePostDto {
  @IsEnum(PostStatusEnum)
  status: PostStatusEnum;
}
