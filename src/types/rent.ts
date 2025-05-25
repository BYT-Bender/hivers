
export interface RentItem {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  category: string;
  condition: string;
  rentAmount: number;
  rentDuration: string;
  description: string;
  imageUrl: string;
  available: boolean;
}
