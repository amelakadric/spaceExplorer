import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatusEnum } from '../../shared/enums/post-status.enum';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsEnum(PostStatusEnum)
  status?: PostStatusEnum;
}
