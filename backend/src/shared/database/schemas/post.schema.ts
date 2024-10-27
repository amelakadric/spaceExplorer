import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PostStatusEnum } from '../../enums/post-status.enum';
import { Comment, CommentSchema } from './comment.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  imagePath: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ default: PostStatusEnum.APPROVED })
  status: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Types.DocumentArray<Comment>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
