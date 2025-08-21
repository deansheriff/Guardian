"use client"

import React, { useState, useMemo } from 'react';
import { useShifts } from '@/context/shift-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/data-context';
import { Button } from '../ui/button';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format, startOfWeek, isSameDay, isSameMonth } from 'date-fns';
import { Shift } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ShiftDisplay = () => {
  const { shifts, deleteShift } = useShifts();
  const { users, locations } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  const guards = useMemo(() => users.filter(u => u.role === 'guard'), [users]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  const filteredShifts = useMemo(() => {
    return selectedLocation === 'all' 
      ? shifts 
      : shifts.filter(shift => shift.location_id === selectedLocation);
  }, [shifts, selectedLocation]);

  const openDeleteDialog = (shiftId: string) => {
    setShiftToDelete(shiftId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteShift = () => {
    if (!shiftToDelete) return;
    deleteShift(shiftToDelete);
    setIsDeleteDialogOpen(false);
    setShiftToDelete(null);
  };

  const renderShift = (shift: Shift) => {
    const guard = users.find(u => u.id === shift.guardid);
    const location = locations.find(l => l.id === shift.location_id);
    return (
        <div key={shift.id} className="bg-muted p-2 rounded-lg text-xs mb-1 relative group">
            <p className="font-semibold">{guard?.name || 'Unknown Guard'}</p>
            <p className="text-muted-foreground">{location?.name || 'Unknown Location'}</p>
            <p className="text-muted-foreground">{shift.startTime} - {shift.endTime}</p>
            <Button 
                variant="destructive" 
                size="icon" 
                className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => openDeleteDialog(shift.id!)}
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle>Weekly Shift Schedule</CardTitle>
            <CardDescription>{format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMMM d')} - {format(addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6), 'MMMM d, yyyy')}</CardDescription>
        </div>
        <div className="flex items-center gap-4">
            <Select onValueChange={setSelectedLocation} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 border-t border-l">
            {weekDays.map(day => (
                <div key={day.toString()} className="border-r border-b p-2">
                    <p className={`text-center font-semibold ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                        {format(day, 'EEE')}
                    </p>
                    <p className={`text-center text-sm ${isSameDay(day, new Date()) ? 'text-primary' : isSameMonth(day, currentDate) ? '' : 'text-muted-foreground'}`}>
                        {format(day, 'd')}
                    </p>
                </div>
            ))}
            {weekDays.map(day => (
                <div key={day.toString()} className="border-r border-b p-2 h-48 overflow-y-auto">
                    {filteredShifts.filter(shift => isSameDay(new Date(shift.day), day)).map(renderShift)}
                </div>
            ))}
        </div>
      </CardContent>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the shift.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteShift}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ShiftDisplay;