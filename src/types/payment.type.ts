export type PaymentGateway = "BKASH" | "STRIPE" | "SSLCOMMERZ";
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface Payment {
  id: string;
  shipmentId: string;
  customerId: string;
  transactionId?: string | null;
  gateway: PaymentGateway;
  amount: number | string;
  status: PaymentStatus;
  gatewayReference?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  shipment?: {
    id: string;
    trackingNumber: string;
    senderName: string;
    receiverName: string;
  };
}

export interface CreateCheckoutSessionPayload {
  shipmentId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionData {
  paymentId?: string;
  sessionId: string;
  paymentUrl: string;
  url?: string;
}
