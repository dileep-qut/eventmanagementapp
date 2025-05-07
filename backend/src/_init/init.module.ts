import { Module } from '@nestjs/common';
import { Initializer } from './init.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/user/entities/user.entity';
import { Image, ImageSchema } from '@/image/entities/image.entity';
import { Event, EventSchema } from '@/event/entities/event.entity';
import {
  TicketList,
  TicketListSchema,
} from '@/ticket/entities/ticket-list.entity';
import { EventModule } from '@/event/event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Image.name, schema: ImageSchema },
      { name: TicketList.name, schema: TicketListSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    EventModule,
  ],
  controllers: [],
  providers: [Initializer],
})
export class InitModule {}
