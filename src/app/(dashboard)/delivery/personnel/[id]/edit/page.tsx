"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeliveryPersonnelForm } from "@/features/delivery/components/delivery-personnel-form";
import { useDeliveryPersonnel } from "@/features/delivery/hooks/use-delivery-personnel";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function EditDeliveryPersonnelPage() {
  const params = useParams();
  const router = useRouter();
  const { getPersonnelById, updatePersonnel } = useDeliveryPersonnel();
  const [isLoading, setIsLoading] = useState(false);
  
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
              The delivery personnel you&apos;re trying to edit doesn&apos;t exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: Parameters<typeof updatePersonnel>[1]) => {
    setIsLoading(true);
    
    try {
      await updatePersonnel(personnelId, data);
      router.push(`/delivery/personnel/${personnelId}`);
    } catch (error) {
      console.error('Failed to update personnel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/delivery/personnel/${personnelId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/delivery/personnel/${personnelId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit {personnel.name}</h1>
          <p className="text-muted-foreground">
            Update delivery personnel information
          </p>
        </div>
      </div>

      {/* Form */}
      <DeliveryPersonnelForm
        personnel={personnel}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}