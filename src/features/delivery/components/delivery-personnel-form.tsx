"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DeliveryPersonnel, VehicleType, DeliveryStatus } from "@/features/delivery/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";

// Indian areas for coverage selection
const COVERAGE_AREAS = [
  "Koramangala", "Indiranagar", "Whitefield", "Electronic City", "Marathahalli",
  "HSR Layout", "BTM Layout", "Jayanagar", "Rajajinagar", "Malleshwaram",
  "Bandra", "Andheri", "Powai", "Thane", "Borivali",
  "Connaught Place", "Lajpat Nagar", "Karol Bagh", "Dwarka", "Gurgaon",
  "Sector 1", "Sector 18", "Sector 62", "Greater Noida", "Faridabad"
];

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "bicycle", label: "Bicycle 🚲" },
  { value: "motorcycle", label: "Motorcycle 🏍️" },
  { value: "van", label: "Van 🚐" },
  { value: "car", label: "Car 🚗" }
];

const statusOptions: { value: DeliveryStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "offline", label: "Offline" },
  { value: "on_break", label: "On Break" }
];

const personnelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+91[0-9]{10}$/, "Phone must be in +91XXXXXXXXXX format"),
  vehicleType: z.enum(["bicycle", "motorcycle", "van", "car"]),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  licenseNumber: z.string().optional(),
  status: z.enum(["available", "busy", "offline", "on_break"]),
  isActive: z.boolean().default(true),
  coverageAreas: z.array(z.string()).min(1, "At least one coverage area is required"),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
  }),
  emergencyContact: z.object({
    name: z.string().min(2, "Emergency contact name is required"),
    phone: z.string().regex(/^\+91[0-9]{10}$/, "Phone must be in +91XXXXXXXXXX format"),
    relation: z.string().min(1, "Relation is required")
  })
});

type PersonnelFormData = z.infer<typeof personnelSchema>;

interface DeliveryPersonnelFormProps {
  personnel?: DeliveryPersonnel;
  onSubmit: (data: PersonnelFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeliveryPersonnelForm({
  personnel,
  onSubmit,
  onCancel,
  isLoading = false
}: DeliveryPersonnelFormProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    personnel?.coverageAreas || []
  );

  const form = useForm<PersonnelFormData>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      name: personnel?.name || "",
      email: personnel?.email || "",
      phone: personnel?.phone || "+91",
      vehicleType: personnel?.vehicleType || "motorcycle",
      vehicleNumber: personnel?.vehicleNumber || "",
      licenseNumber: personnel?.licenseNumber || "",
      status: personnel?.status || "available",
      isActive: personnel?.isActive !== undefined ? personnel.isActive : true,
      coverageAreas: personnel?.coverageAreas || [],
      workingHours: {
        start: personnel?.workingHours.start || "09:00",
        end: personnel?.workingHours.end || "18:00"
      },
      emergencyContact: {
        name: personnel?.emergencyContact.name || "",
        phone: personnel?.emergencyContact.phone || "+91",
        relation: personnel?.emergencyContact.relation || ""
      }
    }
  });

  const watchVehicleType = form.watch("vehicleType");

  const handleAreaToggle = (area: string) => {
    const newAreas = selectedAreas.includes(area)
      ? selectedAreas.filter(a => a !== area)
      : [...selectedAreas, area];
    
    setSelectedAreas(newAreas);
    form.setValue("coverageAreas", newAreas);
  };

  const removeArea = (area: string) => {
    const newAreas = selectedAreas.filter(a => a !== area);
    setSelectedAreas(newAreas);
    form.setValue("coverageAreas", newAreas);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card className="border-border/5 shadow-lg">
            <CardHeader className="border-b border-border/10">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Personnel</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Personnel can receive delivery assignments when active
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card className="border-border/5 shadow-lg">
            <CardHeader className="border-b border-border/10">
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypes.map((vehicle) => (
                            <SelectItem key={vehicle.value} value={vehicle.value}>
                              {vehicle.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MH-12-AB-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchVehicleType !== "bicycle" && (
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="DL number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Working Hours & Coverage */}
          <Card className="border-border/5 shadow-lg">
            <CardHeader className="border-b border-border/10">
              <CardTitle>Working Hours & Coverage Areas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workingHours.start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHours.end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Coverage Areas</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select areas where this personnel can deliver
                </p>
                
                {selectedAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-sm">
                        {area}
                        <button
                          type="button"
                          onClick={() => removeArea(area)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {COVERAGE_AREAS.map((area) => (
                    <div
                      key={area}
                      className="flex items-center space-x-2 p-2 rounded border hover:bg-accent cursor-pointer"
                      onClick={() => handleAreaToggle(area)}
                    >
                      <Checkbox
                        checked={selectedAreas.includes(area)}
                        onChange={() => handleAreaToggle(area)}
                      />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
                {form.formState.errors.coverageAreas && (
                  <p className="text-sm text-destructive mt-2">
                    {form.formState.errors.coverageAreas.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-border/5 shadow-lg">
            <CardHeader className="border-b border-border/10">
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+91XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse, Parent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : personnel ? "Update Personnel" : "Create Personnel"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}