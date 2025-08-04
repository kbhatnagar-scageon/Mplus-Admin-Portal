"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatIndianMobileNumber, formatDate } from "@/lib/utils";
import { User } from "@/types/common";
import { Mail, Phone, Calendar, MapPin, Truck, User as UserIcon } from "lucide-react";

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "INACTIVE":
        return "bg-red-100 text-red-700 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "STORE_VENDOR":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "DELIVERY_PERSONNEL":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p className="text-base">{user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">{formatIndianMobileNumber(user.phone)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 flex items-center justify-center">
              <Badge className={getRoleColor(user.role)}>
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Status & Timestamps */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-base">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Updated</p>
              <p className="text-base">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Information */}
      {(user.role === "STORE_VENDOR" || user.role === "DELIVERY_PERSONNEL") && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {user.role === "STORE_VENDOR" ? "Store Information" : "Delivery Information"}
            </h3>
            
            {user.role === "STORE_VENDOR" && user.storeId && (
              <Card className="border-border/5">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assigned Store ID</p>
                      <p className="text-base font-mono">{user.storeId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {user.role === "DELIVERY_PERSONNEL" && (
              <div className="space-y-4">
                {user.vehicleType && (
                  <Card className="border-border/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Vehicle Type</p>
                          <Badge variant="outline">{user.vehicleType}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {user.vehicleNumber && (
                  <Card className="border-border/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 flex items-center justify-center">
                          <span className="text-xs font-bold">#</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Vehicle Number</p>
                          <p className="text-base font-mono">{user.vehicleNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {user.coverageAreas && user.coverageAreas.length > 0 && (
                  <Card className="border-border/5">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Coverage Areas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user.coverageAreas.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}