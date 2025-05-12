import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ValidationMiddleware } from './validation.middleware';
import { StripePaymentMiddleware } from './stripe.middleware';
import { StripeService } from './stripe.service';

@Module({
  providers: [
    PaymentService,
    ValidationMiddleware,
    StripePaymentMiddleware,
    StripeService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
