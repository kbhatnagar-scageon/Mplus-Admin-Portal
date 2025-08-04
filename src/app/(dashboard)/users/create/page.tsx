"use client";

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/features/users/components/user-form'
import { useUsers } from '@/features/users/hooks/use-users'
import { User } from '@/types/common'

export default function CreateUserPage() {
  const router = useRouter()
  const { createUser } = useUsers()

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createUser(userData)
      router.push('/users')
    } catch (error) {
      // Error handling is done in the hook itself via toast
      console.error('Failed to create user:', error)
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center space-x-4">
        <Link href="/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm 
            onSubmit={handleCreateUser}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  )
}