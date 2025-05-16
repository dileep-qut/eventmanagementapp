import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetEventsQueryDto } from './dto/get-events.query.dto';

export type EventDocument = Event & Document;

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async findAll(query: GetEventsQueryDto) {
    const { name, category } = query;
    const events = await this.eventModel
      .find({
        name: {
          $regex: name ? name : '',
        },
        category: category ? category : { $exists: true },
      })
      .populate('creator', 'name email')
      .exec();

    if (!events) throw new NotFoundException('No events found');

    return events.map((e) => {
      const total_participants = e.participants.length;
      const ticket_left = e.ticket_available - total_participants;

      const { participants, ...rest } = e.toObject();

      return { ...rest, ticket_left: ticket_left };
    });
  }

  async findById(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('creator', 'name email')
      .exec();

    if (!event) throw new NotFoundException('Event not found');
    const total_participants = event.participants.length;
    const ticket_left = event.ticket_available - total_participants;

    const { participants, ...rest } = event.toObject();

    return { ...rest, ticket_left: ticket_left };
  }

  async create(createDto: CreateEventDto, userId: string) {
    const created = new this.eventModel({
      ...createDto,
      creator: new Types.ObjectId(userId),
    });
    await created.save();
    await created.populate('creator', 'name email');
    return {
      ...created.toObject(),
    };
  }

  async update(id: string, updateDto: UpdateEventDto, user_id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.creator.toString() !== user_id.toString()) {
      throw new ForbiddenException('Not authorised to update this event');
    }
    return this.eventModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .select('-participants')
      .populate('creator', 'name email');
  }

  async remove(id: string, user_id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.creator.toString() !== user_id.toString()) {
      throw new ForbiddenException('Not authorised to delete this event');
    }
    await event.deleteOne();
    return { message: 'Event deleted' };
  }

  async getAttendees(id: string, user_id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (event.creator.toString() !== user_id.toString()) {
      throw new ForbiddenException('Not authorised to get attendees');
    }

    await event.populate('participants', 'name email');

    return event.participants;
  }

  async findMyEvents(user_id: string) {
    const events = await this.eventModel
      .find({ creator: user_id })
      .populate('creator', 'name email')
      .populate('participants', 'name email')
      .exec();

    if (!events) throw new NotFoundException('No events found');

    return events.map((e) => {
      const total_participants = e.participants.length;
      const ticket_left = e.ticket_available - total_participants;
      return {
        ...e.toObject(),
        ticket_left: ticket_left,
      };
    });
  }
}
