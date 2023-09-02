export class Message {
  _id: string;
  chats: Array<{ login: string; date: string; message: string }>;
}
