// src/shared/database/repositories/post.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async create(
    content: string,
    author: string,
    imagePath: string,
  ): Promise<Post> {
    const newPost = new this.postModel({
      content: content,
      author: new Types.ObjectId(author),
      imagePath: imagePath,
    });
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().populate('author').exec(); // Populate the author field
  }

  async findById(id: string): Promise<Post> {
    return this.postModel.findById(id).populate('author').exec(); // Populate the author field
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }
}
