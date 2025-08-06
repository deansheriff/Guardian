"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect, useCallback} from 'react';
import { User, Location, Activity } from '@/lib/mock-data';

interface DataContextType {
  users: User[];
  locations: Location[];
  activities: Activity[];
  refetchData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({children}: {children: ReactNode}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchData = useCallback(async () => {
    const usersRes = await fetch('/api/users');
    const usersData = await usersRes.json();
    setUsers(usersData);

    const locationsRes = await fetch('/api/locations');
    const locationsData = await locationsRes.json();
    setLocations(locationsData);

    const activitiesRes = await fetch('/api/activities');
    const activitiesData = await activitiesRes.json();
    setActivities(activitiesData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{users, locations, activities, refetchData: fetchData}}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};