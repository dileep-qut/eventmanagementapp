import { Module } from '@nestjs/common';
import { Initializer } from './init.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/user/entities/user.entity';
import { Event, EventSchema } from '@/event/entities/event.entity';
import { Image, ImageSchema } from '@/image/entities/image.entity';
import { Ticket, TicketSchema } from '@/ticket/entities/ticket.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Image.name, schema: ImageSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
  controllers: [],
  providers: [Initializer],
})
export class InitModule {}
