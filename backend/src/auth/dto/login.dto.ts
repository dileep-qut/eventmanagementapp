import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'dev@qut.edu.au',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
