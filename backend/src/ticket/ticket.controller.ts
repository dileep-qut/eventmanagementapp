import { Body, Controller, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { GetTicketPriceDto } from './dto/get-ticket-price.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ApplyApiResponse } from '@/_decorators/apply-api-response.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

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
  @ApiBearerAuth()
  async getTicketPrice(@Body() dto: GetTicketPriceDto) {
    return await this.ticketService.getTicketPrice(dto.event_id, dto.add_on);
  }
}
