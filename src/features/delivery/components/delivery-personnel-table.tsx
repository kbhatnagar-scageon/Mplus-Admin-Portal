"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { DeliveryPersonnel, DeliveryStatus, VehicleType } from "@/features/delivery/types";
import { 
  Eye, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Phone, 
  MapPin,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Pause
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DeliveryPersonnelTableProps {
  personnel: DeliveryPersonnel[];
  onUpdateStatus?: (id: string, status: DeliveryStatus) => void;
  onToggleActive?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const STATUS_COLORS: Record<DeliveryStatus, { variant: string; className: string; icon: React.ElementType }> = {
  available: { 
    variant: "default", 
    className: "bg-green-100 text-green-700 border-green-200", 
    icon: CheckCircle 
  },
  busy: { 
    variant: "default", 
    className: "bg-blue-100 text-blue-700 border-blue-200", 
    icon: Clock 
  },
  offline: { 
    variant: "secondary", 
    className: "bg-gray-100 text-gray-700 border-gray-200", 
    icon: XCircle 
  },
  on_break: { 
    variant: "default", 
    className: "bg-yellow-100 text-yellow-700 border-yellow-200", 
    icon: Pause 
  },
};

const VEHICLE_ICONS: Record<VehicleType, string> = {
  bicycle: "🚲",
  motorcycle: "🏍️",
  van: "🚐",
  car: "🚗"
};

export function DeliveryPersonnelTable({ 
  personnel, 
  onUpdateStatus,
  onToggleActive,
  onEdit,
  onDelete 
}: DeliveryPersonnelTableProps) {
  const router = useRouter();

  const columns: ColumnDef<DeliveryPersonnel>[] = [
    {
      accessorKey: "name",
      header: "Personnel",
      cell: ({ row }) => {
        const person = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback className="text-xs">
                {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{person.name}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {person.phone}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicleType",
      header: "Vehicle",
      cell: ({ row }) => {
        const person = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{VEHICLE_ICONS[person.vehicleType]}</span>
            <div>
              <div className="font-medium capitalize">{person.vehicleType}</div>
              <div className="text-sm text-muted-foreground font-mono">
                {person.vehicleNumber}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const person = row.original;
        const statusConfig = STATUS_COLORS[person.status];
        const Icon = statusConfig.icon;
        
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant={statusConfig.variant as "default" | "secondary" | "destructive" | "outline"}
              className={statusConfig.className}
            >
              <Icon className="h-3 w-3 mr-1" />
              {person.status.replace('_', ' ').toUpperCase()}
            </Badge>
            {!person.isActive && (
              <Badge variant="destructive" className="text-xs">
                INACTIVE
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "coverageAreas",
      header: "Coverage Areas",
      cell: ({ row }) => {
        const areas = row.original.coverageAreas;
        return (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <div className="text-sm">
              {areas.slice(0, 2).join(", ")}
              {areas.length > 2 && (
                <span className="text-muted-foreground">
                  {" "}+{areas.length - 2} more
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "ratings",
      header: "Rating",
      cell: ({ row }) => {
        const { average, total } = row.original.ratings;
        return (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{average.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({total})</span>
          </div>
        );
      },
    },
    {
      accessorKey: "deliveryStats",
      header: "Performance",
      cell: ({ row }) => {
        const stats = row.original.deliveryStats;
        const successRate = Math.round((stats.successfulDeliveries / stats.totalDeliveries) * 100);
        
        return (
          <div className="text-sm">
            <div className="font-medium">{stats.totalDeliveries} deliveries</div>
            <div className="text-muted-foreground">
              {successRate}% success rate
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "workingHours",
      header: "Hours",
      cell: ({ row }) => {
        const { start, end } = row.original.workingHours;
        return (
          <div className="text-sm font-mono">
            {start} - {end}
          </div>
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => {
        const lastActive = row.original.lastActive;
        if (!lastActive) return <span className="text-muted-foreground">Never</span>;
        
        return (
          <div className="text-sm">
            {new Date(lastActive).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const person = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => router.push(`/delivery/personnel/${person.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onEdit?.(person.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Personnel
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {person.status !== 'available' && person.isActive && (
                <DropdownMenuItem 
                  onClick={() => onUpdateStatus?.(person.id, 'available')}
                  className="text-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Available
                </DropdownMenuItem>
              )}
              
              {person.status !== 'busy' && person.isActive && (
                <DropdownMenuItem 
                  onClick={() => onUpdateStatus?.(person.id, 'busy')}
                  className="text-blue-600"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Mark Busy
                </DropdownMenuItem>
              )}
              
              {person.status !== 'on_break' && person.isActive && (
                <DropdownMenuItem 
                  onClick={() => onUpdateStatus?.(person.id, 'on_break')}
                  className="text-yellow-600"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  On Break
                </DropdownMenuItem>
              )}
              
              {person.status !== 'offline' && (
                <DropdownMenuItem 
                  onClick={() => onUpdateStatus?.(person.id, 'offline')}
                  className="text-gray-600"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark Offline
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onToggleActive?.(person.id)}
                className={person.isActive ? "text-red-600" : "text-green-600"}
              >
                {person.isActive ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDelete?.(person.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Personnel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <DataTable 
        columns={columns} 
        data={personnel} 
        searchKey="name"
        className="rounded-lg border border-border/10"
      />
    </div>
  );
}