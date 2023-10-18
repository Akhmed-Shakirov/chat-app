export class Message {
  _id: string;
  chats: Array<{id: number, login: string; date: string; message: string }>;
}
