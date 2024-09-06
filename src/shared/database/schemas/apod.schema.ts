import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Apod extends Document {
  @Prop({ required: true, unique: true })
  date: string;

  @Prop()
  title: string;

  @Prop()
  explanation: string;

  @Prop()
  url: string;

  @Prop()
  hdurl: string;

  @Prop()
  media_type: string;

  @Prop()
  service_version: string;
}

export const ApodSchema = SchemaFactory.createForClass(Apod);
