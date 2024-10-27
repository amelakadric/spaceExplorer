// src/forum/forum.module.ts
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from '../shared/database/repostitories/post.repository';
import { Post, PostSchema } from '../shared/database/schemas/post.schema';
import { User, UserSchema } from '../shared/database/schemas/user.schema';
import { ForumController } from './controllers/forum.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ForumController],
  providers: [PostService, PostRepository, JwtService],
})
export class ForumModule {}
