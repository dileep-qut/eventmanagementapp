import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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
  // This function will serve as the template flow for purchasing a ticket
  async purchaseTicket(
    event_id: string,
    user_id: string,
    add_on: {
      vip: boolean;
      parking: boolean;
      food: boolean;
      priority: boolean;
    },
  ) {
    const event = await this.eventModel.findById(event_id);

    // Step 1: Check if the event exists
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Step 2: Apply add-ons and pricing strategy to the ticket
    const ticket_strategy = this.selectPricingStrategy(event);
    const ticket_price = ticket_strategy.apply(event.ticket_price);
    const final_price = this.applyAddOns(ticket_price, add_on);

    // Step 3: Check if enough tickets are available
    const ticket_purchased_count = await this.ticketListModel.countDocuments({
      event_id: event._id,
    });
    // If ticket_purchased_count is not less than or equal to event.ticket_available
    if (!(ticket_purchased_count < event.ticket_available)) {
      throw new ForbiddenException('Ticket Sold Out');
    }

    // Step 4: Check if the user already has a ticket
    const existingTicket = await this.ticketListModel.findOne({
      event_id: event._id,
      user_id,
    });

    if (existingTicket) {
      throw new ForbiddenException('User already has a ticket');
    }

    // Step 5: Create a new ticket list entry
    const ticketList = new this.ticketListModel({
      event_id: event._id,
      user_id,
      checked_in: false,
      transaction_id: 'dummy_transaction_id', // Replace with actual transaction ID
    });

    await ticketList.save();

    // Step 6: Add participants to the event
    event.participants.push(ticketList.user_id);
    await event.save();

    // Step 7: Return the ticket entry
    return {
      price: final_price,
      ticket_id: ticketList._id,
    };
  }

  async findMyTickets(user_id: string) {
    const tickets = await this.ticketListModel
      .find({ user_id })
      .populate(
        'event_id',
        'name description location start_time end_time image_url',
      )
      .select('-user_id')
      .exec();

    if (!tickets) {
      throw new NotFoundException('No tickets found');
    }

    return tickets;
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
