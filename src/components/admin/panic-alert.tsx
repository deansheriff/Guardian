"use client"

import React, { useEffect, useRef, useState } from 'react';
import { usePanic } from '@/context/panic-context';
import { Button } from '@/components/ui/button';
import { Siren, User, MapPin, Clock } from 'lucide-react';
import { Location } from '@/lib/types';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const PanicAlert = () => {
  const { isPanic, resetPanic, panicPayload } = usePanic();
  const { locations } = useData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (isPanic) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
    if (panicPayload) {
        const location = locations.find((l: Location) => l.id === panicPayload.location);
        if (location) {
            setLocationName(location.name);
        }
    }
  }, [isPanic, panicPayload, locations]);

  if (!isPanic || !panicPayload) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg border-destructive border-4 shadow-2xl animate-pulse">
        <CardHeader className="text-center bg-destructive text-destructive-foreground p-6">
            <div className="flex justify-center mb-4">
                <Siren className="h-24 w-24" />
            </div>
            <CardTitle className="text-4xl font-bold">PANIC ALARM ACTIVATED</CardTitle>
            <CardDescription className="text-destructive-foreground/80 text-lg">Immediate assistance required!</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Guard:</span>
                <span>{panicPayload.guardName}</span>
            </div>
            <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Location:</span>
                <span>{locationName}</span>
            </div>
            <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Time:</span>
                <span>{format(new Date(panicPayload.timestamp), 'PPP p')}</span>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="secondary" className="w-full mt-6">Dismiss Alarm</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Dismissing the alarm will remove it from the view of all administrators. Only dismiss if the situation has been resolved.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetPanic}>Confirm Dismissal</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
      <audio ref={audioRef} src="/sounds/panic-alarm.mp3" loop />
    </div>
  );
};

export default PanicAlert;