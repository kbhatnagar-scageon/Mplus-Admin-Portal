import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "SUPERADMIN" | "STORE_VENDOR" | "DELIVERY_PERSONNEL";
  storeId?: string;
  vehicleType?: "BIKE" | "CYCLE" | "CAR";
  vehicleNumber?: string;
  coverageAreas?: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

// Generate Indian phone numbers
const generateIndianPhoneNumber = () => {
  return `+91${faker.string.numeric(10)}`;
};

// Generate realistic Indian names
const generateIndianName = () => {
  const firstName = faker.person.firstName("male");
  const lastName = faker.person.lastName("male");
  return `${firstName} ${lastName}`;
};

// List of Indian states for coverage areas
const INDIAN_STATES = [
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Delhi",
  "Gujarat",
  "Uttar Pradesh",
  "West Bengal",
  "Rajasthan",
  "Kerala",
  "Madhya Pradesh",
];

// Dev superadmin user for easy login
const superAdminUser: User = {
  id: "superadmin-dev-id",
  name: "Admin User",
  email: "admin@mplus.dev",
  phone: "+919876543210",
  role: "SUPERADMIN",
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Dev store user
const devStoreUser: User = {
  id: "dev-store-user-id",
  name: "Dev Store User",
  email: "dev-store-user@mplus.dev",
  phone: "+919876543210",
  role: "STORE_VENDOR",
  storeId: "dev-store-id", // Fixed: assign to specific store
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Dev delivery user
const devDeliveryUser: User = {
  id: "dev-delivery-user-id",
  name: "Dev Delivery User",
  email: "dev-delivery-user@mplus.dev",
  phone: "+919876543210",
  role: "DELIVERY_PERSONNEL",
  vehicleType: "BIKE",
  vehicleNumber: "MH-01-AB-1234",
  coverageAreas: ["Mumbai", "Pune"],
  status: "ACTIVE",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const generatedUsers: User[] = Array.from({ length: 50 }).map(() => {
  const role = faker.helpers.arrayElement([
    "STORE_VENDOR",
    "DELIVERY_PERSONNEL",
  ]);

  return {
    id: uuidv4(),
    name: generateIndianName(),
    email: faker.internet.email(),
    phone: generateIndianPhoneNumber(),
    role,
    ...(role === "STORE_VENDOR"
      ? {
          storeId: uuidv4(), // Link to a mock store later
        }
      : {
          vehicleType: faker.helpers.arrayElement(["BIKE", "CYCLE", "CAR"]),
          vehicleNumber: `MH-${faker.string.numeric(2)}-${faker.string.alphanumeric(2)}-${faker.string.numeric(4)}`,
          coverageAreas: faker.helpers.arrayElements(INDIAN_STATES, {
            min: 1,
            max: 3,
          }),
        }),
    status: faker.helpers.arrayElement(["ACTIVE", "INACTIVE"]),
    createdAt: faker.date.past().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export const mockUsers: User[] = [
  superAdminUser,
  devStoreUser,
  devDeliveryUser,
  ...generatedUsers,
];

export const getUserById = (id: string) =>
  mockUsers.find((user) => user.id === id);

export const getUsersByRole = (role: User["role"]) =>
  mockUsers.filter((user) => user.role === role);
