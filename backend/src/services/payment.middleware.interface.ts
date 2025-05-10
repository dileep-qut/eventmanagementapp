import { PaymentResponse } from './payment.service.interface';

export interface PaymentContext {
  priceId: string;
  userEmail?: string;
}

export interface PaymentMiddleware {
  process(
    context: PaymentContext,
    next: (context: PaymentContext) => Promise<PaymentResponse>,
  ): Promise<PaymentResponse>;
}
