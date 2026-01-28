export type ShipmentStatus = 'Pending' | 'In Transit' | 'On Hold' | 'Delivered';

export interface ShipmentItem {
  id: string;
  name: string;
  weight: string;
  quantity: number;
}

export interface StatusLog {
  id: string;
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  notes?: string;
}

export interface Shipment {
  id: string; // Tracking Number
  date: string;
  expectedDelivery: string;
  status: ShipmentStatus;
  
  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  shipperEmail: string;

  // Receiver
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;

  // Payment
  shippingCost: number;
  amountPaid: number;
  paymentMethod: string;

  // Items
  items: ShipmentItem[];

  // Logistics
  pickupTime: string;
  estimatedDuration: string;
  notes?: string;

  // History
  history: StatusLog[];
}
