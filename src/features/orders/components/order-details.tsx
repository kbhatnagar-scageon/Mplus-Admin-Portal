"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/features/orders/types";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./order-status-badge";
import { PrescriptionViewer } from "./prescription-viewer";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Package, User } from "lucide-react";

export const OrderDetailsDialog = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-start gap-4">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{`${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state.toLocaleString()} - ${order.deliveryAddress.pincode}`}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  Created: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                <span>Store: {order.storeName}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Status & Payment</h3>
            <div className="space-y-2">
              <div>
                <span className="mr-2">Status:</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <span className="mr-2">Payment:</span>
                <Badge
                  variant={
                    order.paymentStatus === "PAID"
                      ? "default"
                      : order.paymentStatus === "FAILED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Unit Price</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-right">{item.quantity}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(item.totalPrice)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatCurrency(item.totalPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="border p-2 text-right font-semibold">
                  Subtotal
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border p-2 text-right font-semibold">
                  GST (18%)
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(order.gstAmount)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="border p-2 text-right font-semibold">
                  Delivery Charges
                </td>
                <td className="border p-2 text-right">
                  {formatCurrency(order.deliveryCharges)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={3}
                  className="border p-2 text-right font-semibold text-lg"
                >
                  Total
                </td>
                <td className="border p-2 text-right font-semibold text-lg">
                  {formatCurrency(
                    order.totalAmount + order.gstAmount + order.deliveryCharges
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Prescription Viewer */}
        {order.prescriptionUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Prescription</h3>
            <PrescriptionViewer prescriptionUrl={order.prescriptionUrl} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
