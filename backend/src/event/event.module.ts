import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@/event/entities/event.entity';
import {
  TicketList,
  TicketListSchema,
} from '@/ticket/entities/ticket-list.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: TicketList.name,
        schema: TicketListSchema,
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [],
})
export class EventModule {}
