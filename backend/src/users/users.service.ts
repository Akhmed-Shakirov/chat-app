import { Injectable, HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly messagesService: MessagesService,
  ) {}

  uniqueArray = (arr) => {
    return arr.reduce((accumulator, currentValue) => {
      if (!accumulator.some((item) => item._id === currentValue._id)) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
  };

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (Object.keys(createUserDto).length) {
      const newUser = new this.userModel(createUserDto);
      try {
        return await newUser.save();
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

  async findAll(data: UpdateUserDto) {
    const items = this.userModel.find();

    if (data.login) {
      items.where('login').equals(data.login);
    }

    if (data.email) {
      items.where('email').equals(data.email);
    }

    if (data.name) {
      items.where('name').equals(data.name);
    }

    return items.exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Object Id: ' + id, 404);
    } else {
      return await this.userModel.findById(id);
    }
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByLogin(login: string) {
    return this.userModel.findOne({ login });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (Object.keys(updateUserDto).length) {
      const { login } = updateUserDto;
      const existingUser = await this.userModel.findOne({ login });
      if (existingUser && existingUser._id != id) {
        throw new HttpException('Login must be unique', 409);
      } else {
        return await this.userModel.findByIdAndUpdate(id, updateUserDto);
      }
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }

  async remove(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid Object Id: ' + id, 404);
    } else {
      return await this.userModel.findByIdAndRemove(id);
    }
  }

  async applications(id: string, myId: string): Promise<{ message: string }> {
    if (id == myId) throw new HttpException('The same id ', 400);

    const i_am = await this.findOne(myId).then((res) => res);
    const sein = await this.findOne(id).then((res) => res);

    if (
      i_am.friends.filter((item) => item._id === id)?.length ||
      i_am.applications.filter((item) => item._id === id)?.length
    ) {
      throw new HttpException(
        'Have you already applied or is he already a friend...',
        200,
      );
    }

    const applications = JSON.parse(JSON.stringify(sein.applications));

    if (!applications.filter((item) => item._id === myId)?.length) {
      applications.push({ login: i_am.login, _id: myId });

      const update = { applications: this.uniqueArray(applications) };

      await this.userModel.findByIdAndUpdate(id, update);

      throw new HttpException('Application successfully sent', 201);
    } else {
      const update = { applications: this.uniqueArray(applications) };
      await this.userModel.findByIdAndUpdate(id, update);
      throw new HttpException('You have already applied', 201);
    }
  }

  async friends(id: string, myId: string): Promise<{ message: string }> {
    if (id == myId) throw new HttpException('The same id ', 400);

    const i_am = await this.findOne(myId).then((res) => res);
    const sein = await this.findOne(id).then((res) => res);

    let me_applications = JSON.parse(JSON.stringify(i_am.applications));
    const me_friends = JSON.parse(JSON.stringify(i_am.friends));
    const his_friends = JSON.parse(JSON.stringify(sein.friends));

    if (me_applications.filter((item) => item._id === id)?.length) {
      me_applications = me_applications.filter((item) => item._id !== id);

      // const chatId = '123123';
      const chatId = await this.messagesService
        .create({ chats: [] })
        .then((res) => res._id);

      me_friends.push({ login: sein.login, _id: id, id_chat: chatId });
      const me_update = {
        applications: this.uniqueArray(me_applications),
        friends: this.uniqueArray(me_friends),
      };
      await this.userModel.findByIdAndUpdate(myId, me_update);

      his_friends.push({ login: i_am.login, _id: myId, id_chat: chatId });
      const his_update = { friends: this.uniqueArray(his_friends) };
      await this.userModel.findByIdAndUpdate(id, his_update);

      throw new HttpException('Application successfully accepted', 201);
    } else {
      throw new HttpException('Server problems', 501);
    }
  }

  async removeFromFriends(
    id: string,
    myId: string,
  ): Promise<{ message: string }> {
    if (id == myId) throw new HttpException('The same id ', 400);

    const i_am = await this.findOne(myId).then((res) => res);
    const sein = await this.findOne(id).then((res) => res);

    let me_friends = JSON.parse(JSON.stringify(i_am.friends));
    let his_friends = JSON.parse(JSON.stringify(sein.friends));

    if (me_friends.filter((item) => item._id === id)?.length) {
      const chatId = me_friends.find((item) => item._id === id).id_chat;

      await this.messagesService.remove(chatId);

      me_friends = me_friends.filter((item) => item._id !== id);
      const me_update = { friends: this.uniqueArray(me_friends) };
      await this.userModel.findByIdAndUpdate(myId, me_update);

      his_friends = his_friends.filter((item) => item._id !== myId);
      const his_update = { friends: this.uniqueArray(his_friends) };
      await this.userModel.findByIdAndUpdate(id, his_update);

      throw new HttpException(
        'User successfully removed from friends list',
        201,
      );
    } else {
      throw new HttpException('Server problems', 501);
    }
  }
}
