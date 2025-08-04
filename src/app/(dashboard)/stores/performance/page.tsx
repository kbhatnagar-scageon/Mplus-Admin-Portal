import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  StorePerformanceCharts 
} from '@/features/analytics/components/charts/store-performance-charts';
import { 
  useStorePerformance 
} from '@/features/analytics/hooks/use-store-performance';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function StorePerformancePage() {
  const { performanceMetrics, isLoading } = useStorePerformance();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-[50px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="h-[350px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Store Performance Dashboard</h1>
      
      {/* Performance Charts */}
      <StorePerformanceCharts metrics={performanceMetrics || []} />

      {/* Performance Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Monthly Orders</TableHead>
                <TableHead>Revenue (₹)</TableHead>
                <TableHead>Delivery Success Rate</TableHead>
                <TableHead>Customer Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceMetrics?.map((store, index) => (
                <TableRow key={index}>
                  <TableCell>{store.storeName}</TableCell>
                  <TableCell>{store.monthlyOrders}</TableCell>
                  <TableCell>₹{store.revenue.toLocaleString()}</TableCell>
                  <TableCell>{store.deliverySuccessRate}%</TableCell>
                  <TableCell>{store.customerRating}/5</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}