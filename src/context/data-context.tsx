"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect, useCallback} from 'react';
import { User, Location, Activity, Shift } from '@/lib/types';
import { supabase } from '@/lib/db';

interface DataContextType {
  users: User[];
  locations: Location[];
  activities: Activity[];
  shifts: Shift[];
  refetchData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({children}: {children: ReactNode}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const fetchData = useCallback(async () => {
    const { data: usersData, error: usersError } = await supabase.from('users').select('*');
    if (usersError) console.error('Error fetching users:', usersError);
    else setUsers(usersData as User[]);

    const { data: locationsData, error: locationsError } = await supabase.from('locations').select('*');
    if (locationsError) console.error('Error fetching locations:', locationsError);
    else setLocations(locationsData as Location[]);

    const { data: activitiesData, error: activitiesError } = await supabase.from('activities').select('*');
    if (activitiesError) console.error('Error fetching activities:', activitiesError);
    else setActivities(activitiesData as Activity[]);

    const { data: shiftsData, error: shiftsError } = await supabase.from('shifts').select('*');
    if (shiftsError) console.error('Error fetching shifts:', shiftsError);
    else setShifts(shiftsData as Shift[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{users, locations, activities, shifts, refetchData: fetchData}}>
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