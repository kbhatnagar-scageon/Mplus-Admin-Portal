"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Store } from "@/features/stores/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface StoreDetailsProps {
  store: Store;
  onEdit?: () => void;
}

export function StoreDetails({ store, onEdit }: StoreDetailsProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied`,
      description: `${text} has been copied to clipboard.`
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Store Information</CardTitle>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit Store
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{store.name}</h3>
                <Badge variant={store.storeType === "RETAIL" ? "default" : "secondary"}>
                  {store.storeType}
                </Badge>
              </div>
              <Badge 
                variant={
                  store.status === "ACTIVE" ? "default" 
                  : store.status === "INACTIVE" ? "destructive" 
                  : "outline"
                }
              >
                {store.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p>{`${store.address.street}, ${store.address.city}, ${store.address.state} - ${store.address.pincode}`}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(
                  `${store.address.street}, ${store.address.city}, ${store.address.state} - ${store.address.pincode}`, 
                  "Address"
                )}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <p>{store.contactNumber}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(store.contactNumber, "Phone Number")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p>{store.email}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(store.email, "Email")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance & Licenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">Drug License</p>
              <p>{store.drugLicense}</p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="font-medium">GSTIN</p>
              <p>{store.gstin}</p>
            </div>
            {store.foodLicense && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <p className="font-medium">Food License</p>
                  <p>{store.foodLicense}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">Operating Hours</p>
              <p>{`${store.operatingHours.open} - ${store.operatingHours.close}`}</p>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Service Areas</p>
              <div className="flex flex-wrap gap-2">
                {store.serviceAreas.map((area) => (
                  <Badge key={area} variant="outline">{area}</Badge>
                ))}
              </div>
            </div>
            {store.evitalRxId && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <p className="font-medium">EvitalRx Integration ID</p>
                  <p>{store.evitalRxId}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium">Created On</p>
              <p>{formatDate(store.createdAt)}</p>
            </div>
            {store.approvedAt && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <p className="font-medium">Approved On</p>
                  <p>{formatDate(store.approvedAt)}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}