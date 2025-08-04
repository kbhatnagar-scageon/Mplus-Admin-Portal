import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { mockUsers } from "./users";
import { mockStores } from "./stores";
import { Address, Order, OrderStatus } from "@/features/orders/types";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  prescription?: boolean;
}

// Common Indian medicines and medical items
const INDIAN_MEDICINES = [
  { name: "Dolo 650", price: 30, prescription: true },
  { name: "Crocin", price: 25, prescription: false },
  { name: "Azithral", price: 50, prescription: true },
  { name: "Allegra", price: 40, prescription: false },
  { name: "Digene", price: 20, prescription: false },
  { name: "Volini", price: 35, prescription: false },
  { name: "Limcee", price: 15, prescription: false },
  { name: "Becosules", price: 45, prescription: false },
];

// Helper function to generate realistic order status combinations
const generateRealisticOrderData = () => {
  const status = faker.helpers.arrayElement([
    "pending", "confirmed", "preparing", "ready", 
    "out_for_delivery", "delivered", "cancelled"
  ]) as OrderStatus;
  
  let paymentStatus: "PENDING" | "PAID" | "FAILED";
  let needsApproval: boolean;
  let isApproved: boolean | undefined;
  
  // Generate realistic combinations
  switch (status) {
    case "pending":
      paymentStatus = "PENDING";
      needsApproval = true;
      isApproved = false;
      break;
    case "confirmed":
    case "preparing":
    case "ready":
      paymentStatus = faker.helpers.arrayElement(["PAID", "PENDING"]);
      needsApproval = false;
      isApproved = true;
      break;
    case "out_for_delivery":
      paymentStatus = "PAID";
      needsApproval = false;
      isApproved = true;
      break;
    case "delivered":
      paymentStatus = "PAID";
      needsApproval = false;
      isApproved = true;
      break;
    case "cancelled":
      paymentStatus = faker.helpers.arrayElement(["PENDING", "FAILED"]);
      needsApproval = faker.helpers.arrayElement([true, false]);
      isApproved = false;
      break;
    default:
      paymentStatus = "PENDING";
      needsApproval = true;
      isApproved = false;
  }
  
  return { status, paymentStatus, needsApproval, isApproved };
};

export const mockOrders: Order[] = Array.from({ length: 100 }).map((_, index) => {
  const store = faker.helpers.arrayElement(mockStores);
  const customer = faker.helpers.arrayElement(mockUsers);
  const deliveryPersonnel = faker.helpers.arrayElement(
    mockUsers.filter((u) => u.role === "DELIVERY_PERSONNEL")
  );
  
  // Create some dev store orders for testing
  const useDevStore = index < 15; // First 15 orders for dev store
  const finalStore = useDevStore ? mockStores[0] : store; // Dev store is first in array

  const items = faker.helpers
    .arrayElements(INDIAN_MEDICINES, { min: 1, max: 4 })
    .map((medicine) => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unitPrice = medicine.price;
      const totalPrice = unitPrice * quantity;

      return {
        id: uuidv4(),
        name: medicine.name,
        quantity,
        unitPrice,
        totalPrice,
        prescriptionRequired: medicine.prescription,
      };
    });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  );
  const gstAmount = totalAmount * 0.18; // 18% GST
  const deliveryCharges = faker.number.int({ min: 20, max: 100 });

  return {
    id: uuidv4(),
    storeId: finalStore.id,
    storeName: finalStore.name,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    items,
    prescriptionUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
    prescriptionUrls: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
      `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`
    ),
    deliveryAddress: {
      street: faker.location.streetAddress(),
      city: finalStore.address.city,
      state: finalStore.address.state,
      pincode: finalStore.address.pincode,
    } as Address,
    // Use realistic order data combinations
    ...generateRealisticOrderData(),
    approvedAt: generateRealisticOrderData().isApproved ? faker.date.recent().toISOString() : undefined,
    approvedBy: generateRealisticOrderData().isApproved ? "Admin User" : undefined,
    deliveryPersonnelId: Math.random() > 0.3 ? deliveryPersonnel.id : undefined,
    assignedAt:
      Math.random() > 0.3 ? faker.date.recent().toISOString() : undefined,
    estimatedDelivery: faker.date.soon().toISOString(),
    actualDelivery:
      Math.random() > 0.5 ? faker.date.recent().toISOString() : undefined,
    totalAmount,
    gstAmount,
    deliveryCharges,
    // PaymentStatus already set in generateRealisticOrderData()
    createdAt: faker.date.recent().toISOString(),
  };
});

export const getOrderById = (id: string) =>
  mockOrders.find((order) => order.id === id);

export const getOrdersByStatus = (status: Order["status"]) =>
  mockOrders.filter((order) => order.status === status);
