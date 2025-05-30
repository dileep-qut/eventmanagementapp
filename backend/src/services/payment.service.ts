import { Injectable } from '@nestjs/common';
import {
  IPaymentService,
  PaymentContext,
  PaymentResponse,
} from './payment.service.interface';
import { IPaymentMiddleware } from './payment.middleware.interface';
import { ValidationMiddleware } from './validation.middleware';
import { StripePaymentMiddleware } from './stripe.middleware';

@Injectable()
export class PaymentService implements IPaymentService {
  private middlewares: IPaymentMiddleware[] = [];

  constructor(
    validationMiddleware: ValidationMiddleware,
    stripeMiddleware: StripePaymentMiddleware,
  ) {
    this.middlewares = [validationMiddleware, stripeMiddleware];
  }

  async processPayment(context: PaymentContext): Promise<PaymentResponse> {
    let index = 0;

    const executeNext = async (
      ctx: PaymentContext,
    ): Promise<PaymentResponse> => {
      const currentMiddleware = this.middlewares[index];
      index++;
      // Call the current middleware's process method
      return currentMiddleware.process(ctx, executeNext);
    };

    return await executeNext(context);
  }
}
