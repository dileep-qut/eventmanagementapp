import { Injectable } from '@nestjs/common';
import {
  PaymentContext,
  PaymentMiddleware,
} from './payment.middleware.interface';
import { PaymentResponse } from './payment.service.interface';
import { StripeService } from './stripe.service';

@Injectable()
export class StripePaymentMiddleware implements PaymentMiddleware {
  constructor(private readonly stripeService: StripeService) {}

  async process(
    context: PaymentContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: (context: PaymentContext) => Promise<PaymentResponse>,
  ): Promise<PaymentResponse> {
    const session = await this.stripeService.createCheckoutSession(
      context.price,
      context.userEmail,
    );
    const response: PaymentResponse = {
      paymentNeeded: true,
      uri: session.url ?? undefined,
    };

    return response;
  }
}
