import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { GetTicketPriceDto } from './dto/get-ticket-price.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';
import { PurchaseTicketDto } from '@/ticket/dto/purchase-ticket.dto';
import { ApplyStrictAuth } from '@/_decorators/apply-strict-auth.decorator';
import { PaymentService } from '@/services/payment.service';
import { PaymentContext } from '@/services/payment.service.interface';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly paymentService: PaymentService,
  ) {}

  @ApplyApiResponse([400, 401, 403, 500])
  @Post('get-price')
  @ApiResponse({
    status: 201,
    description: 'Get ticket price',
    schema: {
      example: {
        price: 15,
      },
    },
  })
  async getTicketPrice(@Body() dto: GetTicketPriceDto) {
    return await this.ticketService.getTicketPrice(dto.event_id, dto.add_on);
  }

  @ApplyStrictAuth(true)
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 201,
    description: 'Purchase ticket',
    schema: {
      example: {
        price: 142,
        ticket_id: '68219a6b5d758dfb1640733d',
      },
    },
  })
  @Post('purchase')
  async purchaseTicket(@Body() dto: PurchaseTicketDto, @Request() req: any) {
    const purchase = await this.ticketService.purchaseTicket(
      dto.event_id,
      req.user._id,
      dto.add_on,
    );

    if (!purchase) {
      return { message: 'Ticket purchase failed' };
    }

    const paymentContext: PaymentContext = {
      price: purchase.price,
      eventId: dto.event_id,
      ticketId: purchase.ticket_id as string,
      userEmail: req.user.email as string,
    };

    const response = await this.paymentService.processPayment(paymentContext);

    if (response.uri) {
      return { url: response.uri };
    }
  }

  @ApplyStrictAuth(true)
  @ApplyApiResponse([400, 401, 403, 500])
  @ApiResponse({
    status: 200,
    description: 'Find my tickets',
    schema: {
      example: [
        {
          _id: '682345d4c36f1bd8acc37ac0',
          event_id: {
            _id: '68218e24f41de91e2e46ed0a',
            name: 'Event 1',
            description: 'Description 1',
            location: 'Location 1',
            start_time: '2026-01-24T14:00:00.000Z',
            end_time: '2026-01-25T14:00:00.000Z',
          },
          checked_in: false,
          transaction_id: 'dummy_transaction_id',
          createdAt: '2025-05-13T13:15:00.193Z',
          updatedAt: '2025-05-13T13:15:00.193Z',
          __v: 0,
        },
      ],
    },
  })
  @Get('find-my-tickets')
  async findMyTicket(@Request() req) {
    return await this.ticketService.findMyTickets(req.user._id);
  }
}
