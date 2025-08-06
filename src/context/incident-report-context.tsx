"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';

export interface IncidentReport {
  id: string;
  guard: string;
  location: string;
  description: string;
  timestamp: string;
}

interface IncidentReportContextType {
  reports: IncidentReport[];
  addReport: (report: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
}

const IncidentReportContext = createContext<IncidentReportContextType | undefined>(undefined);

export const IncidentReportProvider = ({children}: {children: ReactNode}) => {
    const [reports, setReports] = useState<IncidentReport[]>([]);

    useEffect(() => {
        async function fetchReports() {
            const res = await fetch('/api/incidents');
            const data = await res.json();
            setReports(data);
        }
        fetchReports();
    }, []);

  const addReport = async (report: Omit<IncidentReport, 'id' | 'timestamp'>) => {
    const newReport: IncidentReport = {
      ...report,
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
    };
      
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport),
      });

      if (response.ok) {
        setReports(prevReports => [...prevReports, newReport]);
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