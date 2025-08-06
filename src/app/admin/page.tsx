'use client';
import { Activity, FileText, Sparkles, SlidersHorizontal, Users, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityLog = dynamic(
    () => import('@/components/admin/activity-log').then(mod => mod.ActivityLog),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const ReportGenerator = dynamic(
    () => import('@/components/admin/report-generator').then(mod => mod.ReportGenerator),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const UserManagement = dynamic(
    () => import('@/components/admin/user-management').then(mod => mod.UserManagement),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const LocationManagement = dynamic(
    () => import('@/components/admin/location-management').then(mod => mod.LocationManagement),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const SettingsForm = dynamic(
    () => import('@/components/guard/settings-form').then(mod => mod.SettingsForm),
    { ssr: false, loading: () => <Skeleton className="h-[200px]" /> }
);

const IncidentReportLog = dynamic(
    () => import('@/components/admin/incident-report-log').then(mod => mod.default),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const ActiveGuardsList = dynamic(
    () => import('@/components/admin/active-guards-list').then(mod => mod.default),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const ShiftScheduler = dynamic(
    () => import('@/components/admin/shift-scheduler').then(mod => mod.default),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

const ShiftDisplay = dynamic(
    () => import('@/components/admin/shift-display').then(mod => mod.default),
    { ssr: false, loading: () => <Skeleton className="h-[400px]" /> }
);

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h2>
        </div>
        <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
                <TabsTrigger value="activity">
                    <Activity className="mr-2 h-4 w-4" /> Activity Log
                </TabsTrigger>
                <TabsTrigger value="reports">
                    <FileText className="mr-2 h-4 w-4" /> Reports
                </TabsTrigger>
                <TabsTrigger value="user-management">
                    <Users className="mr-2 h-4 w-4" /> User Management
                </TabsTrigger>
                 <TabsTrigger value="locations">
                    <MapPin className="mr-2 h-4 w-4" /> Locations
                </TabsTrigger>
                <TabsTrigger value="settings">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Shift Settings
                </TabsTrigger>
                <TabsTrigger value="incident-reports">
                    <FileText className="mr-2 h-4 w-4" /> Incident Reports
                </TabsTrigger>
                <TabsTrigger value="active-guards">
                    <Users className="mr-2 h-4 w-4" /> Active Guards
                </TabsTrigger>
                <TabsTrigger value="shifts">
                    <SlidersHorizontal className="mr-2 h-4 w-4" /> Shifts
                </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4">
                <ActivityLog />
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
                <ReportGenerator />
            </TabsContent>
             <TabsContent value="user-management" className="space-y-4">
                <UserManagement />
            </TabsContent>
            <TabsContent value="locations" className="space-y-4">
                <LocationManagement />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Shift Settings</CardTitle>
                        <CardDescription>Configure guard shift settings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <SettingsForm />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="incident-reports" className="space-y-4">
                <IncidentReportLog />
            </TabsContent>
            <TabsContent value="active-guards" className="space-y-4">
                <ActiveGuardsList />
            </TabsContent>
            <TabsContent value="shifts" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <ShiftScheduler />
                    <ShiftDisplay />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
