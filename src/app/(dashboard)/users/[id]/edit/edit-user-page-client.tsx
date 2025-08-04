'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/features/users/components/user-form'
import { useUsers } from '@/features/users/hooks/use-users'
import { User } from '@/features/users/types'

export default function EditUserPageClient({ 
  initialUser, 
  userId 
}: { 
  initialUser: User, 
  userId: string 
}) {
  const router = useRouter()
  const { updateUser } = useUsers()

  const handleUpdateUser = async (userData: Partial<User>) => {
    const updatedUser = await updateUser(userId, userData)
    if (updatedUser) {
      router.push('/users')
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
        <h1 className="text-2xl font-bold">Edit User</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm 
            initialData={initialUser}
            onSubmit={handleUpdateUser}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  )
}