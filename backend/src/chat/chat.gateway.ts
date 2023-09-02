import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('messageToFriend')
  handleMessage(
    client: Socket,
    payload: { friendId: string; message: string },
  ) {
    // Обработка сообщения и отправка его другу с friendId
    const { friendId, message } = payload;
    client.to(friendId).emit('messageFromFriend', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomName: string) {
    client.join(roomName);
    console.log(roomName);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string) {
    client.leave(roomName);
  }
}
