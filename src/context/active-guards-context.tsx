"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { format } from 'date-fns';

interface ActiveGuard {
  id: string;
  name: string;
  loginTime: string;
  status: 'On Time' | 'Late' | 'Missed Check-in';
  shift?: { start: string; end: string; };
}

interface ActiveGuardsContextType {
  activeGuards: ActiveGuard[];
  addActiveGuard: (guard: Omit<ActiveGuard, 'loginTime' | 'status'>, shift?: { start: string; end: string; }) => void;
  removeActiveGuard: (guardId: string) => void;
  updateGuardStatus: (guardId: string, status: 'On Time' | 'Late' | 'Missed Check-in') => void;
}

const ActiveGuardsContext = createContext<ActiveGuardsContextType | undefined>(undefined);

export const ActiveGuardsProvider = ({children}: {children: ReactNode}) => {
  const [activeGuards, setActiveGuards] = useState<ActiveGuard[]>([]);

  useEffect(() => {
    async function fetchActiveGuards() {
      const activitiesRes = await fetch('/api/activities');
      const activities = await activitiesRes.json();
      const usersRes = await fetch('/api/users');
      const users = await usersRes.json();

      const guards = users.filter((u: any) => u.role === 'guard');
      const shiftsRes = await fetch('/api/shifts');
      const shifts = await shiftsRes.json();
      const activeGuardsList: ActiveGuard[] = [];

      for (const guard of guards) {
        const guardActivities = activities.filter((a: any) => a.guardId === guard.id);
        if (guardActivities.length > 0) {
          const lastActivity = guardActivities.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          if (lastActivity.type === 'Clock In') {
            const today = new Date();
            const todayShift = shifts.find((s: any) => s.guardId === guard.id && s.day === format(today, "yyyy-MM-dd"));
            let status: 'On Time' | 'Late' = 'On Time';
            if (todayShift) {
              const [hours, minutes] = todayShift.startTime.split(':').map(Number);
              const shiftStart = new Date();
              shiftStart.setHours(hours, minutes, 0, 0);
              if (new Date(lastActivity.timestamp) > shiftStart) {
                status = 'Late';
              }
            }
            activeGuardsList.push({
              id: guard.id,
              name: guard.name,
              loginTime: new Date(lastActivity.timestamp).toLocaleString(),
              status,
              shift: todayShift,
            });
          }
        }
      }
      setActiveGuards(activeGuardsList);
    }
    fetchActiveGuards();
  }, []);

  const addActiveGuard = (guard: Omit<ActiveGuard, 'loginTime' | 'status'>, shift?: { start: string; end: string; }) => {
    // This is now handled by fetching from the database
  };

  const removeActiveGuard = (guardId: string) => {
    // This is now handled by fetching from the database
  };

  const updateGuardStatus = (guardId: string, status: 'On Time' | 'Late' | 'Missed Check-in') => {
    setActiveGuards(prevGuards =>
      prevGuards.map(guard =>
        guard.id === guardId ? { ...guard, status } : guard
      )
    );
  };

  return (
    <ActiveGuardsContext.Provider value={{activeGuards, addActiveGuard, removeActiveGuard, updateGuardStatus}}>
      {children}
    </ActiveGuardsContext.Provider>
  );
};

export const useActiveGuards = () => {
  const context = useContext(ActiveGuardsContext);
  if (context === undefined) {
    throw new Error('useActiveGuards must be used within an ActiveGuardsProvider');
  }
  return context;
};