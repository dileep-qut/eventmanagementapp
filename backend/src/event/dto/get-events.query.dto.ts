import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEventsQueryDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Tech',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Event category',
    example: 'Networking',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
