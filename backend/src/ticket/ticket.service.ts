import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '@/event/entities/event.entity';
import {
  TicketList,
  TicketListDocument,
} from '@/ticket/entities/ticket-list.entity';
import {
  VipAddOn,
  FoodAddOn,
  ParkingAddOn,
  PriorityAccessAddOn,
  BasicTicket,
  ITicket,
} from '@/ticket/ticket-decorator';

import {
  IPricingStrategy,
  FullPriceStrategy,
  EarlyBirdStrategy,
} from '@/ticket/ticket-strategy';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(TicketList.name)
    private readonly ticketListModel: Model<TicketListDocument>,
  ) {}
  async getTicketPrice(
    event_id: string,
    add_on: {
      vip: boolean;
      parking: boolean;
      food: boolean;
      priority: boolean;
    },
  ) {
    const event = await this.eventModel.findById(event_id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const ticket_strategy = this.selectPricingStrategy(event);

    let ticketPrice = ticket_strategy.apply(event.ticket_price);

    return { price: this.applyAddOns(ticketPrice, add_on) };
  }

  async orderTicket(event_id, add_on) {
    const event = await this.eventModel.findById(event_id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const ticket_strategy = this.selectPricingStrategy(event);
    const ticket_price = ticket_strategy.apply(event.ticket_price);
  }

  /**
   * Select the pricing strategy based on the request context
   * @param event
   * @private
   * @returns {IPricingStrategy}
   */
  private selectPricingStrategy(event: Event): IPricingStrategy {
    const now = new Date();

    const msInDay = 86_400_000;

    // Early bird price will be apply if the event is more than 7 days away
    const daysLeft = (event.start_time.getTime() - now.getTime()) / msInDay;
    if (daysLeft >= 7) return new EarlyBirdStrategy();

    return new FullPriceStrategy();
  }

  /**
   * Apply add-ons to the ticket price
   * @param ticket_price - The base ticket price
   * @param add_on - The add-ons to apply
   * @returns The final ticket price after applying add-ons
   */
  private applyAddOns(
    ticket_price: number,
    add_on: {
      vip: boolean;
      parking: boolean;
      food: boolean;
      priority: boolean;
    },
  ): number {
    let ticket: ITicket = new BasicTicket(ticket_price) as ITicket;

    // Check and apply add-ons
    if (add_on.vip) ticket = new VipAddOn(ticket);
    if (add_on.parking) ticket = new ParkingAddOn(ticket);
    if (add_on.food) ticket = new FoodAddOn(ticket);
    if (add_on.priority) ticket = new PriorityAccessAddOn(ticket);

    return ticket.getPrice();
  }
}
