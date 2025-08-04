"use client";

import { useState } from "react";
import { 
  ColumnDef, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MoreHorizontal, Download, Edit, Trash2, Eye } from "lucide-react";
import { User } from "@/types/common";
import { formatIndianMobileNumber } from "@/lib/utils";

interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onView?: (user: User) => void;
  onBulkStatusChange?: (userIds: string[], status: User["status"]) => void;
  loading?: boolean;
}

// CSV Export utility
function exportToCSV(data: User[], filename: string = 'users.csv') {
  const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'];
  const csvContent = [
    headers.join(','),
    ...data.map(user => [
      `"${user.name}"`,
      `"${user.email}"`,
      `"${user.phone}"`,
      `"${user.role}"`,
      `"${user.status}"`,
      `"${new Date(user.createdAt).toLocaleDateString('en-IN')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function getStatusBadgeVariant(status: User["status"]) {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'INACTIVE':
      return 'secondary';
    case 'PENDING':
      return 'outline';
    default:
      return 'secondary';
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-8 w-[40px]" />
        </div>
      ))}
    </div>
  );
}

export function UserTable({ data, onEdit, onDelete, onView, onBulkStatusChange, loading = false }: UserTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [roleFilter, setRoleFilter] = useState<User["role"] | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<User["status"] | "ALL">("ALL");

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-muted-foreground lowercase">
          {row.getValue("email")}
        </div>
      ),
      meta: {
        className: "hidden md:table-cell",
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {formatIndianMobileNumber(row.getValue("phone"))}
        </div>
      ),
      meta: {
        className: "hidden lg:table-cell",
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as User["role"];
        return (
          <Badge 
            variant="outline" 
            className={`
              ${role === 'STORE_VENDOR' 
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                : 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100'
              }
            `}
          >
            {role === 'STORE_VENDOR' ? 'Store Vendor' : role === 'DELIVERY_PERSONNEL' ? 'Delivery Personnel' : 'Super Admin'}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as User["status"];
        return (
          <Badge 
            variant={getStatusBadgeVariant(status)}
            className={`
              ${status === 'ACTIVE' 
                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' 
                : status === 'INACTIVE'
                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }
            `}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-muted"
                aria-label={`Actions for ${user.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {onView && (
                <DropdownMenuItem onClick={() => onView(user)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(user.id)} 
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredData = data.filter(user => 
    (roleFilter === "ALL" || user.role === roleFilter) &&
    (statusFilter === "ALL" || user.status === statusFilter)
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const selectedUsers = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  const hasSelectedUsers = selectedUsers.length > 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="rounded-md border border-border/5">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm border-border/20 focus:border-border/40"
          />
          <Select 
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as User["role"] | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-[180px] border-border/20">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
              <SelectItem value="STORE_VENDOR">Store Vendor</SelectItem>
              <SelectItem value="DELIVERY_PERSONNEL">Delivery Personnel</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as User["status"] | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-[180px] border-border/20">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
          {hasSelectedUsers && onBulkStatusChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    Bulk Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem 
                    onClick={() => {
                      onBulkStatusChange(selectedUsers.map(u => u.id), "ACTIVE");
                      setRowSelection({});
                    }}
                    className="cursor-pointer"
                  >
                    <Badge className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                    Activate Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      onBulkStatusChange(selectedUsers.map(u => u.id), "INACTIVE");
                      setRowSelection({});
                    }}
                    className="cursor-pointer"
                  >
                    <Badge className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                    Deactivate Users
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => exportToCSV(selectedUsers, 'selected-users.csv')}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(filteredData)}
            className="h-8 w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            <span className="sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border border-border/5 shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/10 hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const className = header.column.columnDef.meta?.className || "";
                  return (
                    <TableHead key={header.id} className={`font-medium text-muted-foreground ${className}`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-border/5 hover:bg-muted/30 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => {
                    const className = cell.column.columnDef.meta?.className || "";
                    return (
                      <TableCell key={cell.id} className={`py-4 ${className}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-lg">No users found</div>
                    <div className="text-sm">Try adjusting your search or filter criteria</div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}