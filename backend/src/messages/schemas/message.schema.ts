import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  [x: string]: any;
  @Prop({ required: true })
  chats: Array<{ login: string; date: string; message: string }>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
