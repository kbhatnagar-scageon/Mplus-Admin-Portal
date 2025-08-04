"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/lib/mock-data/users";
import { User, Truck, Clock, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DeliveryPersonnel {
  id: string;
  name: string;
  phone: string;
  vehicleType?: "BIKE" | "CYCLE" | "CAR";
  vehicleNumber?: string;
  coverageAreas?: string[];
  status: "ACTIVE" | "INACTIVE";
  currentOrders?: number; // Mock data for current workload
  rating?: number;
}

interface DeliveryAssignmentProps {
  orderId: string;
  currentDeliveryPersonnelId?: string;
  onAssignment?: (personnelId: string) => void;
}

export function DeliveryAssignment({ 
  orderId, 
  currentDeliveryPersonnelId, 
  onAssignment 
}: DeliveryAssignmentProps) {
  const [selectedPersonnel, setSelectedPersonnel] = useState<string>(currentDeliveryPersonnelId || "");
  const [isAssigning, setIsAssigning] = useState(false);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPersonnel[]>([]);

  // Transform mock users to delivery personnel with additional mock data
  useEffect(() => {
    const personnel = mockUsers
      .filter(user => user.role === "DELIVERY_PERSONNEL" && user.status === "ACTIVE")
      .map(user => ({
        ...user,
        currentOrders: Math.floor(Math.random() * 8), // Mock current workload
        rating: 3.5 + Math.random() * 1.5, // Mock rating between 3.5-5
      }));
    
    setDeliveryPersonnel(personnel);
  }, []);

  const handleAssignment = async () => {
    if (!selectedPersonnel) return;
    
    setIsAssigning(true);
    
    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make the actual API call
      console.log(`Assigning order ${orderId} to personnel ${selectedPersonnel}`);
      
      toast.success("Delivery personnel assigned successfully!");
      onAssignment?.(selectedPersonnel);
      
    } catch {
      toast.error("Failed to assign delivery personnel. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveAssignment = async () => {
    setIsAssigning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Removing assignment for order ${orderId}`);
      setSelectedPersonnel("");
      
      toast.success("Delivery personnel assignment removed!");
      onAssignment?.("");
      
    } catch {
      toast.error("Failed to remove assignment. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const currentPersonnel = deliveryPersonnel.find(p => p.id === currentDeliveryPersonnelId);
  const selectedPersonnelData = deliveryPersonnel.find(p => p.id === selectedPersonnel);

  const getVehicleIcon = (vehicleType?: string) => {
    switch (vehicleType) {
      case "CAR":
        return "🚗";
      case "BIKE":
        return "🏍️";
      case "CYCLE":
        return "🚲";
      default:
        return "🚚";
    }
  };

  const getWorkloadColor = (orders: number) => {
    if (orders <= 2) return "text-green-600";
    if (orders <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getWorkloadLabel = (orders: number) => {
    if (orders <= 2) return "Low";
    if (orders <= 5) return "Medium";
    return "High";
  };

  return (
    <div className="space-y-4">
      {/* Current Assignment Display */}
      {currentPersonnel && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Currently Assigned</p>
                  <p className="text-sm text-green-700">{currentPersonnel.name}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveAssignment}
                disabled={isAssigning}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Interface */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {currentPersonnel ? "Reassign to Different Personnel" : "Assign Delivery Personnel"}
          </span>
        </div>

        <Select value={selectedPersonnel} onValueChange={setSelectedPersonnel}>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery personnel..." />
          </SelectTrigger>
          <SelectContent>
            {deliveryPersonnel.map((personnel) => (
              <SelectItem key={personnel.id} value={personnel.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>{getVehicleIcon(personnel.vehicleType)}</span>
                    <div>
                      <div className="font-medium">{personnel.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {personnel.vehicleType} • {personnel.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getWorkloadColor(personnel.currentOrders || 0)}`}
                    >
                      {getWorkloadLabel(personnel.currentOrders || 0)} Load
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      ★ {personnel.rating?.toFixed(1)}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selected Personnel Details */}
        {selectedPersonnelData && selectedPersonnel !== currentDeliveryPersonnelId && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-900">Selected Personnel</h4>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {getVehicleIcon(selectedPersonnelData.vehicleType)} {selectedPersonnelData.vehicleType}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-900">{selectedPersonnelData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">★</span>
                    <span className="text-blue-900">{selectedPersonnelData.rating?.toFixed(1)} Rating</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span className="text-blue-900">
                      {selectedPersonnelData.currentOrders} current orders
                    </span>
                  </div>
                  {selectedPersonnelData.vehicleNumber && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-900">{selectedPersonnelData.vehicleNumber}</span>
                    </div>
                  )}
                </div>

                {selectedPersonnelData.coverageAreas && selectedPersonnelData.coverageAreas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <MapPin className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-900 font-medium">Coverage Areas</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPersonnelData.coverageAreas.map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-blue-300 text-blue-700">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment Button */}
        {selectedPersonnel && selectedPersonnel !== currentDeliveryPersonnelId && (
          <>
            <Separator />
            <Button
              onClick={handleAssignment}
              disabled={isAssigning}
              className="w-full"
            >
              {isAssigning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {currentPersonnel ? "Reassign Order" : "Assign Order"}
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {/* Statistics */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Delivery Personnel Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {deliveryPersonnel.filter(p => (p.currentOrders || 0) <= 2).length}
              </div>
              <div className="text-xs text-muted-foreground">Low Load</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">
                {deliveryPersonnel.filter(p => (p.currentOrders || 0) > 2 && (p.currentOrders || 0) <= 5).length}
              </div>
              <div className="text-xs text-muted-foreground">Medium Load</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {deliveryPersonnel.filter(p => (p.currentOrders || 0) > 5).length}
              </div>
              <div className="text-xs text-muted-foreground">High Load</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}