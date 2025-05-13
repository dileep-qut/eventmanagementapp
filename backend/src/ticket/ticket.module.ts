import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '@/event/entities/event.entity';
import {
  TicketList,
  TicketListSchema,
} from '@/ticket/entities/ticket-list.entity';
import { PaymentModule } from '@/services/payment.module';

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
    PaymentModule,
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
