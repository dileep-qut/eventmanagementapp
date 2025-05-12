import { Body, Controller, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { GetTicketPriceDto } from './dto/get-ticket-price.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';
import { PaymentService } from '@/services/payment.service';
import { PaymentContext } from '@/services/payment.middleware.interface';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly paymentService: PaymentService,
  ) {}

  @ApplyApiResponse([400, 401, 403, 500])
  @Post('get-price')
  @ApiBearerAuth()
  async getTicketPrice(@Body() dto: GetTicketPriceDto) {
    return await this.ticketService.getTicketPrice(dto.event_id, dto.add_on);
  }

  @ApplyApiResponse([400, 401, 403, 500])
  @Post('create-checkout-session')
  @ApiBearerAuth()
  async createCheckoutSession(@Body() dto: GetTicketPriceDto) {
    const price = await this.ticketService.getTicketPrice(
      dto.event_id,
      dto.add_on,
    );

    if (!price) {
      throw new Error('Price not found');
    }

    const paymentContext: PaymentContext = {
      price: price.price,
      eventId: dto.event_id,
    };

    const response = await this.paymentService.processPayment(paymentContext);

    if (response.uri) {
      return { url: response.uri };
    }
  }
}
