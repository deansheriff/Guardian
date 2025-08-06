"use client"

import React, { useState, useEffect } from 'react';
import { useActiveGuards } from '@/context/active-guards-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Location } from '@/lib/mock-data';
import { differenceInMinutes } from 'date-fns';
import { useData } from '@/context/data-context';

const ActiveGuardsList = () => {
  const { activeGuards } = useActiveGuards();
  const { users, locations } = useData();

  const getGuardLocation = (guardId: string) => {
    const user = users.find(u => u.id === guardId);
    if (user && user.locationId) {
      const location = locations.find(l => l.id === user.locationId);
      return location ? location.name : 'Unknown';
    }
    return 'N/A';
  };

  const getLateness = (guard: any) => {
    if (guard.status === 'Late' && guard.shift) {
        const shiftStart = new Date();
        const [hours, minutes] = guard.shift.startTime.split(':').map(Number);
        shiftStart.setHours(hours, minutes, 0, 0);
        const lateness = differenceInMinutes(new Date(guard.loginTime), shiftStart);
        return `${lateness} mins late`;
    }
    return guard.status;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Guards</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeGuards.map((guard, index) => (
              <TableRow key={`${guard.id}-${index}`}>
                <TableCell>{guard.name}</TableCell>
                <TableCell>{guard.loginTime}</TableCell>
                <TableCell>{getLateness(guard)}</TableCell>
                <TableCell>{getGuardLocation(guard.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveGuardsList;