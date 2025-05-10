import { PaymentContext } from './payment.middleware.interface';

export interface PaymentResponse {
  paymentNeeded: boolean;
  uri?: string;
}

export interface IPaymentService {
  processPayment(context: PaymentContext): Promise<PaymentResponse>;
}
