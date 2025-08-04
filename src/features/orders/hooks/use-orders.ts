"use client";

import { useState, useMemo } from "react";
import { Order, OrderStatus } from "@/features/orders/types";
import { mockOrders, getOrderById, getOrdersByStatus } from "@/lib/mock-data/orders";
import { useAuth } from "@/hooks/use-auth";

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [filters, setFilters] = useState<{
    status?: Order['status'];
    dateFrom?: Date;
    dateTo?: Date;
  }>({});

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const { status, dateFrom, dateTo } = filters;
      const orderDate = new Date(order.createdAt);

      // Filter by user's store if user is STORE_VENDOR
      const storeMatch = user?.role !== 'STORE_VENDOR' || !user.storeId || order.storeId === user.storeId;
      const statusMatch = !status || order.status === status;
      const dateFromMatch = !dateFrom || orderDate >= dateFrom;
      const dateToMatch = !dateTo || orderDate <= dateTo;

      return storeMatch && statusMatch && dateFromMatch && dateToMatch;
    });
  }, [orders, filters, user]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
          : order
      )
    );
  };

  const assignDeliveryPersonnel = (orderId: string, personnelId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId && order.isApproved 
          ? { 
              ...order, 
              deliveryPersonnelId: personnelId, 
              status: "ready", 
              assignedAt: new Date().toISOString() 
            } 
          : order
      )
    );
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: "cancelled", 
              cancellationReason: reason,
              updatedAt: new Date().toISOString() 
            } 
          : order
      )
    );
  };

  const approveOrder = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              isApproved: true,
              approvedAt: new Date().toISOString(),
              approvedBy: user?.name || 'Admin'
            } 
          : order
      )
    );
  };

  return {
    orders: filteredOrders,
    updateOrderStatus,
    assignDeliveryPersonnel,
    cancelOrder,
    approveOrder,
    setFilters,
    getOrderById,
    getOrdersByStatus
  };
};