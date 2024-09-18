// src/forum/guards/is-author.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from '../services/post.service';

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly postService: PostService, // To fetch post details
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = request.params.id;

    const post = await this.postService.getPostById(postId);

    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    if (post.author.id.toString() !== user.id) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return true;
  }
}
