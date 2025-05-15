import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import {
  CsvAttendeesExporter,
  RevenueExporter,
} from '@/report/exporter.concrete';
import { Response } from 'express';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';
import { ApiParam, ApiProduces, ApiResponse, ApiSchema } from '@nestjs/swagger';
import { ApplyStrictAuth } from '@/_decorators/apply-strict-auth.decorator';

@Controller('report')
export class ReportController {
  constructor(
    private readonly attendeeExporter: CsvAttendeesExporter,
    private readonly revenueExporter: RevenueExporter,
  ) {}

  @ApplyStrictAuth(true)
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiParam({
    name: 'eventId',
    type: String,
    description: 'The ID of the event',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiProduces('text/csv')
  @ApiResponse({
    status: 200,
    description: 'CSV file containing the list of attendees',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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

  @ApplyStrictAuth(true)
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiParam({
    name: 'eventId',
    type: String,
    description: 'The ID of the event',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiProduces('application/pdf')
  @ApiResponse({
    status: 200,
    description: 'PDF report of ticket sales',
    content: {
      'application/pdf': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @Get(':eventId/revenue')
  async exportRevenue(
    @Param('eventId') eventId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const buffer = await this.revenueExporter.export(eventId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=revenue-${eventId}.pdf`,
      'Content-Length': buffer.length.toString(),
    });

    return new StreamableFile(buffer);
  }
}
