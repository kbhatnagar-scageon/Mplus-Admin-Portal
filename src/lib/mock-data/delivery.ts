import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { mockOrders } from './orders';
import { DeliveryPersonnel, DeliveryAssignment, VehicleType, DeliveryStatus } from '@/features/delivery/types';

// Indian area names for coverage
const INDIAN_AREAS = [
  "Koramangala", "Indiranagar", "Whitefield", "Electronic City", "Marathahalli",
  "HSR Layout", "BTM Layout", "Jayanagar", "Rajajinagar", "Malleshwaram",
  "Bandra", "Andheri", "Powai", "Thane", "Borivali",
  "Connaught Place", "Lajpat Nagar", "Karol Bagh", "Dwarka", "Gurgaon",
  "Sector 1", "Sector 18", "Sector 62", "Greater Noida", "Faridabad"
];

const VEHICLE_TYPES: VehicleType[] = ["bicycle", "motorcycle", "van", "car"];
const DELIVERY_STATUSES: DeliveryStatus[] = ["available", "busy", "offline", "on_break"];

// Generate comprehensive delivery personnel data
export const mockDeliveryPersonnel: DeliveryPersonnel[] = Array.from({ length: 25 }).map((_, index) => {
  const vehicleType = faker.helpers.arrayElement(VEHICLE_TYPES);
  const status = faker.helpers.arrayElement(DELIVERY_STATUSES);
  const totalDeliveries = faker.number.int({ min: 50, max: 500 });
  const successfulDeliveries = faker.number.int({ min: Math.floor(totalDeliveries * 0.8), max: totalDeliveries });
  const onTimeDeliveries = faker.number.int({ min: Math.floor(successfulDeliveries * 0.7), max: successfulDeliveries });
  
  // Assign first 5 personnel to dev store for testing
  const storeId = index < 5 ? "dev-store-id" : undefined;
  
  return {
    id: uuidv4(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: `+91${faker.string.numeric(10)}`,
    avatar: faker.image.avatar(),
    storeId, // Assign to store for testing
    vehicleType,
    vehicleNumber: `${faker.helpers.arrayElement(['MH', 'KA', 'DL', 'UP', 'RJ'])}-${faker.string.numeric(2)}-${faker.string.alphanumeric(2)}-${faker.string.numeric(4)}`,
    licenseNumber: vehicleType !== 'bicycle' ? `${faker.helpers.arrayElement(['MH', 'KA', 'DL', 'UP', 'RJ'])}${faker.string.numeric(13)}` : undefined,
    status,
    isActive: faker.datatype.boolean(0.85),
    coverageAreas: faker.helpers.arrayElements(INDIAN_AREAS, { min: 2, max: 5 }),
    currentLocation: status === 'available' || status === 'busy' ? {
      lat: faker.location.latitude({ min: 12.8, max: 13.2 }), // Bangalore area
      lng: faker.location.longitude({ min: 77.4, max: 77.8 }),
      address: faker.location.streetAddress()
    } : undefined,
    ratings: {
      average: faker.number.float({ min: 3.5, max: 5.0, precision: 0.1 }),
      total: faker.number.int({ min: 20, max: 200 })
    },
    deliveryStats: {
      totalDeliveries,
      successfulDeliveries,
      onTimeDeliveries,
      avgDeliveryTime: faker.number.int({ min: 25, max: 60 })
    },
    workingHours: {
      start: faker.helpers.arrayElement(['08:00', '09:00', '10:00']),
      end: faker.helpers.arrayElement(['18:00', '19:00', '20:00'])
    },
    emergencyContact: {
      name: faker.person.fullName(),
      phone: `+91${faker.string.numeric(10)}`,
      relation: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
    },
    joinedAt: faker.date.past({ years: 2 }).toISOString(),
    lastActive: status !== 'offline' ? faker.date.recent({ days: 1 }).toISOString() : undefined,
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString()
  };
});

export const mockDeliveryAssignments: DeliveryAssignment[] = mockOrders
  .filter(order => order.deliveryPersonnelId)
  .map(order => {
    const deliveryPersonnel = mockDeliveryPersonnel.find(
      personnel => personnel.id === order.deliveryPersonnelId
    ) || mockDeliveryPersonnel[0];

    return {
      id: uuidv4(),
      orderId: order.id,
      deliveryPersonnelId: deliveryPersonnel.id,
      assignedAt: order.assignedAt || new Date().toISOString(),
      estimatedDeliveryTime: faker.date.soon().toISOString(),
      actualDeliveryTime: Math.random() > 0.5 ? faker.date.recent().toISOString() : undefined,
      status: faker.helpers.arrayElement(["assigned", "picked_up", "in_transit", "delivered", "failed"]),
      pickupLocation: {
        address: faker.location.streetAddress(),
        lat: faker.location.latitude({ min: 12.8, max: 13.2 }),
        lng: faker.location.longitude({ min: 77.4, max: 77.8 })
      },
      deliveryLocation: {
        address: faker.location.streetAddress(),
        lat: faker.location.latitude({ min: 12.8, max: 13.2 }),
        lng: faker.location.longitude({ min: 77.4, max: 77.8 })
      },
      distance: faker.number.float({ min: 2, max: 15, precision: 0.1 }),
      notes: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
      proofOfDelivery: Math.random() > 0.6 ? {
        type: faker.helpers.arrayElement(["photo", "signature", "otp"]),
        data: faker.string.alphanumeric(10),
        timestamp: faker.date.recent().toISOString()
      } : undefined
    };
  });

// Helper functions
export const getDeliveryPersonnelById = (id: string) => 
  mockDeliveryPersonnel.find(personnel => personnel.id === id);

export const getActiveDeliveryPersonnel = () => 
  mockDeliveryPersonnel.filter(personnel => personnel.isActive);

export const getAvailableDeliveryPersonnel = () => 
  mockDeliveryPersonnel.filter(personnel => personnel.status === 'available' && personnel.isActive);

export const getDeliveryPersonnelByArea = (area: string) => 
  mockDeliveryPersonnel.filter(personnel => 
    personnel.coverageAreas.some(coverageArea => 
      coverageArea.toLowerCase().includes(area.toLowerCase())
    )
  );

export const getDeliveryAssignmentByOrderId = (orderId: string) => 
  mockDeliveryAssignments.find(assignment => assignment.orderId === orderId);

export const getDeliveryAssignmentsByPersonnel = (personnelId: string) => 
  mockDeliveryAssignments.filter(assignment => assignment.deliveryPersonnelId === personnelId);

export const getDeliveryAssignmentsByStatus = (status: DeliveryAssignment['status']) => 
  mockDeliveryAssignments.filter(assignment => assignment.status === status);