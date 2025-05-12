// src/events/events.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { ApplyStrictAuth } from '@/_decorators/apply-strict-auth.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 200,
    description: 'Get user profile',
    schema: {
      example: [
        {
          _id: '68210420f639de1251ae31c5',
          name: 'Event 4',
          description: 'Description 4',
          location: 'Location 4',
          start_time: '2026-01-24T14:00:00.000Z',
          end_time: '2026-01-25T14:00:00.000Z',
          creator: {
            _id: '68210420f639de1251ae31a5',
            name: 'dev',
            email: 'dev@qut.edu.au',
          },
          ticket_price: 15,
          ticket_available: 1000,
          category: 'Workshop',
          createdAt: '2025-05-11T20:10:08.537Z',
          updatedAt: '2025-05-11T20:10:08.537Z',
          __v: 0,
        },
      ],
    },
  })
  @Get()
  async findAll(@Request() req: any) {
    return await this.eventsService.findAll();
  }

  @ApplyApiResponse([400, 401, 403, 404, 500])
  @ApplyStrictAuth(false)
  @ApiResponse({
    status: 200,
    description: 'Get event by id',
    schema: {
      example: {
        _id: '68218a44558c61c3d0e5c773',
        name: 'Event 0',
        description: 'Description 0',
        location: 'Location 0',
        start_time: '2026-01-24T14:00:00.000Z',
        end_time: '2026-01-25T14:00:00.000Z',
        creator: '68210420f639de1251ae31a5',
        ticket_price: 15,
        ticket_available: 1000,
        category: 'Workshop',
        createdAt: '2025-05-12T05:42:28.577Z',
        updatedAt: '2025-05-12T05:42:28.577Z',
        __v: 0,
      },
    },
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.eventsService.findById(id);
  }

  @ApplyStrictAuth(true)
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 201,
    description: 'Create event',
    schema: {
      example: {
        name: 'Tech Conference 2023',
        description:
          'Here is the description of the event which is a long string',
        location: 'New York, NY',
        start_time: '2019-02-01T00:00:00.000Z',
        end_time: '2019-02-01T00:00:00.000Z',
        creator: {
          _id: '68210420f639de1251ae31a5',
          name: 'dev',
          email: 'dev@qut.edu.au',
        },
        participants: [],
        ticket_price: 10,
        ticket_available: 100,
        category: 'Networking',
        image_id: '60d5ec49b3f1f8c8a4e4b8c2',
        _id: '6821886a312ff80975a1e661',
        createdAt: '2025-05-12T05:34:34.384Z',
        updatedAt: '2025-05-12T05:34:34.384Z',
        __v: 0,
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateEventDto, @Request() req: any) {
    return await this.eventsService.create(dto, req.user._id);
  }

  @ApplyStrictAuth(true)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req: any,
  ) {
    return await this.eventsService.update(id, dto, req.user._id);
  }

  @ApplyStrictAuth(true)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return await this.eventsService.remove(id, req.user._id);
  }
}
