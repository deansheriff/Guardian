'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, MapPinOff, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { User, Location } from '@/lib/types';
import { format } from 'date-fns';
import { useUser } from '@/context/user-context';
import { useData } from '@/context/data-context';
import { useShifts } from '@/context/shift-context';
import { supabase } from '@/lib/db';


const GEOFENCE_RADIUS_METERS = 500; // 500 meters

const haversineDistance = (coords1: GeolocationCoordinates, coords2: { latitude: number, longitude: number }) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
};

export function ClockWidget() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  const { user } = useUser();
  const { locations } = useData();
  const { shifts } = useShifts();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInitialStatus() {
        if (!user) return;
        const { data: activities, error } = await supabase
            .from('activities')
            .select('*')
            .eq('guardid', user.id)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching activities:', error);
            return;
        }

        if (activities && activities.length > 0) {
            const lastActivity = activities[0];
            if (lastActivity.type === 'Clock In') {
                setIsClockedIn(true);
                setShiftStartTime(new Date(lastActivity.timestamp));
            }
        }
    }
    fetchInitialStatus();
  }, [user]);

  const handleClockAction = async () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Error',
        description: 'Geolocation is not supported by your browser.',
      });
      setIsLoading(false);
      return;
    }

    const today = new Date();
    const todayShift = shifts.find((s: any) => s.guardid === user?.id && s.day === format(today, "yyyy-MM-dd"));

    if (!user || user.role !== 'guard' || !user.location_id || !todayShift) {
        toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: 'Your account is not configured for clock-in. Please contact an administrator.',
        });
        setIsLoading(false);
        return;
    }
    
    const assignedLocation = locations.find(loc => loc.id === user.location_id);
     if (!assignedLocation) {
        toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: 'Your assigned location could not be found.',
        });
        setIsLoading(false);
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const startHour = parseInt(todayShift.startTime.split(':')[0], 10);
    const endHour = parseInt(todayShift.endTime.split(':')[0], 10);
    
    // Handle overnight shifts
    const isOnShift = endHour > startHour
        ? currentHour >= startHour && currentHour < endHour
        : currentHour >= startHour || currentHour < endHour;


    if (!isOnShift) {
        toast({
            variant: 'destructive',
            title: `Clock In Failed`,
            description: `You can only clock in during your shift (${todayShift.startTime} - ${todayShift.endTime}).`,
        });
        setIsLoading(false);
        return;
    }


    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const distance = haversineDistance(position.coords, assignedLocation);
        
        if (distance <= GEOFENCE_RADIUS_METERS) {
          const newClockedInStatus = !isClockedIn;
          setIsClockedIn(newClockedInStatus);

          const newStartTime = newClockedInStatus ? new Date() : null;
          setShiftStartTime(newStartTime);

          const newActivity = {
            id: new Date().toISOString(),
            guardid: user.id,
            guard: user.name,
            type: newClockedInStatus ? 'Clock In' : 'Clock Out',
            timestamp: new Date().toISOString(),
            status: 'Success',
            location: assignedLocation.id
          };
          
          await supabase.from('activities').insert([newActivity]);

          toast({
            title: `Clock ${newClockedInStatus ? 'In' : 'Out'} Successful`,
            description: `You are at ${assignedLocation.name}.`,
          });
        } else {
          const newActivity = {
            id: new Date().toISOString(),
            guardid: user.id,
            guard: user.name,
            type: isClockedIn ? 'Clock Out' : 'Clock In',
            timestamp: new Date().toISOString(),
            status: 'Failed',
            location: assignedLocation.id
          };
          
          await supabase.from('activities').insert([newActivity]);

          toast({
            variant: 'destructive',
            title: `Clock ${isClockedIn ? 'Out' : 'In'} Failed`,
            description: `You are outside your designated area: ${assignedLocation.name}.`,
          });
        }
        setIsLoading(false);
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Unable to retrieve your location. Please enable location services.',
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Shift Status</CardTitle>
                <CardDescription>Clock in to start your shift and receive check-in prompts.</CardDescription>
            </div>
            <Badge variant={isClockedIn ? "default" : "secondary"} className={isClockedIn ? 'bg-green-500 text-white' : ''}>
                {isClockedIn ? 'On Duty' : 'Off Duty'}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isClockedIn && shiftStartTime && (
            <div className="text-sm text-muted-foreground">
                Shift started at: {shiftStartTime.toLocaleTimeString()}
            </div>
        )}
        <Button onClick={handleClockAction} disabled={isLoading} className="w-full" variant={isClockedIn ? "destructive" : "default"}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isClockedIn ? (
            <LogOut className="mr-2 h-4 w-4" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Verifying...' : isClockedIn ? 'Clock Out' : 'Clock In'}
        </Button>
        <div className='flex items-center justify-center text-xs text-muted-foreground p-2 rounded-md bg-muted text-center'>
            {isClockedIn ? <MapPin className='h-4 w-4 mr-2 text-green-500'/> : <MapPinOff className='h-4 w-4 mr-2 text-red-500'/>}
            Location & shift time verification is required to clock in/out.
        </div>
      </CardContent>
    </Card>
  );
}
