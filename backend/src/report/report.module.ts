import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CsvAttendeesExporter,
  RevenueExporter,
} from '@/report/exporter.concrete';
import { Event, EventSchema } from '@/event/entities/event.entity';
import {
  TicketList,
  TicketListSchema,
} from '@/ticket/entities/ticket-list.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: TicketList.name,
        schema: TicketListSchema,
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [CsvAttendeesExporter, RevenueExporter],
})
export class ReportModule {}
