
export interface AutoShare {
  id: string;
  userId: string;
  userName: string;
  startLocation: string;
  destination: string;
  departureTime: string;
  returnTime: string;
  vehicleType: string;
  seatsAvailable: number;
  days: string[];
  notes: string;
}
