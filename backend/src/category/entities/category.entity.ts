import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ICategory {
  name: string;
  description: string;
}

export class Category implements ICategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
