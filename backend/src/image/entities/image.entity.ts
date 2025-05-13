import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImageDocument = Image & Document;

export interface IImage {
  image_name: string;
  image_url: string;
}

@Schema({ timestamps: true, autoCreate: true, collection: 'images' })
export class Image implements IImage {
  @Prop({ required: true })
  image_name: string;

  @Prop({ required: true })
  image_url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
