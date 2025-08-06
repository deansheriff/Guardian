"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

interface PanicPayload {
  guardName: string;
  location: string;
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
    const interval = setInterval(async () => {
      const res = await fetch('/api/panic');
      const alerts = await res.json();
      if (alerts.length > 0) {
        setIsPanic(true);
        setPanicPayload(alerts[0]);
      } else {
        setIsPanic(false);
        setPanicPayload(null);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const triggerPanic = async (payload: PanicPayload) => {
    await fetch('/api/panic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const resetPanic = async () => {
    await fetch('/api/panic/reset', { method: 'POST' });
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