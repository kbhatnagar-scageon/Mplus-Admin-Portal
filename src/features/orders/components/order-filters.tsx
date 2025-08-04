"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Order } from "@/features/orders/types";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const OrderFilters = ({
  onFilterChange
}: {
  onFilterChange: (filters: {
    status?: Order['status'];
    dateFrom?: Date;
    dateTo?: Date;
  }) => void;
}) => {
  const [status, setStatus] = useState<Order['status'] | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Auto-apply filters whenever any filter changes
  useEffect(() => {
    onFilterChange({ status, dateFrom, dateTo });
  }, [status, dateFrom, dateTo, onFilterChange]);

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setStatus(undefined);
    } else {
      setStatus(value as Order['status']);
    }
  };

  const handleResetFilters = () => {
    setStatus(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = status || dateFrom || dateTo;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Filter */}
      <Select 
        value={status || "all"} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Order Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="ASSIGNED">Assigned</SelectItem>
          <SelectItem value="PICKED_UP">Picked Up</SelectItem>
          <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Date From Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !dateFrom && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? format(dateFrom, "dd MMM yyyy") : <span>From Date</span>}
            {dateFrom && (
              <X 
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDateFrom(undefined);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFrom}
            onSelect={setDateFrom}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Date To Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !dateTo && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? format(dateTo, "dd MMM yyyy") : <span>To Date</span>}
            {dateTo && (
              <X 
                className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDateTo(undefined);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateTo}
            onSelect={setDateTo}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleResetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Clear All
        </Button>
      )}
    </div>
  );
};