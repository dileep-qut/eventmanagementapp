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
    if (!context.priceId || context.priceId.trim() === '') {
      return {
        paymentNeeded: false,
        uri: '/error',
      };
    }

    if (!context.userEmail || !context.userEmail.includes('@')) {
      return {
        paymentNeeded: false,
        uri: '/error',
      };
    }

    return next(context);
  }
}
