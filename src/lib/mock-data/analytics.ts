import { faker } from '@faker-js/faker';
import { mockOrders } from './orders';
import { mockStores } from './stores';
import { mockUsers } from './users';

export interface DailyOrderTrend {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{name: string, quantity: number}>;
}

export interface DeliveryPerformance {
  deliveryPersonnelId: string;
  name: string;
  totalDeliveries: number;
  successRate: number;
  averageDeliveryTime: number; // in minutes
}

export interface UserActivityMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: {
    storeVendors: number;
    deliveryPersonnel: number;
  };
}

// Daily Order Trends
export const dailyOrderTrends: DailyOrderTrend[] = Array.from({ length: 30 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - index);
  
  const dailyOrders = mockOrders.filter(order => 
    new Date(order.createdAt).toDateString() === date.toDateString()
  );

  const totalOrders = dailyOrders.length;
  const totalRevenue = dailyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    date: date.toISOString(),
    totalOrders,
    totalRevenue,
    averageOrderValue
  };
});

// Store Performance
export const storePerformance: StorePerformance[] = mockStores.map(store => {
  const storeOrders = mockOrders.filter(order => order.storeId === store.id);
  
  const totalOrders = storeOrders.length;
  const totalRevenue = storeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const topSellingItems = storeOrders
    .flatMap(order => order.items)
    .reduce((acc, item) => {
      const existing = acc.find(i => i.name === item.name);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ name: item.name, quantity: item.quantity });
      }
      return acc;
    }, [] as Array<{name: string, quantity: number}>)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    storeId: store.id,
    storeName: store.name,
    totalOrders,
    totalRevenue,
    averageOrderValue,
    topSellingItems
  };
});

// Delivery Performance
export const deliveryPerformance: DeliveryPerformance[] = mockUsers
  .filter(user => user.role === 'DELIVERY_PERSONNEL')
  .map(personnel => {
    const personnelOrders = mockOrders.filter(
      order => order.deliveryPersonnelId === personnel.id
    );

    const totalDeliveries = personnelOrders.length;
    const successfulDeliveries = personnelOrders.filter(
      order => order.status === 'DELIVERED'
    ).length;
    const successRate = totalDeliveries > 0 
      ? (successfulDeliveries / totalDeliveries) * 100 
      : 0;

    // Simulate average delivery time (in minutes)
    const averageDeliveryTime = faker.number.int({ min: 20, max: 120 });

    return {
      deliveryPersonnelId: personnel.id,
      name: personnel.name,
      totalDeliveries,
      successRate,
      averageDeliveryTime
    };
  });

// User Activity Metrics
export const userActivityMetrics: UserActivityMetrics = {
  totalUsers: mockUsers.length,
  newUsersThisMonth: faker.number.int({ min: 5, max: 50 }),
  activeUsers: {
    storeVendors: mockUsers.filter(user => 
      user.role === 'STORE_VENDOR' && user.status === 'ACTIVE'
    ).length,
    deliveryPersonnel: mockUsers.filter(user => 
      user.role === 'DELIVERY_PERSONNEL' && user.status === 'ACTIVE'
    ).length
  }
};