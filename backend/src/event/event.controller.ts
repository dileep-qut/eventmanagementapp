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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

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
          _id: '681b0c29b93d75a8938d1f86',
          name: 'Event 0',
          description: 'Description 0',
          location: 'Location 0',
          start_time: '2026-01-24T14:00:00.000Z',
          end_time: '2026-01-25T14:00:00.000Z',
          creator: {
            _id: '681b0c28b93d75a8938d1f6e',
            name: 'dev',
            email: 'dev@qut.edu.au',
          },
          participants: [
            {
              _id: '681b0c28b93d75a8938d1f70',
              name: 'User 0',
              email: 'user_0@qut.edu.au',
            },
            {
              _id: '681b0c28b93d75a8938d1f74',
              name: 'User 2',
              email: 'user_2@qut.edu.au',
            },
            {
              _id: '681b0c28b93d75a8938d1f7a',
              name: 'User 5',
              email: 'user_5@qut.edu.au',
            },
          ],
          ticket_price: 15,
          ticket_available: 1000,
          createdAt: '2025-05-07T07:30:49.079Z',
          updatedAt: '2025-05-07T07:30:49.079Z',
          __v: 0,
          isEditable: false,
          isRegistered: false,
        },
      ],
    },
  })
  @ApiBearerAuth()
  @Get()
  findAll(@Request() req: any) {
    return this.eventsService.findAll(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.eventsService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.remove(id, req.user.id);
  }

  // @Post('register/:id')
  // register(@Param('id') id: string, @Request() req: any) {
  //   return this.eventsService.register(id, req.user.id);
  // }
  //
  // @Delete('unregister/:id')
  // unregister(@Param('id') id: string, @Request() req: any) {
  //   return this.eventsService.unregister(id, req.user.id);
  // }
}
