export interface Zone {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateZonePayload {
  name: string;
}
