import { mockUsers, User, getUserById, getUsersByRole } from './mock-data/users';
import { mockStores, Store, getStoreById, getStoresByStatus } from './mock-data/stores';
import { mockOrders, Order, getOrderById, getOrdersByStatus } from './mock-data/orders';
import { mockDeliveryAssignments, DeliveryAssignment, getDeliveryAssignmentByOrderId, getDeliveryAssignmentsByPersonnel, getDeliveryAssignmentsByStatus } from './mock-data/delivery';
import { dailyOrderTrends, storePerformance, deliveryPerformance, userActivityMetrics } from './mock-data/analytics';

// Utility function to simulate API delay
const simulateDelay = (minMs = 300, maxMs = 1500) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (maxMs - minMs) + minMs));

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export type FilterParams<T> = {
  [K in keyof T]?: T[K];
}

export class MockApiService {
  // Users
  async getUsers(params?: PaginationParams & FilterParams<User>): Promise<User[]> {
    await simulateDelay();
    let users = mockUsers;

    if (params) {
      const { page = 1, pageSize = 10, ...filters } = params;
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        users = users.filter(user => user[key as keyof User] === filters[key]);
      });

      // Pagination
      const startIndex = (page - 1) * pageSize;
      users = users.slice(startIndex, startIndex + pageSize);
    }

    return users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    await simulateDelay();
    return getUserById(id);
  }

  async getUsersByRole(role: User['role']): Promise<User[]> {
    await simulateDelay();
    return getUsersByRole(role);
  }

  // Stores
  async getStores(params?: PaginationParams & FilterParams<Store>): Promise<Store[]> {
    await simulateDelay();
    let stores = mockStores;

    if (params) {
      const { page = 1, pageSize = 10, ...filters } = params;
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        stores = stores.filter(store => store[key as keyof Store] === filters[key]);
      });

      // Pagination
      const startIndex = (page - 1) * pageSize;
      stores = stores.slice(startIndex, startIndex + pageSize);
    }

    return stores;
  }

  async getStoreById(id: string): Promise<Store | undefined> {
    await simulateDelay();
    return getStoreById(id);
  }

  async getStoresByStatus(status: Store['status']): Promise<Store[]> {
    await simulateDelay();
    return getStoresByStatus(status);
  }

  // Orders
  async getOrders(params?: PaginationParams & FilterParams<Order>): Promise<Order[]> {
    await simulateDelay();
    let orders = mockOrders;

    if (params) {
      const { page = 1, pageSize = 10, ...filters } = params;
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        orders = orders.filter(order => order[key as keyof Order] === filters[key]);
      });

      // Pagination
      const startIndex = (page - 1) * pageSize;
      orders = orders.slice(startIndex, startIndex + pageSize);
    }

    return orders;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    await simulateDelay();
    return getOrderById(id);
  }

  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    await simulateDelay();
    return getOrdersByStatus(status);
  }

  // Delivery
  async getDeliveryAssignments(params?: PaginationParams & FilterParams<DeliveryAssignment>): Promise<DeliveryAssignment[]> {
    await simulateDelay();
    let assignments = mockDeliveryAssignments;

    if (params) {
      const { page = 1, pageSize = 10, ...filters } = params;
      
      // Apply filters
      Object.keys(filters).forEach(key => {
        assignments = assignments.filter(
          assignment => assignment[key as keyof DeliveryAssignment] === filters[key]
        );
      });

      // Pagination
      const startIndex = (page - 1) * pageSize;
      assignments = assignments.slice(startIndex, startIndex + pageSize);
    }

    return assignments;
  }

  async getDeliveryAssignmentByOrderId(orderId: string): Promise<DeliveryAssignment | undefined> {
    await simulateDelay();
    return getDeliveryAssignmentByOrderId(orderId);
  }

  async getDeliveryAssignmentsByPersonnel(personnelId: string): Promise<DeliveryAssignment[]> {
    await simulateDelay();
    return getDeliveryAssignmentsByPersonnel(personnelId);
  }

  async getDeliveryAssignmentsByStatus(status: DeliveryAssignment['status']): Promise<DeliveryAssignment[]> {
    await simulateDelay();
    return getDeliveryAssignmentsByStatus(status);
  }

  // Analytics
  async getDailyOrderTrends() {
    await simulateDelay();
    return dailyOrderTrends;
  }

  async getStorePerformance() {
    await simulateDelay();
    return storePerformance;
  }

  async getDeliveryPerformance() {
    await simulateDelay();
    return deliveryPerformance;
  }

  async getUserActivityMetrics() {
    await simulateDelay();
    return userActivityMetrics;
  }
}

// Singleton instance
export const apiService = new MockApiService();