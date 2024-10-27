import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCommentDto } from '../../../forum/dtos/create-comment.dto';
import { CreatePostDto } from '../../../forum/dtos/create-post.dto';
import { UpdatePostDto } from '../../../forum/dtos/update-post.dto';
import { PostStatusEnum } from '../../enums/post-status.enum';
import { Post } from '../schemas/post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    author: string,
    imagePath: string,
  ): Promise<Post> {
    const newPost = new this.postModel({
      title: createPostDto.title,
      content: createPostDto.content,
      author: new Types.ObjectId(author),
      imagePath: imagePath,
      status: createPostDto.status || PostStatusEnum.APPROVED,
    });
    return newPost.save();
  }

  async findAllApproved(): Promise<Post[]> {
    return this.postModel
      .find({ status: PostStatusEnum.APPROVED })
      .populate('author')
      .populate('comments.userId')
      .exec();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel
      .find()
      .populate('author')
      .populate('comments.userId')
      .exec();
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const id = new Types.ObjectId(userId);
    const posts = await this.postModel.find({ author: id });

    return posts;
  }

  async findById(id: string): Promise<Post> {
    try {
      const post = await this.postModel
        .findById(id)
        .populate('author')
        .populate('comments.userId')
        .exec();
      return post;
    } catch (error) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { status: updatePostDto.status },
      { new: true },
    );

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return updatedPost;
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  async addComment(
    postId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments.create({
      content: createCommentDto.content,
      userId: new Types.ObjectId(userId),
      createdAt: new Date(),
    });
    post.comments.push(comment);

    return (await post.save()).populate('comments.userId');
  }

  async deleteComment(postId: string, commentId: string, userId: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments.id(commentId);
    if (comment && comment.userId.toString() === userId) {
      post.comments.pull(commentId);
      return post.save();
    }

    throw new NotFoundException('Comment not found or user not authorized');
  }
}
