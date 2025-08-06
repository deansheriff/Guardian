"use client"

import IncidentReportLog from "@/components/admin/incident-report-log";

export default function IncidentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Incident Reports</h2>
      <IncidentReportLog />
    </div>
  );
}