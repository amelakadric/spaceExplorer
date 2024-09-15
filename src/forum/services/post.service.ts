// src/forum/services/post.service.ts
import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../shared/database/repostitories/post.repository';
import { Post } from '../../shared/database/schemas/post.schema';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(
    content: string,
    authorId: string,
    imagePath?: string,
  ): Promise<Post> {
    return this.postRepository.create(content, authorId, imagePath);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getPostById(id: string): Promise<Post> {
    return this.postRepository.findById(id);
  }

  async deletePost(id: string): Promise<{ deleted: boolean }> {
    return this.postRepository.deleteById(id);
  }
}
