import { useState, useMemo } from "react";
import { Order } from "@/features/orders/types";
import { mockOrders, getOrderById } from "@/lib/mock-data/orders";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export interface OrderUpdatePayload {
  status?: Order["status"];
  deliveryPersonnelId?: string;
  remarks?: string;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter orders based on user role
  const filteredOrders = useMemo(() => {
    if (!user) return [];
    
    switch (user.role) {
      case "STORE_VENDOR":
        // Store vendors only see orders from their store
        return orders.filter(order => order.storeId === user.storeId);
      case "DELIVERY_PERSONNEL":
        // Delivery personnel see orders assigned to them or available for assignment
        return orders.filter(order => 
          order.deliveryPersonnelId === user.id || 
          (!order.deliveryPersonnelId && order.isApproved && order.status !== 'cancelled')
        );
      case "SUPERADMIN":
      default:
        // Superadmin sees all orders
        return orders;
    }
  }, [orders, user]);

  const updateOrderStatus = async (
    orderId: string, 
    newStatus: Order["status"], 
    remarks?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: newStatus,
                ...(newStatus === "confirmed" && { 
                  isApproved: true,
                  approvedAt: new Date().toISOString(),
                  approvedBy: user?.name || "Admin"
                }),
                ...(newStatus === "out_for_delivery" && { assignedAt: new Date().toISOString() }),
                ...(newStatus === "delivered" && { 
                  actualDelivery: new Date().toISOString(),
                  paymentStatus: "PAID" as const
                }),
                ...(newStatus === "cancelled" && {
                  paymentStatus: order.paymentStatus === "PAID" ? "PAID" : "FAILED" as const
                })
              }
            : order
        )
      );

      // Show success message
      const statusMessages = {
        pending: "Order marked as pending",
        confirmed: "Order confirmed successfully",
        preparing: "Order is being prepared",
        ready: "Order is ready for pickup",
        out_for_delivery: "Order is now out for delivery",
        delivered: "Order delivered successfully",
        cancelled: "Order cancelled"
      };

      toast.success(statusMessages[newStatus] || "Order status updated");
      return true;
      
    } catch (error) {
      toast.error("Failed to update order status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const assignDeliveryPersonnel = async (
    orderId: string, 
    deliveryPersonnelId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                deliveryPersonnelId,
                status: deliveryPersonnelId ? "out_for_delivery" : "ready",
                assignedAt: deliveryPersonnelId ? new Date().toISOString() : undefined
              }
            : order
        )
      );

      if (deliveryPersonnelId) {
        toast.success("Delivery personnel assigned successfully");
      } else {
        toast.success("Delivery personnel assignment removed");
      }
      
      return true;
      
    } catch (error) {
      toast.error("Failed to assign delivery personnel");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveOrder = async (orderId: string, remarks?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                isApproved: true,
                needsApproval: false,
                approvedAt: new Date().toISOString(),
                approvedBy: user?.name || "Admin",
                status: "confirmed"
              }
            : order
        )
      );

      toast.success("Order approved successfully");
      return true;
      
    } catch (error) {
      toast.error("Failed to approve order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectOrder = async (orderId: string, remarks: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: "cancelled",
                isApproved: false,
                paymentStatus: order.paymentStatus === "PAID" ? "PAID" : "FAILED" as const
              }
            : order
        )
      );

      toast.success("Order rejected successfully");
      return true;
      
    } catch (error) {
      toast.error("Failed to reject order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = (orderId: string): Order | undefined => {
    return filteredOrders.find(order => order.id === orderId) || 
           orders.find(order => order.id === orderId) || 
           getOrderById(orderId);
  };

  const getOrdersByStatus = (status: Order["status"]): Order[] => {
    return filteredOrders.filter(order => order.status === status);
  };

  const getPendingOrdersCount = (): number => {
    return filteredOrders.filter(order => order.status === "pending" || (order.needsApproval && !order.isApproved)).length;
  };

  const getReadyOrdersCount = (): number => {
    return filteredOrders.filter(order => order.status === "ready").length;
  };

  const getDeliveredOrdersCount = (): number => {
    return filteredOrders.filter(order => order.status === "delivered").length;
  };

  return {
    orders: filteredOrders,
    allOrders: orders, // For admin usage when needed
    isLoading,
    updateOrderStatus,
    assignDeliveryPersonnel,
    approveOrder,
    rejectOrder,
    getOrder,
    getOrdersByStatus,
    getPendingOrdersCount,
    getReadyOrdersCount,
    getDeliveredOrdersCount,
  };
}