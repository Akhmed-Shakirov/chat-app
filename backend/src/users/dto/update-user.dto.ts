import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Login',
    example: 'Alex',
  })
  readonly login: string;

  @ApiProperty({
    description: 'Email',
    example: 'alex@gmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Name',
    example: 'Alex',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Password',
    example: '123',
  })
  readonly password: string;
  readonly applications: Array<{ login: string; _id: string }>;
  readonly friends: Array<{ login: string; _id: string }>;
}
