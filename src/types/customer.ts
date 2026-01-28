export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    totalShipments: number;
    createdAt: string;
}

export type Receiver = Customer;
