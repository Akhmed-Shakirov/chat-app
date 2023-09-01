import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'alex@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '123',
  })
  @IsNotEmpty()
  password: string;
}
