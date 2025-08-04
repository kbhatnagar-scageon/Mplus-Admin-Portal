export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Store {
  id: string;
  name: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  address: Address;
  drugLicense: string;
  gstin: string;
  foodLicense?: string;
  storeType: 'RETAIL' | 'CHAIN';
  operatingHours: {
    open: string;
    close: string;
  };
  serviceAreas: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING_APPROVAL';
  evitalRxId?: string;
  createdAt: string;
  approvedAt?: string;
}

export type StoreStatus = Store['status'];
export type StoreType = Store['storeType'];