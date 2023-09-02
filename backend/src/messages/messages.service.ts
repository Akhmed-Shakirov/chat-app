import { Injectable, HttpException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  [x: string]: any;
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  uniqueArray = (arr) => {
    return arr.reduce((accumulator, currentValue) => {
      if (!accumulator.some((item) => item._id === currentValue._id)) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  };

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    if (Object.keys(createMessageDto).length) {
      const newMessage = new this.messageModel(createMessageDto);
      try {
        return await newMessage.save();
      } catch (error) {
        if (error.code === 11000) {
          throw new HttpException('Login must be unique', 409);
        }
        throw new Error('Internal Server Error');
      }
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Object Id: ' + id, 404);
    } else {
      return await this.messageModel.findById(id);
    }
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    if (Object.keys(updateMessageDto).length && id) {
      return await this.messageModel.findByIdAndUpdate(id, updateMessageDto);
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }

  async remove(id: string): Promise<Message> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Object Id: ' + id, 404);
    } else {
      return await this.messageModel.findByIdAndRemove(id);
    }
  }
}
