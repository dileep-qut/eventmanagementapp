import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';
import { ApplyStrictAuth } from '@/_decorators/apply-strict-auth.decorator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApplyStrictAuth(true)
  @ApiConsumes('multipart/form-data')
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    example: {
      image_name: '069b71fc-94a8-40a5-b963-035f6d53551f.jpeg',
      image_url:
        '/public/1747029635173-15727855-069b71fc-94a8-40a5-b963-035f6d53551f.jpeg',
      _id: '68218e83f41de91e2e46ed15',
      createdAt: '2025-05-12T06:00:35.180Z',
      updatedAt: '2025-05-12T06:00:35.180Z',
      __v: 0,
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.imageService.uploadImage(file);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get image by ID',
    example: {
      image_name: '069b71fc-94a8-40a5-b963-035f6d53551f.jpeg',
      image_url:
        '/public/1747029635173-15727855-069b71fc-94a8-40a5-b963-035f6d53551f.jpeg',
      _id: '68218e83f41de91e2e46ed15',
      createdAt: '2025-05-12T06:00:35.180Z',
      updatedAt: '2025-05-12T06:00:35.180Z',
      __v: 0,
    },
  })
  @ApplyApiResponse([400, 401, 403, 500])
  async getImage(@Param('id') id: string) {
    return await this.imageService.findImageById(id);
  }
}
