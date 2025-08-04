import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Search,
  Download,
  Filter,
  SortAsc,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner, TableRowSkeleton } from "./loading-spinner";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  exportEnabled?: boolean;
  selectionEnabled?: boolean;
  onExport?: (data: TData[]) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  className?: string;
  variant?: "default" | "card";
  initialSorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey = "name",
  searchPlaceholder,
  exportEnabled = false,
  selectionEnabled = false,
  onExport,
  onRefresh,
  isLoading = false,
  error = null,
  emptyTitle = "No data available",
  emptyDescription = "There are no items to display at the moment.",
  emptyActionLabel,
  onEmptyAction,
  className,
  variant = "default",
  initialSorting = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectionEnabled,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleExport = () => {
    if (onExport) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const dataToExport =
        selectedRows.length > 0
          ? selectedRows.map((row) => row.original)
          : table.getFilteredRowModel().rows.map((row) => row.original);
      onExport(dataToExport);
    }
  };

  const clearFilters = () => {
    table.resetColumnFilters();
    setRowSelection({});
  };

  const hasActiveFilters = columnFilters.length > 0;
  const hasSelection = selectionEnabled && Object.keys(rowSelection).length > 0;

  // Error state
  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <EmptyState
          icon={<Search className="h-12 w-12 text-destructive/50" />}
          title="Failed to load data"
          description={error}
          actionLabel="Try Again"
          onAction={onRefresh}
          variant="card"
        />
      </div>
    );
  }

  const tableContent = (
    <div className="w-full space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative max-w-sm">
            <Search className="absolute translate-y-1/2 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                searchPlaceholder || `Search ${searchKey.toLowerCase()}...`
              }
              value={
                table.getColumn(searchKey)
                  ? ((table.getColumn(searchKey)?.getFilterValue() as string) ??
                    "")
                  : ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-8 h-8"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearFilters}
              className="px-2 lg:px-3"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>
          )}

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          {exportEnabled && (
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={isLoading || data.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
              {hasSelection && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(rowSelection).length}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-md border border-border/50",
          variant === "card" && "shadow-sm"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={columns.length} className="p-0">
                    <TableRowSkeleton columns={columns.length} />
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    row.getIsSelected() && "bg-muted/50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                    variant="minimal"
                    size="sm"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination and Stats */}
      {!isLoading && table.getRowModel().rows.length > 0 && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Showing {table.getRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} entries
            </div>

            {selectionEnabled && hasSelection && (
              <Badge variant="secondary" className="text-xs">
                {Object.keys(rowSelection).length} selected
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "card") {
    return <Card className={cn("p-6", className)}>{tableContent}</Card>;
  }

  return <div className={cn("w-full", className)}>{tableContent}</div>;
}
