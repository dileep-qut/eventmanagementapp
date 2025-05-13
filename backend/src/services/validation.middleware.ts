import { Injectable } from '@nestjs/common';
import {
  PaymentContext,
  PaymentMiddleware,
} from './payment.middleware.interface';
import { PaymentResponse } from './payment.service.interface';

@Injectable()
export class ValidationMiddleware implements PaymentMiddleware {
  async process(
    context: PaymentContext,
    next: (context: PaymentContext) => Promise<PaymentResponse>,
  ): Promise<PaymentResponse> {
    if (!context.price || context.price <= 0) {
      return {
        paymentNeeded: false,
        uri: '/error',
      };
    }

    if (!context.eventId || context.eventId.length === 0) {
      return {
        paymentNeeded: false,
        uri: '/error',
      };
    }

    return next(context);
  }
}
