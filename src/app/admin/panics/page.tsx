'use client';

import PanicLog from '@/components/admin/panic-log';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PanicAlertsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <Card>
            <CardHeader>
                <CardTitle>Panic Alert History</CardTitle>
                <CardDescription>A log of all panic alerts that have been triggered in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <PanicLog />
            </CardContent>
        </Card>
    </div>
  );
}