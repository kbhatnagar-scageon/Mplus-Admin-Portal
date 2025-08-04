"use client";

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from '@/features/users/components/user-form';
import { useUsers } from '@/features/users/hooks/use-users';
import { User } from '@/features/users/types';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getUserById, updateUser } = useUsers();
  const user = getUserById(id);

  if (!user) {
    notFound();
  }

  const handleSubmit = async (data: Partial<User>) => {
    try {
      await updateUser(id, data);
      toast.success('User updated successfully', {
        description: `${data.name} has been updated.`,
      });
      router.push(`/users/${id}`);
    } catch (error) {
      toast.error('Failed to update user', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/users/${id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Update user information and settings</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="border-border/5 shadow-lg">
        <CardHeader className="border-b border-border/10">
          <CardTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <UserForm 
            initialData={user}
            onSubmit={handleSubmit}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}