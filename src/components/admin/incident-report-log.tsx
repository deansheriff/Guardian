"use client"

import React from 'react';
import { useIncidentReport, IncidentReport } from '@/context/incident-report-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const IncidentReportLog = () => {
  const { reports } = useIncidentReport();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guard</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report: IncidentReport) => (
              <TableRow key={report.id}>
                <TableCell>{report.guard}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.timestamp}</TableCell>
                <TableCell>{report.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IncidentReportLog;