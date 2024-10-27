// src/forum/services/post.service.ts
import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { PostRepository } from '../../shared/database/repostitories/post.repository';
import { Post } from '../../shared/database/schemas/post.schema';
import { PostStatusEnum } from '../../shared/enums/post-status.enum';
import { CreateCommentDto } from '../dtos/create-comment.dto';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class PostService {
  openai: OpenAI;
  constructor(private readonly postRepository: PostRepository) {
    this.openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });
  }

  async createPost(
    createPostDto: CreatePostDto,
    authorId: string,
    imagePath?: string,
  ) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        this.getTextContext(),
        this.prepareText(createPostDto.content),
      ],
      model: 'gpt-4o-mini',
    });
    console.log(JSON.parse(completion.choices[0].message.content));

    if (JSON.parse(completion.choices[0].message.content).allowPost === true) {
      return this.postRepository.create(createPostDto, authorId, imagePath);
    } else {
      createPostDto.status = PostStatusEnum.IN_REVIEW;
      this.postRepository.create(createPostDto, authorId, imagePath);
      return { message: 'Your post is being reviewed.' };
    }
  }

  async getAllApprovedPosts(): Promise<Post[]> {
    return this.postRepository.findAllApproved();
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async getPostById(id: string): Promise<Post> {
    return this.postRepository.findById(id);
  }

  async getPostByUserId(userId: string): Promise<Post[]> {
    return this.postRepository.findByUserId(userId);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postRepository.updatePost(id, updatePostDto);
  }

  async deletePost(id: string): Promise<{ deleted: boolean }> {
    return this.postRepository.deleteById(id);
  }

  private getTextContext(): ChatCompletionMessageParam {
    return {
      role: 'system',
      content: `
                I am developing an application for space lovers with 
                a forum. I will provide you with text from a post, 
                and your task is to categorize it as SPACE related or not:
               
                Please, return data in a format: {"allowPost": true or 
                false (as boolean)} 

                For example: 
                {
                    "alowComment": true
                }
            `,
    };
  }

  private prepareText(text: string): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: text,
    };
  }

  async addComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    return this.postRepository.addComment(postId, createCommentDto, userId);
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    return this.postRepository.deleteComment(postId, commentId, userId);
  }
}
