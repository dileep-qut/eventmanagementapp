import { PaymentContext, PaymentResponse } from './payment.service.interface';

export interface IPaymentMiddleware {
  process(
    context: PaymentContext,
    next: (context: PaymentContext) => Promise<PaymentResponse>,
  ): Promise<PaymentResponse>;
}
