import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@/user/entities/user.entity';
import { Image } from '@/image/entities/image.entity';

export type EventDocument = Event & Document;

export const CategoryEnum = [
  'Business',
  'Webinar',
  'Workshop',
  'Conference',
  'Networking',
  'Hackathon',
  'Other',
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
  image_id?: Types.ObjectId; // Optional field for images
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

  @Prop({ type: Types.ObjectId, ref: Image.name, required: false })
  image_id?: Types.ObjectId; // Optional field for images
}

export const EventSchema = SchemaFactory.createForClass(Event);
