import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Chats',
    example: 'Array',
  })
  readonly chats: Array<{ login: string; date: string; message: string }>;
}
