import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import {
  CsvAttendeesExporter,
  TicketSaleExporter,
} from '@/report/exporter.concrete';
import { Response } from 'express';

@Controller('report')
export class ReportController {
  constructor(
    private readonly attendeeExporter: CsvAttendeesExporter,
    private readonly ticketSaleExporter: TicketSaleExporter,
  ) {}

  @Get(':eventId/attendees')
  async getAttendees(
    @Param('eventId') eventId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.attendeeExporter.export(eventId);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=attendees-${eventId}.csv`,
      'Content-Length': buffer.length.toString(),
    });
    return new StreamableFile(buffer);
  }

  @Get('eventId/tickets')
  async getTickets(
    @Param('eventId') eventId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.ticketSaleExporter.export(eventId);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=tickets-${eventId}.csv`,
      'Content-Length': buffer.length.toString(),
    });

    return new StreamableFile(buffer);
  }
}
