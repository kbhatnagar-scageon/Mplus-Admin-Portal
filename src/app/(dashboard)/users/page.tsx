"use client";

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable } from '@/features/users/components/user-table';
import { useUsers } from '@/features/users/hooks/use-users';
import { User } from '@/types/common';

export default function UsersPage() {
  const router = useRouter();
  const { users, loading, error, deleteUser, bulkUpdateStatus } = useUsers();

  const handleEditUser = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleViewUser = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId);
    }
  };

  const handleBulkStatusChange = async (userIds: string[], status: User["status"]) => {
    const action = status === 'ACTIVE' ? 'activate' : 'deactivate';
    const count = userIds.length;
    if (window.confirm(`Are you sure you want to ${action} ${count} user${count > 1 ? 's' : ''}?`)) {
      await bulkUpdateStatus(userIds, status);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage store vendors and delivery personnel
          </p>
        </div>
        <Link href="/users/create">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Card className="border-border/5 shadow-sm">
        <CardHeader className="border-b border-border/10">
          <CardTitle className="text-xl font-semibold">All Users</CardTitle>
          <p className="text-sm text-muted-foreground">
            {users.length} total users
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <UserTable 
              data={users}
              loading={loading}
              onEdit={handleEditUser}
              onView={handleViewUser}
              onDelete={handleDeleteUser}
              onBulkStatusChange={handleBulkStatusChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}