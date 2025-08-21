'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/admin/analytics-dashboard';
import { UserManagement } from '@/components/admin/user-management';
import { LocationManagement } from '@/components/admin/location-management';
import ShiftScheduler from '@/components/admin/shift-scheduler';
import ShiftDisplay from '@/components/admin/shift-display';
import IncidentReportLog from '@/components/admin/incident-report-log';
import ActiveGuardsList from '@/components/admin/active-guards-list';
import PanicLog from '@/components/admin/panic-log';
import { ReportGenerator } from '@/components/admin/report-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Today's Overview</CardTitle>
                    <CardDescription>A quick look at the current status.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ActiveGuardsList />
                </CardContent>
            </Card>
            <div className="col-span-full">
                <Tabs defaultValue="shifts">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="shifts">Shifts</TabsTrigger>
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="locations">Locations</TabsTrigger>
                        <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
                        <TabsTrigger value="panics">Panic Alerts</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="shifts">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <div className="lg:col-span-3">
                                <ShiftScheduler />
                            </div>
                            <div className="lg:col-span-4">
                                <ShiftDisplay />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="users">
                        <UserManagement />
                    </TabsContent>
                    <TabsContent value="locations">
                        <LocationManagement />
                    </TabsContent>
                    <TabsContent value="incidents">
                        <IncidentReportLog />
                    </TabsContent>
                    <TabsContent value="analytics">
                        <AnalyticsDashboard />
                    </TabsContent>
                    <TabsContent value="panics">
                        <PanicLog />
                    </TabsContent>
                </Tabs>
            </div>
             <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Report Generation</CardTitle>
                    <CardDescription>Generate and export system reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReportGenerator />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
