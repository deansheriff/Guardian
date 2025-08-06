'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockUsers, User } from '@/lib/mock-data';
import { Calendar, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ShiftSchedule() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('guardUser');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('guardUser');
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

  if (!user || !user.shift) {
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
        {weekDays.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-md border">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{user.shift?.start} - {user.shift?.end}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}