"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StorePerformanceMetrics } from '../components/charts/store-performance-charts';

// Generate mock performance metrics
const generateMockPerformanceMetrics = (storeNames: string[]): StorePerformanceMetrics[] => {
  return storeNames.map((storeName) => ({
    storeName,
    monthlyOrders: Math.floor(Math.random() * 500) + 50, // 50-550 orders
    revenue: Math.floor(Math.random() * 500000) + 50000, // ₹50,000-₹550,000
    deliverySuccessRate: Math.min(100, Math.floor(Math.random() * 100) + 80), // 80-100%
    customerRating: Number((Math.random() * 2 + 3).toFixed(1)) // 3.0-5.0 rating
  }));
};

export const useStorePerformance = () => {
  const [dateRange, setDateRange] = useState<{ 
    startDate: Date, 
    endDate: Date 
  }>({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date() // Today
  });

  const fetchStorePerformance = async () => {
    // Simulate API call with mock stores
    const mockStoreNames = [
      'City Pharmacy', 
      'Health Haven', 
      'Wellness Mart', 
      'Quick Meds', 
      'Care Pharmacy'
    ];

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return generateMockPerformanceMetrics(mockStoreNames);
  };

  const { 
    data: performanceMetrics, 
    isLoading, 
    error 
  } = useQuery<StorePerformanceMetrics[]>({
    queryKey: ['store-performance', dateRange],
    queryFn: fetchStorePerformance
  });

  return {
    performanceMetrics,
    isLoading,
    error,
    setDateRange
  };
};