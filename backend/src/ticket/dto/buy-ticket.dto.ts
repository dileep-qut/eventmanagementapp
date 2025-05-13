import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class BuyTicketDto {
  @ApiProperty({
    description: 'Event id',
    example: '',
  })
  @IsString()
  event_id: string;

  @ApiProperty({
    description: 'Add on options',
    example: {
      vip: true,
      parking: false,
      food: true,
      priority: false,
    },
  })
  @IsNotEmpty()
  add_on: {
    vip: boolean;
    parking: boolean;
    food: boolean;
    priority: boolean;
  };
}
