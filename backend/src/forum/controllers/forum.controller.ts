import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserJwtPayload } from '../../auth/types/user-jwt-payload';
import { GetCurrentUser } from '../../shared/decorators/get-current-user.decorator';
import { RolesEnum } from '../../users/enums/roles.enum';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
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
    @Body() createPostDto: CreatePostDto,
    @GetCurrentUser() user: UserJwtPayload,
  ) {
    const imagePath = file ? file.filename : null;
    return this.postService.createPost(createPostDto, user.id, imagePath);
  }

  @Get('/posts')
  getAllApprovedPosts() {
    return this.postService.getAllApprovedPosts();
  }

  @Get('/posts/:id')
  getPost(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get('/posts/user/:id')
  getUserPosts(@Param('id') id: string) {
    return this.postService.getPostByUserId(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  @Patch('/posts/:id')
  updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.updatePost(id, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/posts/:id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }

  @UseGuards(AuthGuard)
  @Post('comment/:postId')
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetCurrentUser() user: UserJwtPayload,
  ) {
    try {
      return await this.postService.addComment(
        postId,
        createCommentDto,
        user.id,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('comment/:postId/:commentId')
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @GetCurrentUser() user: UserJwtPayload,
  ) {
    try {
      return await this.postService.deleteComment(postId, commentId, user.id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // TODO - Move this to admin controller at least

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  @Get('/admin/posts')
  getAllPostsAdmin() {
    return this.postService.getAllPosts();
  }
}
