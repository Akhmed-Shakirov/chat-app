import { Injectable } from '@nestjs/common';

@Injectable()
export class WebsocketService {
  create() {
    return 'This action adds a new websocket';
  }

  findAll() {
    return `This action returns all websocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websocket`;
  }

  update(id: number) {
    return `This action updates a #${id} websocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} websocket`;
  }
}
