"use client";

import { useRouter } from "next/navigation";
import { DeliveryPersonnelForm } from "@/features/delivery/components/delivery-personnel-form";
import { useDeliveryPersonnel } from "@/features/delivery/hooks/use-delivery-personnel";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateDeliveryPersonnelPage() {
  const router = useRouter();
  const { createPersonnel } = useDeliveryPersonnel();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Add default stats for new personnel
      const personnelData = {
        ...data,
        ratings: {
          average: 0,
          total: 0
        },
        deliveryStats: {
          totalDeliveries: 0,
          successfulDeliveries: 0,
          onTimeDeliveries: 0,
          avgDeliveryTime: 0
        },
        joinedAt: new Date().toISOString()
      };

      await createPersonnel(personnelData);
      router.push('/delivery');
    } catch (error) {
      console.error('Failed to create personnel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/delivery');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold">Add New Delivery Personnel</h1>
          <p className="text-muted-foreground">
            Create a new delivery personnel profile
          </p>
        </div>
      </div>

      {/* Form */}
      <DeliveryPersonnelForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}