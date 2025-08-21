"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { Shift } from '@/lib/types';
import { supabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

interface ShiftContextType {
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  deleteShift: (shiftId: string) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({children}: {children: ReactNode}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  async function fetchShifts() {
    const { data, error } = await supabase.from('shifts').select('*');
    if (error) console.error('Error fetching shifts:', error);
    else setShifts(data as Shift[]);
  }

  useEffect(() => {
    fetchShifts();
  }, []);

  const addShift = async (shift: Omit<Shift, 'id'>) => {
    const newShift = { ...shift, id: uuidv4() };
    const { data, error } = await supabase.from('shifts').insert([newShift]).select();
    if (error) {
        console.error('Error adding shift:', error);
    } else {
        fetchShifts();
    }
  };

  const deleteShift = async (shiftId: string) => {
    const { error } = await supabase.from('shifts').delete().eq('id', shiftId);
    if (error) {
        console.error('Error deleting shift:', error);
    } else {
        fetchShifts();
    }
  };

  return (
    <ShiftContext.Provider value={{shifts, addShift, deleteShift}}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShifts = () => {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShifts must be used within a ShiftProvider');
  }
  return context;
};