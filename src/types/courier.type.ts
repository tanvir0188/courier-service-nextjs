export type CourierStatus = "AVAILABLE" | "BUSY" | "OFFLINE";
export type VehicleType = "Motorbike" | "Bicycle" | "Van";

export interface Courier {
  id: string;
  providerId: string;
  name: string;
  phone: string;
  zoneId: string;
  zone?: {
    id: string;
    name: string;
  };
  status: CourierStatus;
  vehicle?: VehicleType;
  activeDeliveries?: number;
  totalDelivered?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourierPayload {
  name: string;
  phone: string;
  zoneId: string;
}

export interface UpdateCourierPayload {
  name?: string;
  phone?: string;
  zoneId?: string;
  status?: CourierStatus;
}
