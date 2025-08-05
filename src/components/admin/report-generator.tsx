'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const mockCheckIns = [
  { guard: 'Guard One', timestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(), location: 'Main Gate' },
  { guard: 'Guard Two', timestamp: new Date(new Date().setDate(new Date().getDate() -1)).toISOString(), location: 'East Wing' },
  { guard: 'Guard One', timestamp: new Date().toISOString(), location: 'West Wing' },
  { guard: 'Guard One', timestamp: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), location: 'Main Gate' },
];

export function ReportGenerator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportData, setReportData] = useState<typeof mockCheckIns>([]);

  const handleGenerateReport = () => {
    if (date) {
      const filteredData = mockCheckIns.filter(
        (checkIn) => format(new Date(checkIn.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      setReportData(filteredData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Daily Report</CardTitle>
        <CardDescription>Select a date to generate a summary report of all shift check-ins.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Dialog>
             <DialogTrigger asChild>
                <Button onClick={handleGenerateReport} disabled={!date}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Daily Check-in Report for {date ? format(date, 'PPP') : ''}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {reportData.length > 0 ? (
                        <ul className="space-y-2">
                            {reportData.map((item, index) => (
                                <li key={index} className="flex justify-between items-center p-2 rounded-md border">
                                    <span className="font-semibold">{item.guard}</span>
                                    <span>{item.location}</span>
                                    <span className="text-sm text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-muted-foreground">No check-ins recorded for this date.</p>
                    )}
                </div>
                 <Button onClick={() => window.print()} className="mt-4">Print Report</Button>
             </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
