import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@/user/entities/user.entity';

export type EventDocument = Event & Document;

export const CategoryEnum = [
  'Music',
  'Networking',
  'Night Life',
  'CyberSecurity',
  'Computer Science',
  'Dating',
  'Hobbies',
];

export interface IEvent {
  name: string;
  description: string;
  location: string;
  start_time: Date;
  end_time: Date;
  creator: User;
  participants: User[];
  ticket_price: number;
  ticket_available: number;
  category: string;
  image_url?: string;
}

@Schema({
  timestamps: true,
  autoCreate: true,
  collection: 'events',
})
export class Event implements IEvent {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  start_time: Date;

  @Prop({ required: true })
  end_time: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  creator: User;

  @Prop({ type: [Types.ObjectId], ref: User.name, default: [] })
  participants: User[];

  @Prop({ required: true })
  ticket_price: number;

  @Prop({ required: true })
  ticket_available: number;

  @Prop({
    type: String,
    enum: CategoryEnum,
    required: true,
  })
  category: string;

  @Prop({ type: String, required: false })
  image_url?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
