import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '@/event/entities/event.entity';
import { User } from '@/user/entities/user.entity';

export type TicketDocument = Ticket & Document;

export interface ITicket {
  event_id: Event;
  user_id: User;
  checked_in: boolean;
  ticket_price: number;
  transaction_id: string;
}

@Schema({ timestamps: true, autoCreate: true, collection: 'tickets' })
class Ticket implements ITicket {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event_id: Event;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ default: false })
  checked_in: boolean;

  @Prop({ required: true })
  ticket_price: number;

  @Prop({ required: true })
  transaction_id: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
