"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Package, User, Phone, Calendar, Truck, CheckCircle, XCircle, AlertCircle, MoreHorizontal, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PrescriptionViewer } from "@/components/shared/prescription-viewer";
import { DeliveryAssignment } from "@/components/shared/delivery-assignment";
import { formatCurrency } from "@/lib/utils";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getOrder, approveOrder, rejectOrder, assignDeliveryPersonnel, updateOrderStatus, isLoading } = useOrders();
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    type: 'approve' | 'reject' | null;
  }>({ open: false, type: null });
  const [remarks, setRemarks] = useState("");

  
  const order = getOrder(id as string);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Order not found</h3>
          <p className="text-muted-foreground mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const handleApproval = (type: 'approve' | 'reject') => {
    setApprovalDialog({ open: true, type });
  };

  const confirmApproval = async () => {
    if (approvalDialog.type === 'approve') {
      await approveOrder(id as string);
    } else if (approvalDialog.type === 'reject') {
      await rejectOrder(id as string);
    }
    
    setApprovalDialog({ open: false, type: null });
    setRemarks("");
  };

  const handleDeliveryAssignment = async (personnelId: string) => {
    await assignDeliveryPersonnel(id as string, personnelId);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    await updateOrderStatus(id as string, newStatus as 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled');
  };

  const canApprove = order.needsApproval && !order.isApproved;
  const canAssignDelivery = order.isApproved && !['cancelled', 'delivered'].includes(order.status);
  const canUpdateStatus = user?.role === 'SUPERADMIN' || 
    (user?.role === 'STORE_VENDOR' && order.storeId === user.storeId) ||
    (user?.role === 'DELIVERY_PERSONNEL' && order.deliveryPersonnelId === user.id);

  const availableStatuses = () => {
    const current = order.status;
    const statuses = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['out_for_delivery', 'cancelled'],
      'out_for_delivery': ['delivered', 'cancelled'],
      'delivered': [],
      'cancelled': []
    };
    return statuses[current] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/orders")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <div className="flex gap-2">
          {canApprove && (
            <>
              <Button
                variant="destructive"
                onClick={() => handleApproval('reject')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Order
              </Button>
              <Button onClick={() => handleApproval('approve')}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Order
              </Button>
            </>
          )}
          
          {/* Order Actions Dropdown */}
          {canUpdateStatus && availableStatuses().length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                  <MoreHorizontal className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {availableStatuses().map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    className={status === 'cancelled' ? 'text-red-600' : ''}
                  >
                    {status === 'confirmed' && '✓ Confirm Order'}
                    {status === 'preparing' && '🔄 Start Preparing'}
                    {status === 'ready' && '✅ Mark Ready'}
                    {status === 'out_for_delivery' && '🚚 Out for Delivery'}
                    {status === 'delivered' && '📦 Mark Delivered'}
                    {status === 'cancelled' && '❌ Cancel Order'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Customer:</span>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="font-medium">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Store:</span>
                    <span className="font-medium">{order.storeName}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Est. Delivery:</span>
                      <span className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <span className="text-sm text-muted-foreground">Delivery Address:</span>
                    <p className="font-medium">
                      {order.deliveryAddress.street}<br />
                      {order.deliveryAddress.city}, {String(order.deliveryAddress.state)} - {order.deliveryAddress.pincode}
                      {order.deliveryAddress.landmark && (
                        <><br /><span className="text-sm text-muted-foreground">Near: {order.deliveryAddress.landmark}</span></>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Qty: {item.quantity}</span>
                        <span>Unit Price: {formatCurrency(item.unitPrice)}</span>
                        {item.prescriptionRequired && (
                          <Badge variant="secondary" className="text-xs">
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Order Total */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(order.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Charges</span>
                    <span>{formatCurrency(order.deliveryCharges)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        order.totalAmount + order.gstAmount + order.deliveryCharges
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Viewer */}
          {(order.prescriptionUrls || order.prescriptionUrl) && (
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <PrescriptionViewer 
                  prescriptions={
                    order.prescriptionUrls || 
                    (order.prescriptionUrl ? [order.prescriptionUrl] : [])
                  } 
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Order Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <OrderStatusBadge status={order.status} />
                  {order.needsApproval && !order.isApproved && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      Needs Approval
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Payment Status</span>
                <div className="mt-1">
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
            </CardContent>
          </Card>

          {/* Delivery Assignment */}
          {canAssignDelivery && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryAssignment 
                  orderId={order.id}
                  currentDeliveryPersonnelId={order.deliveryPersonnelId}
                  onAssignment={handleDeliveryAssignment}
                />
              </CardContent>
            </Card>
          )}

          {/* Delivery Information */}
          {order.deliveryPersonnelId && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Assigned Personnel</span>
                  <p className="font-medium">Delivery Person #{order.deliveryPersonnelId.slice(-6)}</p>
                </div>
                {order.assignedAt && (
                  <div>
                    <span className="text-sm text-muted-foreground">Assigned At</span>
                    <p className="font-medium">
                      {new Date(order.assignedAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                {order.actualDelivery && (
                  <div>
                    <span className="text-sm text-muted-foreground">Delivered At</span>
                    <p className="font-medium">
                      {new Date(order.actualDelivery).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.type === 'approve' ? 'Approve Order' : 'Reject Order'}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.type === 'approve' 
                ? 'Are you sure you want to approve this order? This will move it to the next stage.'
                : 'Are you sure you want to reject this order? Please provide a reason for rejection.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {approvalDialog.type === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason *'}
              </label>
              <Textarea
                placeholder={approvalDialog.type === 'approve' 
                  ? 'Add any notes about this approval...'
                  : 'Please specify the reason for rejection...'
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog({ open: false, type: null })}>
              Cancel
            </Button>
            <Button
              variant={approvalDialog.type === 'approve' ? 'default' : 'destructive'}
              onClick={confirmApproval}
              disabled={(approvalDialog.type === 'reject' && !remarks.trim()) || isLoading}
            >
              {isLoading ? 'Processing...' : (approvalDialog.type === 'approve' ? 'Approve Order' : 'Reject Order')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}