"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTable } from "@/features/orders/components/order-table";
import { OrderFilters } from "@/features/orders/components/order-filters";
import { Order } from "@/features/orders/types";
import { useOrders } from "@/hooks/use-orders";

export default function OrdersPage() {
  const {
    orders,
    updateOrderStatus,
    assignDeliveryPersonnel,
    rejectOrder,
    approveOrder,
  } = useOrders();

  const [filters, setFilters] = useState<{
    status?: Order["status"];
    dateFrom?: Date;
    dateTo?: Date;
  }>({});

  const handleFilterChange = useCallback((newFilters: {
    status?: Order["status"];
    dateFrom?: Date;
    dateTo?: Date;
  }) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="border-border/5 shadow-lg">
        <CardHeader className="border-b border-border/10">
          <CardTitle className="text-xl font-semibold">
            Order Management ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="mb-6">
            <OrderFilters onFilterChange={handleFilterChange} />
          </div>
          <OrderTable
            orders={orders}
            filters={filters}
            onUpdateStatus={updateOrderStatus}
            onAssignDeliveryPersonnel={assignDeliveryPersonnel}
            onCancelOrder={(orderId) => rejectOrder(orderId)}
            onApproveOrder={approveOrder}
          />
        </CardContent>
      </Card>
    </div>
  );
}
