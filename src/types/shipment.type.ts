export type ShipmentStatus =
  | "CREATED"
  | "PAYMENT_CONFIRMED"
  | "COURIER_ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "RETURNED"
  | "CANCELLED";

export type DeliveryZoneType = "INSIDE_DHAKA" | "OUTSIDE_DHAKA";
export type DeliverySpeedType = "STANDARD" | "EXPRESS";

export interface ShipmentEvent {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  description?: string | null;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  providerId: string;
  pickupCourierId?: string | null;
  deliveryCourierId?: string | null;
  senderZoneId: string;
  receiverZoneId: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  parcelDescription?: string | null;
  weight: number;
  quantity: number;
  deliveryFee: number | string;
  totalAmount: number | string;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
  };
  pickupCourier?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  deliveryCourier?: {
    id: string;
    name: string;
    phone: string;
  } | null;
  events?: ShipmentEvent[];
  payment?: {
    id: string;
    gateway: string;
    amount: number | string;
    status: string;
    transactionId?: string | null;
  } | null;
}

export interface CreateShipmentPayload {
  providerId: string;
  senderZoneId: string;
  receiverZoneId: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  parcelDescription?: string;
  weight: number;
  quantity?: number;
}

export interface ShipmentQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ShipmentStatus | "ALL";
  senderZoneId?: string;
  receiverZoneId?: string;
}
