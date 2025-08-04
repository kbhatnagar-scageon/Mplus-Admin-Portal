import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { INDIAN_STATES, STORE_TYPES, STORE_STATUS } from '@/lib/constants';
import { Store } from '@/features/stores/types';

// Generate a valid Indian GSTIN
const generateGSTIN = () => {
  const stateCode = faker.string.numeric(2);
  const panPrefix = faker.string.alpha({ count: 5, casing: 'upper' });
  const number = faker.string.numeric(4);
  const alphaCheck = faker.string.alpha({ count: 1, casing: 'upper' });
  const digit1 = faker.string.numeric(1);
  return `${stateCode}${panPrefix}${number}${alphaCheck}${digit1}Z${digit1}`;
};

// Generate a Drug License number
const generateDrugLicense = (state: string) => {
  const stateCode = state.slice(0, 2).toUpperCase();
  const year = new Date().getFullYear();
  const number = faker.string.numeric(5);
  return `DL-${stateCode}-${year}-${number}`;
};

// Dev store for testing
const devStore: Store = {
  id: "dev-store-id",
  name: "Dev Pharmacy Store",
  ownerName: "Dev Store Owner",
  contactNumber: "+919876543210",
  email: "dev-store@mplus.dev",
  address: {
    street: "123 Dev Street",
    city: "Mumbai",
    state: "MAHARASHTRA",
    pincode: "400001"
  },
  drugLicense: "DL-MH-2024-12345",
  gstin: "27ABCDE1234F1Z5",
  foodLicense: "FL-12345678901234",
  storeType: "PHARMACY",
  operatingHours: {
    open: '09:00',
    close: '21:00'
  },
  serviceAreas: ["Mumbai", "Navi Mumbai", "Thane"],
  status: "ACTIVE",
  evitalRxId: "EVTL-DEV-STORE",
  createdAt: new Date().toISOString(),
  approvedAt: new Date().toISOString()
};

export const mockStores: Store[] = [
  devStore,
  ...Array.from({ length: 29 }).map(() => {
  const state = faker.helpers.arrayElement(INDIAN_STATES);
  const city = faker.location.city();

  return {
    id: uuidv4(),
    name: `${faker.company.name()} Pharmacy`,
    ownerName: faker.person.fullName(),
    contactNumber: `+91${faker.string.numeric(10)}`,
    email: faker.internet.email(),
    address: {
      street: faker.location.streetAddress(),
      city,
      state,
      pincode: faker.string.numeric(6)
    },
    drugLicense: generateDrugLicense(state),
    gstin: generateGSTIN(),
    foodLicense: Math.random() > 0.5 ? `FL-${faker.string.numeric(14)}` : undefined,
    storeType: faker.helpers.arrayElement(Object.values(STORE_TYPES)),
    operatingHours: {
      open: '09:00',
      close: '21:00'
    },
    serviceAreas: [
      faker.location.city(),
      faker.location.city(),
      faker.location.city()
    ],
    status: faker.helpers.arrayElement(Object.values(STORE_STATUS)),
    evitalRxId: Math.random() > 0.2 ? `EVTL-${uuidv4().slice(0, 8)}` : undefined,
    createdAt: faker.date.past().toISOString(),
    approvedAt: Math.random() > 0.2 ? faker.date.recent().toISOString() : undefined
  };
  })
];

export const getStoreById = (id: string) => 
  mockStores.find(store => store.id === id);

export const getStoresByStatus = (status: Store['status']) => 
  mockStores.filter(store => store.status === status);