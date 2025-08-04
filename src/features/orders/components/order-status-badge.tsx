import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/features/orders/types";

const STATUS_COLORS: Record<OrderStatus, { variant: string; className: string }> = {
  pending: { variant: "secondary", className: "bg-gray-100 text-gray-700" },
  confirmed: { variant: "default", className: "bg-blue-100 text-blue-700" },
  preparing: { variant: "default", className: "bg-yellow-100 text-yellow-700" },
  ready: { variant: "default", className: "bg-green-100 text-green-700" },
  out_for_delivery: { variant: "default", className: "bg-purple-100 text-purple-700" },
  delivered: { variant: "default", className: "bg-green-100 text-green-800" },
  cancelled: { variant: "destructive", className: "" },
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig = STATUS_COLORS[status];
  
  return (
    <Badge
      variant={statusConfig.variant as "secondary" | "destructive" | "outline" | "default"}
      className={statusConfig.className}
    >
      {status.split("_").join(" ").toUpperCase()}
    </Badge>
  );
};
