import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RefreshTokenDto {
  @ApiProperty({
    description: 'refreshToken',
    example: '',
  })
  @IsNotEmpty()
  refreshToken: string;
}

export default RefreshTokenDto;
