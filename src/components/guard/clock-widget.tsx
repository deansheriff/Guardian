'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, LogIn, LogOut, MapPinOff, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getMockLocations, User, Location } from '@/lib/mock-data';


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
  const [user, setUser] = useState<User | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedStatus = localStorage.getItem('clockStatus');
    if (storedStatus) {
      const { clockedIn, startTime } = JSON.parse(storedStatus);
      setIsClockedIn(clockedIn);
      setShiftStartTime(startTime ? new Date(startTime) : null);
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLocations(getMockLocations());

  }, []);

  const handleClockAction = () => {
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

    if (!user || user.role !== 'guard' || !user.locationId || !user.shift) {
        toast({
            variant: 'destructive',
            title: 'Configuration Error',
            description: 'Your account is not configured for clock-in. Please contact an administrator.',
        });
        setIsLoading(false);
        return;
    }
    
    const assignedLocation = locations.find(loc => loc.id === user.locationId);
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
    const startHour = parseInt(user.shift.start.split(':')[0], 10);
    const endHour = parseInt(user.shift.end.split(':')[0], 10);
    
    // Handle overnight shifts
    const isOnShift = endHour > startHour 
        ? currentHour >= startHour && currentHour < endHour
        : currentHour >= startHour || currentHour < endHour;


    if (!isOnShift) {
        toast({
            variant: 'destructive',
            title: `Clock In Failed`,
            description: `You can only clock in during your shift (${user.shift.start} - ${user.shift.end}).`,
        });
        setIsLoading(false);
        return;
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = haversineDistance(position.coords, assignedLocation);
        
        if (distance <= GEOFENCE_RADIUS_METERS) {
          const newClockedInStatus = !isClockedIn;
          setIsClockedIn(newClockedInStatus);

          const newStartTime = newClockedInStatus ? new Date() : null;
          setShiftStartTime(newStartTime);

          localStorage.setItem('clockStatus', JSON.stringify({
            clockedIn: newClockedInStatus,
            startTime: newStartTime?.toISOString()
          }));
          
          if (newClockedInStatus) {
             localStorage.setItem('lastCheckIn', new Date().toISOString());
          } else {
             localStorage.removeItem('lastCheckIn');
          }


          toast({
            title: `Clock ${newClockedInStatus ? 'In' : 'Out'} Successful`,
            description: `You are at ${assignedLocation.name}.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: `Clock ${isClockedIn ? 'Out' : 'In'} Failed`,
            description: `You are outside your designated area: ${assignedLocation.name}.`,
          });
        }
        setIsLoading(false);
        window.location.reload();
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
