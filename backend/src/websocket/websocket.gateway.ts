import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connection id: ' + socket.id);
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string) {
    this.server.emit('message', {
      text: data,
    });
  }
}
