import { Exporter } from './exporter';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '@/event/entities/event.entity';
import { TicketList } from '@/ticket/entities/ticket-list.entity';
import { Parser } from 'json2csv';
import { Types } from 'mongoose';
import PDFDocument from 'pdfkit';

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
export class RevenueExporter extends Exporter {
  constructor(
    @InjectModel(TicketList.name)
    private readonly ticketModel: Model<TicketList>,
  ) {
    super();
  }
  protected async fetch(eventId: string): Promise<any> {
    const ticketList = await this.ticketModel
      .find({
        event_id: new Types.ObjectId(eventId),
      })
      .populate('user_id', 'name email')
      .populate('event_id', 'ticket_price')
      .exec();

    if (ticketList.length == 0) {
      throw new NotFoundException('No ticket sold for this event');
    }

    let totalRevenue = 0;
    ticketList.forEach((ticket) => {
      totalRevenue += ticket.event_id.ticket_price;
    });

    return totalRevenue;
  }

  protected async serialize(raw: number): Promise<Buffer> {
    const totalRevenue = raw;
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    return new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // build the PDF content
      doc.fontSize(20).text('Ticket Sales Report', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(14)
        .text(`Total Revenue: $${totalRevenue.toFixed(2)}`, { align: 'right' });

      // finalize
      doc.end();
    });
  }
}
