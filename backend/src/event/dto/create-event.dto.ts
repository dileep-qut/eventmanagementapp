import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '@/event/entities/event.entity';
import { Types } from 'mongoose';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Tech Conference 2023',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Event date',
    example: '2023-10-01T10:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Event location',
    example: 'New York, NY',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Description and detail of the event ',
    example: 'Here is the description of the event which is a long string',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Start time of the event in Javascript Date() format',
    example: '2019-02-01T00:00:00Z',
  })
  @IsString()
  start_time: Date;

  @ApiProperty({
    description: 'End time of the event in Javascript Date() format',
    example: '2019-02-01T00:00:00Z',
  })
  @IsString()
  end_time: Date;

  @ApiProperty({
    description: 'Price of the Ticket',
    example: 10,
  })
  @IsNumber()
  ticket_price: number;

  @ApiProperty({
    description: 'How many ticket is available',
    example: 100,
  })
  @IsNumber()
  ticket_available: number;

  @ApiProperty({
    description: 'Event category',
    example: 'Networking',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Image ID associated with the event',
    example: '60d5ec49b3f1f8c8a4e4b8c2',
  })
  @IsString()
  @IsOptional()
  image_id?: Types.ObjectId;
}
