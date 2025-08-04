"use client";

import { ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { use } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserDetails } from '@/features/users/components/user-details'
import { useUsers } from '@/features/users/hooks/use-users'

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getUserById } = useUsers()
  const user = getUserById(id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/users">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Link href={`/users/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserDetails user={user} />
        </CardContent>
      </Card>
    </div>
  )
}