"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { usePanic } from '@/context/panic-context';
import { AlertTriangle } from 'lucide-react';

const PanicButton = ({ guardName, location }: { guardName: string, location: string }) => {
  const { isPanic, triggerPanic } = usePanic();

  const handlePanic = () => {
    triggerPanic({ guardName, location });
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={handlePanic}
      disabled={isPanic}
      className="flex items-center gap-2 text-lg font-bold"
    >
      <AlertTriangle className="h-6 w-6" />
      {isPanic ? 'PANIC ACTIVATED' : 'PANIC'}
    </Button>
  );
};

export default PanicButton;