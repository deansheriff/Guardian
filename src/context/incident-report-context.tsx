"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { Incident } from '@/lib/types';
import { supabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

interface IncidentReportContextType {
  reports: Incident[];
  addReport: (report: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const IncidentReportContext = createContext<IncidentReportContextType | undefined>(undefined);

export const IncidentReportProvider = ({children}: {children: ReactNode}) => {
    const [reports, setReports] = useState<Incident[]>([]);

    async function fetchReports() {
        const { data, error } = await supabase.from('incidents').select('*');
        if (error) console.error('Error fetching reports:', error);
        else setReports(data as Incident[]);
    }

    useEffect(() => {
        fetchReports();
    }, []);

  const addReport = async (report: Omit<Incident, 'id' | 'timestamp'>) => {
    const newReport = {
      ...report,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
      
      const { data, error } = await supabase.from('incidents').insert([newReport]).select();
      if (error) {
          console.error('Error adding report:', error);
      } else {
          fetchReports();
      }
  };

  return (
    <IncidentReportContext.Provider value={{reports, addReport}}>
      {children}
    </IncidentReportContext.Provider>
  );
};

export const useIncidentReport = () => {
  const context = useContext(IncidentReportContext);
  if (context === undefined) {
    throw new Error('useIncidentReport must be used within an IncidentReportProvider');
  }
  return context;
};