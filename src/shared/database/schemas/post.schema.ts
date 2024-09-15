import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PostStatusEnum } from '../../enums/post-status.enum';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ required: false })
  imagePath: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ default: PostStatusEnum.APPROVED })
  status: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
