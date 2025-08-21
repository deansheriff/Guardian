"use client"

import React from 'react';
import { useActiveGuards } from '@/context/active-guards-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/data-context';
import { differenceInMinutes, format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Clock, MapPin } from 'lucide-react';

const ActiveGuardsList = () => {
  const { activeGuards } = useActiveGuards();
  const { users, locations } = useData();

  const getGuardDetails = (guardId: string) => {
    const user = users.find(u => u.id === guardId);
    const location = user?.location_id ? locations.find(l => l.id === user.location_id) : null;
    return { user, location };
  };

  const getLatenessInfo = (guard: any) => {
    if (guard.status === 'Late' && guard.shift) {
        const shiftStart = new Date();
        const [hours, minutes] = guard.shift.startTime.split(':').map(Number);
        shiftStart.setHours(hours, minutes, 0, 0);
        if (guard.loginTime && !isNaN(new Date(guard.loginTime).getTime())) {
            const lateness = differenceInMinutes(new Date(guard.loginTime), shiftStart);
            return { text: `${lateness} mins late`, variant: 'destructive' as const };
        }
    }
    return { text: guard.status, variant: 'default' as const };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Guards</CardTitle>
        <CardDescription>A real-time list of all guards currently on duty.</CardDescription>
      </CardHeader>
      <CardContent>
        {activeGuards.length > 0 ? (
            <ul className="space-y-4">
                {activeGuards.map((guard, index) => {
                    const { user, location } = getGuardDetails(guard.id);
                    const lateness = getLatenessInfo(guard);
                    return (
                        <li key={`${guard.id}-${index}`} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={user?.image_url} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0) || 'G'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{guard.name}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>
                                                Logged in at {guard.loginTime && !isNaN(new Date(guard.loginTime).getTime()) ? format(new Date(guard.loginTime), 'p') : 'N/A'}
                                            </span>
                                        </div>
                                        {location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{location.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Badge variant={lateness.variant}>{lateness.text}</Badge>
                        </li>
                    )
                })}
            </ul>
        ) : (
            <div className="text-center text-muted-foreground py-8">
                <p>No guards are currently active.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveGuardsList;