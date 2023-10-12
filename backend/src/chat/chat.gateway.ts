// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeSockets: Map<string, Socket> = new Map();

  handleConnection(client) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.activeSockets.set(roomId, client);
    console.log(1);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { roomId: string; message: string }) {
    const { roomId, message } = payload;
    const recipientSocket = this.activeSockets.get(roomId);
    if (recipientSocket) {
      recipientSocket.emit('message', message);
      console.log(2);
    }
  }
}
