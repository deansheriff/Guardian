"use client"

import React, { useState, useEffect } from 'react';
import { useShifts } from '@/context/shift-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/lib/mock-data';
import { useData } from '@/context/data-context';

const ShiftDisplay = () => {
  const { shifts } = useShifts();
  const { users } = useData();

  const getGuardName = (guardId: string) => {
    const user = users.find(u => u.id === guardId);
    return user ? user.name : 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guard</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map(shift => (
              <TableRow key={shift.id}>
                <TableCell>{getGuardName(shift.guardId)}</TableCell>
                <TableCell>{shift.day}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShiftDisplay;