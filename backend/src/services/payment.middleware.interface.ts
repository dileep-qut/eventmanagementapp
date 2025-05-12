import { PaymentResponse } from './payment.service.interface';

export interface PaymentContext {
  price: number;
  userEmail?: string;
  eventId?: string;
}

export interface PaymentMiddleware {
  process(
    context: PaymentContext,
    next: (context: PaymentContext) => Promise<PaymentResponse>,
  ): Promise<PaymentResponse>;
}
