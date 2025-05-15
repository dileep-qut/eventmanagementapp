import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-04-30.basil',
      typescript: true,
    });
  }

  async createCheckoutSession(
    price: number,
    userEmail?: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Event Ticket',
            },
            unit_amount: price * 100, // Convert price to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_SERVER}/mytickets`,
      cancel_url: `${process.env.BASE_SERVER}/cancel`,
      customer_email: userEmail,
    });
  }
}
