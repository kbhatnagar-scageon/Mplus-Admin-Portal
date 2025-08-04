"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeliveryPersonnel } from "@/features/delivery/hooks/use-delivery-personnel";
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Clock, 
  Truck,
  Calendar,
  User,
  AlertTriangle
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  busy: "bg-blue-100 text-blue-700 border-blue-200", 
  offline: "bg-gray-100 text-gray-700 border-gray-200",
  on_break: "bg-yellow-100 text-yellow-700 border-yellow-200"
};

const VEHICLE_ICONS: Record<string, string> = {
  bicycle: "🚲",
  motorcycle: "🏍️", 
  van: "🚐",
  car: "🚗"
};

export default function DeliveryPersonnelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getPersonnelById } = useDeliveryPersonnel();
  
  const personnelId = params.id as string;
  const personnel = getPersonnelById(personnelId);

  if (!personnel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/delivery')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Personnel Not Found</h3>
            <p className="text-muted-foreground">
              The delivery personnel you&apos;re looking for doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const successRate = personnel.deliveryStats.totalDeliveries > 0 
    ? Math.round((personnel.deliveryStats.successfulDeliveries / personnel.deliveryStats.totalDeliveries) * 100)
    : 0;

  const onTimeRate = personnel.deliveryStats.successfulDeliveries > 0
    ? Math.round((personnel.deliveryStats.onTimeDeliveries / personnel.deliveryStats.successfulDeliveries) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/delivery')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{personnel.name}</h1>
            <p className="text-muted-foreground">
              Delivery Personnel Details
            </p>
          </div>
        </div>
        
        <Button onClick={() => router.push(`/delivery/personnel/${personnel.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Personnel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2 border-border/5 shadow-lg">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={personnel.avatar} alt={personnel.name} />
                <AvatarFallback className="text-lg">
                  {personnel.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{personnel.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    className={STATUS_COLORS[personnel.status]}
                    variant="outline"
                  >
                    {personnel.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {!personnel.isActive && (
                    <Badge variant="destructive">INACTIVE</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{personnel.email}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{personnel.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(personnel.joinedAt).toLocaleDateString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{personnel.workingHours.start} - {personnel.workingHours.end}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/5 shadow-lg">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {personnel.ratings.average.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Rating ({personnel.ratings.total} reviews)
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Deliveries</span>
                <span className="font-medium">{personnel.deliveryStats.totalDeliveries}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium text-green-600">{successRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">On-Time Rate</span>
                <span className="font-medium text-blue-600">{onTimeRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm">Avg. Delivery Time</span>
                <span className="font-medium">{personnel.deliveryStats.avgDeliveryTime} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <Card className="border-border/5 shadow-lg">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{VEHICLE_ICONS[personnel.vehicleType]}</div>
              <div>
                <h4 className="font-semibold capitalize">{personnel.vehicleType}</h4>
                <p className="text-sm text-muted-foreground font-mono">
                  {personnel.vehicleNumber}
                </p>
              </div>
            </div>
            
            {personnel.licenseNumber && (
              <div className="mt-4">
                <span className="text-sm text-muted-foreground">License Number:</span>
                <p className="font-mono">{personnel.licenseNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coverage Areas */}
        <Card className="border-border/5 shadow-lg">
          <CardHeader className="border-b border-border/10">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Coverage Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {personnel.coverageAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-sm">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card className="border-border/5 shadow-lg">
        <CardHeader className="border-b border-border/10">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <p className="font-medium">{personnel.emergencyContact.name}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Phone:</span>
              <p className="font-medium">{personnel.emergencyContact.phone}</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Relation:</span>
              <p className="font-medium">{personnel.emergencyContact.relation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}