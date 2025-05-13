import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@/user/entities/user.entity';
import { Event } from '@/event/entities/event.entity';

export type ReviewDocument = Review & Document;

export interface IReview {
  user: User;
  event: Event;
  rating: number;
  comment: string;
}

@Schema({ timestamps: true, autoCreate: true, collection: 'reviews' })
export class Review implements IReview {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event: Event;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
