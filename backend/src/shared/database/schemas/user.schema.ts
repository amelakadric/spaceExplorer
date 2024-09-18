import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolesEnum } from '../../../users/enums/roles.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: RolesEnum.RegisteredUser })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
