import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '@/event/entities/event.entity';
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
  HotDemandStrategy,
} from '@/ticket/ticket-strategy';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
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

    // Declare a base ticket
    let ticket: ITicket = new BasicTicket(
      ticket_strategy.apply(event.ticket_price),
    ) as ITicket;
    // Check and apply add-ons
    if (add_on.vip) ticket = new VipAddOn(ticket);
    if (add_on.parking) ticket = new ParkingAddOn(ticket);
    if (add_on.food) ticket = new FoodAddOn(ticket);
    if (add_on.priority) ticket = new PriorityAccessAddOn(ticket);

    return { price: ticket.getPrice() };
  }

  private selectPricingStrategy(event: Event): IPricingStrategy {
    const now = new Date();

    const msInDay = 86_400_000;

    // Early bird price will be apply if the event is more than 7 days away
    const daysLeft = (event.start_time.getTime() - now.getTime()) / msInDay;
    if (daysLeft >= 7) return new EarlyBirdStrategy();

    return new FullPriceStrategy();
  }
}
