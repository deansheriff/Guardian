"use client"

import React, { useEffect, useRef, useState } from 'react';
import { usePanic } from '@/context/panic-context';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Location } from '@/lib/mock-data';

const PanicAlert = () => {
  const { isPanic, resetPanic, panicPayload } = usePanic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (isPanic) {
      audioRef.current?.play();
    }
    async function fetchLocation() {
        if (panicPayload) {
            const res = await fetch('/api/locations');
            const locations = await res.json();
            const location = locations.find((l: Location) => l.id === panicPayload.location);
            if (location) {
                setLocationName(location.name);
            }
        }
    }
    fetchLocation();
  }, [isPanic, panicPayload]);

  if (!isPanic) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-destructive p-8 text-destructive-foreground">
        <AlertTriangle className="h-16 w-16" />
        <h2 className="text-4xl font-bold">PANIC ACTIVATED</h2>
        {panicPayload && (
          <div className="text-center">
            <p className="text-lg"><span className="font-bold">{panicPayload.guardName}</span> has triggered the panic alarm.</p>
            <p className="text-lg">Location: <span className="font-bold">{locationName}</span></p>
          </div>
        )}
        <Button variant="secondary" onClick={resetPanic}>
          Dismiss
        </Button>
      </div>
      <audio ref={audioRef} src="/sounds/panic-alarm.mp3" />
    </div>
  );
};

export default PanicAlert;