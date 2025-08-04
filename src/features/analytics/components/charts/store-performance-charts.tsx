import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Performance metrics type
export interface StorePerformanceMetrics {
  storeName: string;
  monthlyOrders: number;
  revenue: number;
  deliverySuccessRate: number;
  customerRating: number;
}

interface StorePerformanceChartsProps {
  metrics: StorePerformanceMetrics[];
}

export const StorePerformanceCharts: React.FC<StorePerformanceChartsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Monthly Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Store Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="storeName" />
              <YAxis label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="monthlyOrders" fill="#8884d8" name="Monthly Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Store Revenue (₹)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="storeName" />
              <YAxis label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Delivery Success Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="storeName" />
              <YAxis 
                label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }} 
                domain={[0, 100]} 
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
              <Legend />
              <Bar dataKey="deliverySuccessRate" fill="#ffc658" name="Delivery Success" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Customer Ratings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="storeName" />
              <YAxis label={{ value: 'Rating', angle: -90, position: 'insideLeft' }} domain={[0, 5]} />
              <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
              <Legend />
              <Bar dataKey="customerRating" fill="#ff7300" name="Customer Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};