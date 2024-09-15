import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
      content: createPostDto.content,
      author: new Types.ObjectId(author),
      imagePath: imagePath,
      status: createPostDto.status || PostStatusEnum.APPROVED,
    });
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel
      .find({ status: PostStatusEnum.APPROVED })
      .populate('author')
      .exec();
  }

  async findById(id: string): Promise<Post> {
    try {
      const post = await this.postModel.findById(id).populate('author').exec();
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
}
