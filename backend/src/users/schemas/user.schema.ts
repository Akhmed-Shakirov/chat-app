import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  applications: Array<{ login: string; _id: string }>;

  @Prop({ required: false })
  friends: Array<{
    login: string;
    _id: string;
    chat: string;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
