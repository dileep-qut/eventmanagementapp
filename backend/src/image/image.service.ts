import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './entities/image.entity';
import { Model } from 'mongoose';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const newImage = new this.imageModel({
      image_name: file.originalname,
      image_url: '/' + file.path,
    });
    await newImage.save();

    return newImage;
  }

  async findImageById(id: string) {
    const image = await this.imageModel.findById(id);
    if (!image) {
      throw new BadRequestException('Image not found');
    }
    return image;
  }
}
