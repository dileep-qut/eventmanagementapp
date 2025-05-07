export interface ITicket {
  getPrice(): number;
  getDescription(): string;
}

export class BasicTicket implements ITicket {
  constructor(private readonly basePrice: number) {}
  getPrice() {
    return this.basePrice;
  }
  getDescription() {
    return 'General Admission';
  }
}

abstract class TicketDecorator implements ITicket {
  protected constructor(protected readonly ticket: ITicket) {}
  abstract getPrice(): number;
  abstract getDescription(): string;
}

// VIP Access Add-On will add $100 to the base ticket price
export class VipAddOn extends TicketDecorator {
  constructor(ticket: ITicket) {
    super(ticket);
  }
  getPrice() {
    return this.ticket.getPrice() + 100;
  }
  getDescription() {
    return `${this.ticket.getDescription()} + VIP Access`;
  }
}

// Parking Add-On will add $20 to the base ticket price
export class ParkingAddOn extends TicketDecorator {
  constructor(ticket: ITicket) {
    super(ticket);
  }
  getPrice() {
    return this.ticket.getPrice() + 20;
  }
  getDescription() {
    return `${this.ticket.getDescription()} + Parking`;
  }
}

// Food Add-On will add $30 to the base ticket price
export class FoodAddOn extends TicketDecorator {
  constructor(ticket: ITicket) {
    super(ticket);
  }
  getPrice() {
    return this.ticket.getPrice() + 30;
  }
  getDescription() {
    return `${this.ticket.getDescription()} + Food`;
  }
}

// Priority Access Add-On will add $50 to the base ticket price
export class PriorityAccessAddOn extends TicketDecorator {
  constructor(ticket: ITicket) {
    super(ticket);
  }
  getPrice() {
    return this.ticket.getPrice() + 50;
  }
  getDescription() {
    return `${this.ticket.getDescription()} + Priority Access`;
  }
}
