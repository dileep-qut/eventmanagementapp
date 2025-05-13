import { Exporter } from './exporter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@/event/entities/event.entity';
import { TicketList } from '@/ticket/entities/ticket-list.entity';
import { Parser } from 'json2csv';

@Injectable()
export class CsvAttendeesExporter extends Exporter {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {
    super();
  }
  protected async fetch(eventId: string): Promise<any> {
    const event = await this.eventModel
      .findById(eventId)
      .select('participants')
      .populate('participants', 'name email -_id')
      .lean()
      .exec();
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event.participants.map((e, index) => {
      return {
        id: index + 1,
        name: e.name,
        email: e.email,
      };
    });
  }

  protected async serialize(raw: any): Promise<Buffer> {
    // Convert the raw data to CSV format
    const parser = new Parser();
    const csv = parser.parse(raw); // csv is a UTF-8 string
    return Buffer.from(csv, 'utf-8');
  }
}

@Injectable()
export class TicketSaleExporter extends Exporter {
  constructor(
    @InjectModel(TicketList.name)
    private readonly ticketModel: Model<TicketList>,
  ) {
    super();
  }
  protected async fetch(eventId: string): Promise<any> {
    const ticketList = await this.ticketModel
      .find({ event_id: eventId })
      .populate('user_id', 'name email')
      .exec();

    if (ticketList.length == 0) {
      throw new NotFoundException('No ticket sold for this event');
    }

    return ticketList.map((ticket, index) => {
      return {
        id: index + 1,
        name: ticket.user_id.name,
        email: ticket.user_id.email,
        ticket_id: ticket._id,
        transaction_id: ticket.transaction_id,
      };
    });
  }

  protected async serialize(raw: any): Promise<Buffer> {
    // Convert the raw data to CSV format
    const parser = new Parser();
    const csv = parser.parse(raw); // csv is a UTF-8 string
    return Buffer.from(csv, 'utf-8');
  }
}
