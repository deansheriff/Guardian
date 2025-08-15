'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/types';
import { Calendar, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { useShifts } from '@/context/shift-context';

export function ShiftSchedule() {
  const { user } = useUser();
  const { shifts } = useShifts();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const getWeekDays = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const userShifts = shifts.filter(shift => shift.guardid === user?.id);

  if (!user || userShifts.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Schedule</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-lg font-semibold text-muted-foreground">No shift assigned.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const weekDays = getWeekDays();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Schedule</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {weekDays.map((day, index) => {
            const shift = userShifts.find(s => s.day === day.toISOString().split('T')[0]);
            return (
                <div key={index} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">{day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{shift ? `${shift.startTime} - ${shift.endTime}` : 'No Shift'}</span>
                    </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}