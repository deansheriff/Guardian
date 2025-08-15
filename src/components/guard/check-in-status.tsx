'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';
import { User, Location } from '@/lib/types';
import { useActiveGuards } from '@/context/active-guards-context';
import { useUser } from '@/context/user-context';
import { supabase } from '@/lib/db';
export function CheckInStatus() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [nextCheckIn, setNextCheckIn] = useState<Date | null>(null);
  const [timeToNext, setTimeToNext] = useState(0);
  const [frequency, setFrequency] = useState(60);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { toast } = useToast();
  const { updateGuardStatus } = useActiveGuards();
  const { user } = useUser();

  const updateStatus = useCallback(async () => {
    if (!user) return;

    const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .eq('guardid', user.id);

    if (error) {
        console.error('Error fetching activities:', error);
        return;
    }

    const lastClockIn = activities.find((a: any) => a.type === 'Clock In');
    const lastClockOut = activities.find((a: any) => a.type === 'Clock Out');

    const clockedIn = lastClockIn && (!lastClockOut || new Date(lastClockIn.timestamp) > new Date(lastClockOut.timestamp));
    setIsClockedIn(clockedIn);

    const lastCheckInActivity = activities.find((a: any) => a.type === 'Check-in');
    setLastCheckIn(lastCheckInActivity ? new Date(lastCheckInActivity.timestamp) : null);

    if (clockedIn) {
      const baseTime = lastCheckInActivity ? new Date(lastCheckInActivity.timestamp) : new Date(lastClockIn.timestamp);
      const nextTime = new Date(baseTime.getTime() + 60 * 60 * 1000);
      setNextCheckIn(nextTime);
    } else {
        setNextCheckIn(null);
    }
  }, [user]);

  useEffect(() => {
    updateStatus();
    const statusInterval = setInterval(updateStatus, 5000); // Periodically check for changes in other tabs
    return () => clearInterval(statusInterval);
  }, [updateStatus]);

  useEffect(() => {
    if (!isClockedIn || !nextCheckIn) {
      return;
    }

    const timer = setInterval(async () => {
      const now = new Date();
      const diff = nextCheckIn.getTime() - now.getTime();
      setTimeToNext(diff > 0 ? diff : 0);

      if (diff <= 0) {
        setShowPrompt(true);
        if (user && user.id) {
            updateGuardStatus(user.id, 'Missed Check-in');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn, nextCheckIn, user, updateGuardStatus]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  }

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    
    if (!user || !user.location_id) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find your assigned location.' });
        setIsCheckingIn(false);
        return;
    }

    const { data: locations, error } = await supabase.from('locations').select('*');
    if (error) {
        console.error('Error fetching locations:', error);
        setIsCheckingIn(false);
        return;
    }
    const assignedLocation = locations.find((l: Location) => l.id === user.location_id);

    if (!assignedLocation) {
        toast({ variant: 'destructive', title: 'Error', description: 'Assigned location not found.' });
        setIsCheckingIn(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const distance = getDistance(
            position.coords.latitude,
            position.coords.longitude,
            assignedLocation.latitude,
            assignedLocation.longitude
        );

        const now = new Date();
        const success = distance <= (assignedLocation.radius || 30);

        const newActivity = {
            id: now.toISOString(),
            guardid: user.id,
            guard: user.name,
            type: 'Check-in',
            timestamp: now.toISOString(),
            status: success ? 'Success' : 'Failed',
            location: assignedLocation.name
        };

        await supabase.from('activities').insert([newActivity]);

        if (success) {
            setLastCheckIn(now);
            setShowPrompt(false);
            toast({
              title: 'Check-in Successful',
              description: `Your presence has been confirmed at ${now.toLocaleTimeString()}`,
            });
            updateStatus();
        } else {
            toast({
              variant: 'destructive',
              title: 'Check-in Failed',
              description: `You are too far from your assigned post. You are ${Math.round(distance)} meters away.`,
            });
        }
        setIsCheckingIn(false);
      },
      (error) => {
        let description = 'Could not get your location. Please ensure it is enabled.';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                description = "Location access was denied. Please enable it in your browser settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                description = "Your location information is currently unavailable.";
                break;
            case error.TIMEOUT:
                description = "The request to get your location timed out.";
                break;
        }
        toast({
          variant: 'destructive',
          title: 'Check-in Failed',
          description,
        });
        setIsCheckingIn(false);
      }
    );
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressValue = nextCheckIn && timeToNext > 0 ? ((frequency * 60 * 1000 - timeToNext) / (frequency * 60 * 1000)) * 100 : 0;

  return (
    <div className="space-y-2">
      {!isClockedIn ? (
        <p className="text-sm text-muted-foreground">Clock in to begin check-in monitoring.</p>
      ) : (
        <>
          <div className="flex justify-between text-sm font-medium">
            <span>Next Check-in</span>
            <span>{timeToNext > 0 ? formatTime(timeToNext) : "Now!"}</span>
          </div>
          <Progress value={progressValue} />
          {lastCheckIn && (
            <p className="text-xs text-muted-foreground">
              Last check-in at: {lastCheckIn.toLocaleTimeString()}
            </p>
          )}
        </>
      )}

      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time for your Hourly Check-in</DialogTitle>
            <DialogDescription>
              Please confirm your presence at your post. Your location will be verified.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCheckIn} disabled={isCheckingIn}>
              {isCheckingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Presence
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
