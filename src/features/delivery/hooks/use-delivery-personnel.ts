"use client";

import { useState, useMemo } from "react";
import { DeliveryPersonnel, DeliveryFilters, DeliveryStatus, VehicleType } from "@/features/delivery/types";
import { 
  mockDeliveryPersonnel, 
  getDeliveryPersonnelById, 
  getActiveDeliveryPersonnel, 
  getAvailableDeliveryPersonnel,
  getDeliveryPersonnelByArea 
} from "@/lib/mock-data/delivery";
import { useAuth } from "@/hooks/use-auth";

export const useDeliveryPersonnel = () => {
  const { user } = useAuth();
  const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>(mockDeliveryPersonnel);
  const [filters, setFilters] = useState<DeliveryFilters>({});

  // Filter personnel based on user role
  const roleFilteredPersonnel = useMemo(() => {
    if (!user) return [];
    
    // Store vendors only see personnel assigned to their store
    if (user.role === "STORE_VENDOR" && user.storeId) {
      return personnel.filter(person => person.storeId === user.storeId);
    }
    
    // Superadmin sees all personnel
    return personnel;
  }, [personnel, user]);

  const filteredPersonnel = useMemo(() => {
    return roleFilteredPersonnel.filter(person => {
      const { status, vehicleType, coverageArea, isActive, dateFrom, dateTo } = filters;
      const joinedDate = new Date(person.joinedAt);

      const statusMatch = !status || person.status === status;
      const vehicleMatch = !vehicleType || person.vehicleType === vehicleType;
      const areaMatch = !coverageArea || person.coverageAreas.some(area => 
        area.toLowerCase().includes(coverageArea.toLowerCase())
      );
      const activeMatch = isActive === undefined || person.isActive === isActive;
      const dateFromMatch = !dateFrom || joinedDate >= dateFrom;
      const dateToMatch = !dateTo || joinedDate <= dateTo;

      return statusMatch && vehicleMatch && areaMatch && activeMatch && dateFromMatch && dateToMatch;
    });
  }, [roleFilteredPersonnel, filters]);

  const createPersonnel = (personnelData: Omit<DeliveryPersonnel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPersonnel: DeliveryPersonnel = {
      ...personnelData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPersonnel(prev => [...prev, newPersonnel]);
    return newPersonnel;
  };

  const updatePersonnel = (id: string, updates: Partial<DeliveryPersonnel>) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === id 
          ? { ...person, ...updates, updatedAt: new Date().toISOString() } 
          : person
      )
    );
  };

  const updatePersonnelStatus = (id: string, status: DeliveryStatus) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === id 
          ? { 
              ...person, 
              status, 
              lastActive: new Date().toISOString(),
              updatedAt: new Date().toISOString() 
            } 
          : person
      )
    );
  };

  const togglePersonnelActive = (id: string) => {
    setPersonnel(prev => 
      prev.map(person => 
        person.id === id 
          ? { 
              ...person, 
              isActive: !person.isActive,
              status: !person.isActive ? person.status : 'offline',
              updatedAt: new Date().toISOString() 
            } 
          : person
      )
    );
  };

  const deletePersonnel = (id: string) => {
    setPersonnel(prev => prev.filter(person => person.id !== id));
  };

  const getPersonnelStats = () => {
    const total = personnel.length;
    const active = personnel.filter(p => p.isActive).length;
    const available = personnel.filter(p => p.status === 'available' && p.isActive).length;
    const busy = personnel.filter(p => p.status === 'busy').length;
    const offline = personnel.filter(p => p.status === 'offline').length;

    return {
      total,
      active,
      available,
      busy,
      offline,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
      availablePercentage: active > 0 ? Math.round((available / active) * 100) : 0
    };
  };

  return {
    personnel: filteredPersonnel,
    allPersonnel: personnel,
    filters,
    setFilters,
    createPersonnel,
    updatePersonnel,
    updatePersonnelStatus,
    togglePersonnelActive,
    deletePersonnel,
    getPersonnelById: getDeliveryPersonnelById,
    getActivePersonnel: getActiveDeliveryPersonnel,
    getAvailablePersonnel: getAvailableDeliveryPersonnel,
    getPersonnelByArea: getDeliveryPersonnelByArea,
    getPersonnelStats
  };
};