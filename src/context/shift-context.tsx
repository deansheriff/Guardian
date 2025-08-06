"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

export interface Shift {
  id: string;
  guardId: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface ShiftContextType {
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({children}: {children: ReactNode}) => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    async function fetchShifts() {
      const res = await fetch('/api/shifts');
      const data = await res.json();
      setShifts(data);
    }
    fetchShifts();
  }, []);

  const addShift = async (shift: Omit<Shift, 'id'>) => {
    const response = await fetch('/api/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shift),
    });
    if (response.ok) {
      const newShift = await response.json();
      setShifts(prevShifts => [...prevShifts, newShift]);
    }
  };

  return (
    <ShiftContext.Provider value={{shifts, addShift}}>
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