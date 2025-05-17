export interface PaymentResponse {
  paymentNeeded: boolean;
  uri?: string;
}

export interface PaymentContext {
  price: number;
  userEmail?: string;
  eventId?: string;
  ticketId?: string;
}

export interface IPaymentService {
  processPayment(context: PaymentContext): Promise<PaymentResponse>;
}
