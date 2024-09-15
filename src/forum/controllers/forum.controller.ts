import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UserJwtPayload } from '../../auth/types/user-jwt-payload';
import { GetCurrentUser } from '../../shared/decorators/get-current-user.decorator';
import { PostService } from '../services/post.service';

@Controller('forum')
export class ForumController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post('create-post')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @GetCurrentUser() user: UserJwtPayload,
  ) {
    const imagePath = file ? file.filename : null;
    const post = await this.postService.createPost(content, user.id, imagePath);

    return {
      message: 'Post created successfully!',
      post,
    };
  }
}
