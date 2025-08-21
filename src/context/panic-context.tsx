"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { supabase } from '@/lib/db';
import { PanicAlert } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface PanicPayload {
  guardName: string;
  location: string;
  timestamp: string;
}

interface PanicContextType {
  isPanic: boolean;
  panicPayload: PanicPayload | null;
  triggerPanic: (payload: PanicPayload) => void;
  resetPanic: () => void;
}

const PanicContext = createContext<PanicContextType | undefined>(undefined);

export const PanicProvider = ({children}: {children: ReactNode}) => {
  const [isPanic, setIsPanic] = useState(false);
  const [panicPayload, setPanicPayload] = useState<PanicPayload | null>(null);

  useEffect(() => {
    const channel = supabase.channel('panic-alerts');

    channel
      .on<PanicAlert>('postgres_changes', { event: 'INSERT', schema: 'public', table: 'panic_alerts' }, (payload) => {
        setIsPanic(true);
        setPanicPayload(payload.new as PanicAlert);
      })
      .on<PanicAlert>('postgres_changes', { event: 'DELETE', schema: 'public', table: 'panic_alerts' }, () => {
        setIsPanic(false);
        setPanicPayload(null);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const triggerPanic = async (payload: PanicPayload) => {
    await fetch('/api/panic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload, id: uuidv4() }),
    });
  };

  const resetPanic = async () => {
    await supabase.from('panic_alerts').delete().neq('id', '0'); // Delete all rows
    setIsPanic(false);
    setPanicPayload(null);
  };

  return (
    <PanicContext.Provider value={{ isPanic, panicPayload, triggerPanic, resetPanic }}>
      {children}
    </PanicContext.Provider>
  );
};

export const usePanic = () => {
  const context = useContext(PanicContext);
  if (context === undefined) {
    throw new Error('usePanic must be used within a PanicProvider');
  }
  return context;
};