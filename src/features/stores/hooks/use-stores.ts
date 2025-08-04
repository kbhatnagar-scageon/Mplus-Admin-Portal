import { useState } from 'react';
import { Store, StoreStatus } from '../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Mock data and API simulation
const generateMockStores = (count: number): Store[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `store_${index + 1}`,
    name: `Pharmacy Store ${index + 1}`,
    ownerName: `Owner ${index + 1}`,
    contactNumber: `+91 98${Math.floor(Math.random() * 10000000)}`,
    email: `owner${index + 1}@pharmacy.com`,
    address: {
      street: `Street ${index + 1}`,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: `40010${index + 1}`
    },
    drugLicense: `DL-MH-2024-${index + 1000}`,
    gstin: `27AAAA1234A1Z${index + 1}`,
    storeType: 'RETAIL',
    operatingHours: { open: '09:00', close: '21:00' },
    serviceAreas: ['Mumbai Central', 'Bandra'],
    status: index % 3 === 0 ? 'PENDING_APPROVAL' : 'ACTIVE',
    createdAt: new Date().toISOString(),
    approvedAt: index % 3 !== 0 ? new Date().toISOString() : undefined
  }));
};

const MOCK_STORES = generateMockStores(30);

export const useStores = () => {
  const [filters, setFilters] = useState<{ status?: StoreStatus }>({});

  const fetchStores = async () => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return filters.status
      ? MOCK_STORES.filter(store => store.status === filters.status)
      : MOCK_STORES;
  };

  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores', filters],
    queryFn: fetchStores
  });

  return {
    stores,
    isLoading,
    setStatusFilter: (status?: StoreStatus) => setFilters({ status })
  };
};

export const useStoreApproval = () => {
  const queryClient = useQueryClient();

  const approveStoreMutation = useMutation({
    mutationFn: async (data: { 
      storeId: string; 
      comments?: string 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const store = MOCK_STORES.find(s => s.id === data.storeId);
      if (store) {
        store.status = 'ACTIVE';
        store.approvedAt = new Date().toISOString();
      }
      return store;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });

  const rejectStoreMutation = useMutation({
    mutationFn: async (data: { 
      storeId: string; 
      reason: string 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const store = MOCK_STORES.find(s => s.id === data.storeId);
      if (store) {
        store.status = 'INACTIVE';
      }
      return store;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    }
  });

  return {
    approveStore: approveStoreMutation.mutate,
    rejectStore: rejectStoreMutation.mutate,
    isProcessing: approveStoreMutation.isLoading || rejectStoreMutation.isLoading
  };
};