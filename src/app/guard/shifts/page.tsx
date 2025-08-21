'use client';

import { ShiftSchedule } from '@/components/guard/shift-schedule';

export default function GuardShiftsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Shifts</h2>
      </div>
      <ShiftSchedule />
    </div>
  );
}