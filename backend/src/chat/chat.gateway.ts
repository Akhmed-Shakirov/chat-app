// chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway(8001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messagesService: MessagesService
  ) {}

  @WebSocketServer()
  server: Server;
  
  private activeSockets: Map<string, Socket> = new Map();

  handleConnection(client) {
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client) {
    // console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    this.activeSockets.set(roomId, client);
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { roomId: string; message: string | Array<{ id: number; login: string; date: string; message: string }>, login: string }) {
    const { roomId, message, login } = payload

    if (Array.isArray(message)) {
      await this.messagesService.update(roomId, { chats: message })
      
      this.server.to(roomId).emit('message', true)
    } else {
      
    const data = await this.messagesService.findOne(roomId)

      const chat = { message, login, date: `${new Date()}`, id: data?.chats?.length + 1 }
  
      const newChats = [ ...data.chats, chat ]
  
      await this.messagesService.update(roomId, { chats: newChats })
  
      this.server.to(roomId).emit('message', chat)
    }
  }
}
