"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeliveryPersonnelTable } from "@/features/delivery/components/delivery-personnel-table";
import { useDeliveryPersonnel } from "@/features/delivery/hooks/use-delivery-personnel";
import { Plus, Users, UserCheck, Clock, UserX } from "lucide-react";

export default function DeliveryPage() {
  const router = useRouter();
  const {
    personnel,
    updatePersonnelStatus,
    togglePersonnelActive,
    deletePersonnel
  } = useDeliveryPersonnel();

  const stats = {
    total: personnel.length,
    available: personnel.filter(p => p.status === 'available' && p.isActive).length,
    busy: personnel.filter(p => p.status === 'busy').length,
    offline: personnel.filter(p => p.status === 'offline').length
  };

  const handleEdit = (id: string) => {
    router.push(`/delivery/personnel/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery personnel?')) {
      deletePersonnel(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Personnel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.busy}</p>
                <p className="text-sm text-muted-foreground">Busy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.offline}</p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-border/5 shadow-lg">
        <CardHeader className="border-b border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Delivery Personnel</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your delivery team and track their performance
              </p>
            </div>
            <Button onClick={() => router.push('/delivery/personnel/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Personnel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <DeliveryPersonnelTable
            personnel={personnel}
            onUpdateStatus={updatePersonnelStatus}
            onToggleActive={togglePersonnelActive}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}