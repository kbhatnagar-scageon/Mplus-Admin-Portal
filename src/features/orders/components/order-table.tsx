"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { Order } from "@/features/orders/types";
import { mockOrders } from "@/lib/mock-data/orders";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "./order-status-badge";
import { Eye, MoreHorizontal, User, Check, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDeliveryPersonnel } from "@/features/delivery/hooks/use-delivery-personnel";
import { DeliveryPersonnel } from "@/features/delivery/types";

interface OrderTableProps {
  orders?: Order[];
  onUpdateStatus?: (orderId: string, status: Order["status"]) => void;
  onAssignDeliveryPersonnel?: (orderId: string, personnelId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onApproveOrder?: (orderId: string) => void;
  filters?: {
    status?: Order['status'];
    dateFrom?: Date;
    dateTo?: Date;
  };
}

function DeliveryPersonnelSelector({
  orderId,
  currentPersonnelId,
  isDisabled,
  onAssign,
  availablePersonnel,
  getPersonnelById,
}: {
  orderId: string;
  currentPersonnelId?: string;
  isDisabled: boolean;
  onAssign?: (orderId: string, personnelId: string) => void;
  availablePersonnel: DeliveryPersonnel[];
  getPersonnelById: (id: string) => DeliveryPersonnel | undefined;
}) {
  const [open, setOpen] = useState(false);

  const currentPersonnel = currentPersonnelId
    ? getPersonnelById(currentPersonnelId)
    : null;

  const handleSelect = (personnelId: string) => {
    onAssign?.(orderId, personnelId);
    setOpen(false);
  };

  if (isDisabled) {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground">
        Needs Approval
      </Badge>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-left font-normal"
        >
          {currentPersonnel ? (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span className="truncate">{currentPersonnel.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-3 w-3" />
              <span>Assign Personnel</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search delivery personnel..." />
          <CommandEmpty>No personnel found.</CommandEmpty>
          <CommandGroup>
            {availablePersonnel.map((personnel) => (
              <CommandItem
                key={personnel.id}
                onSelect={() => handleSelect(personnel.id)}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2 flex-1">
                  <User className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">{personnel.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {personnel.vehicleType} • {personnel.status}
                    </div>
                  </div>
                </div>
                {currentPersonnelId === personnel.id && (
                  <Check className="h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function OrderTable({
  orders = mockOrders,
  onAssignDeliveryPersonnel,
  onCancelOrder,
  onApproveOrder,
  filters,
}: OrderTableProps) {
  const router = useRouter();
  const { getAvailablePersonnel, getPersonnelById } = useDeliveryPersonnel();

  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    if (!filters) return orders;

    return orders.filter(order => {
      const { status, dateFrom, dateTo } = filters;
      const orderDate = new Date(order.createdAt);

      // Status filtering: show all if no status filter or status matches
      const statusMatch = !status || order.status === status;
      
      // Date filtering: inclusive range checking
      const dateFromMatch = !dateFrom || orderDate >= new Date(dateFrom.setHours(0, 0, 0, 0));
      const dateToMatch = !dateTo || orderDate <= new Date(dateTo.setHours(23, 59, 59, 999));

      return statusMatch && dateFromMatch && dateToMatch;
    });
  }, [orders, filters]);

  // Default sorting by createdAt (most recent first)
  const defaultSorting: SortingState = [
    {
      id: "createdAt",
      desc: true,
    },
  ];

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <button
          onClick={() => router.push(`/orders/${row.original.id}`)}
          className="text-blue-600 hover:underline font-mono"
        >
          #{row.original.id.slice(0, 8)}
        </button>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Total Amount
            {column.getIsSorted() === "asc" ? (
              <span className="ml-2">↑</span>
            ) : column.getIsSorted() === "desc" ? (
              <span className="ml-2">↓</span>
            ) : (
              <span className="ml-2 opacity-50">↕</span>
            )}
          </Button>
        )
      },
      cell: ({ getValue }) => formatCurrency(getValue() as number),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            {order.needsApproval && !order.isApproved && (
              <Badge
                variant="outline"
                className="text-xs bg-orange-50 text-orange-700"
              >
                Needs Approval
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ getValue }) => (
        <Badge
          variant={
            getValue() === "PAID"
              ? "default"
              : getValue() === "FAILED"
                ? "destructive"
                : "secondary"
          }
        >
          {getValue() as string}
        </Badge>
      ),
    },
    {
      id: "deliveryPersonnel",
      header: "Delivery Personnel",
      cell: ({ row }) => {
        const order = row.original;
        const canAssign =
          order.isApproved &&
          order.status !== "cancelled" &&
          order.status !== "delivered";

        return (
          <div className="w-40">
            <DeliveryPersonnelSelector
              orderId={order.id}
              currentPersonnelId={order.deliveryPersonnelId}
              isDisabled={!canAssign}
              onAssign={onAssignDeliveryPersonnel}
              availablePersonnel={getAvailablePersonnel()}
              getPersonnelById={getPersonnelById}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 hover:bg-transparent"
          >
            Created At
            {column.getIsSorted() === "asc" ? (
              <span className="ml-2">↑</span>
            ) : column.getIsSorted() === "desc" ? (
              <span className="ml-2">↓</span>
            ) : (
              <span className="ml-2 opacity-50">↕</span>
            )}
          </Button>
        )
      },
      cell: ({ getValue }) =>
        new Date(getValue() as string).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.createdAt);
        const dateB = new Date(rowB.original.createdAt);
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/orders/${row.original.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {row.original.needsApproval &&
              !row.original.isApproved &&
              onApproveOrder && (
                <DropdownMenuItem
                  onClick={() => onApproveOrder(row.original.id)}
                >
                  ✓ Approve Order
                </DropdownMenuItem>
              )}
            {onCancelOrder && row.original.status !== "cancelled" && (
              <DropdownMenuItem
                onClick={() => onCancelOrder(row.original.id)}
                className="text-red-600"
              >
                ✗ Cancel Order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey="customerName"
        initialSorting={defaultSorting}
        className="rounded-lg border border-border/10"
      />
    </div>
  );
}
