"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { usePanic } from '@/context/panic-context';
import { Siren } from 'lucide-react';
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

const PanicButton = ({ guardName, location }: { guardName: string, location: string }) => {
  const { isPanic, triggerPanic } = usePanic();

  const handlePanic = () => {
    triggerPanic({ guardName, location, timestamp: new Date().toISOString() });
  };

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                variant="destructive"
                size="lg"
                disabled={isPanic}
                className={`w-full h-24 text-2xl font-bold rounded-lg shadow-lg transition-all duration-300 ${isPanic ? 'animate-pulse' : ''}`}
                >
                <Siren className="h-10 w-10 mr-4" />
                {isPanic ? 'PANIC ACTIVATED' : 'TRIGGER PANIC ALARM'}
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Confirm Panic Alarm</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to activate the panic alarm? This action will immediately notify all administrators and cannot be undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePanic}>Activate Alarm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
};

export default PanicButton;