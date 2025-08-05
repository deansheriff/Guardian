import { Activity, FileText, Sparkles, SlidersHorizontal, Users, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityLog } from '@/components/admin/activity-log';
import { ReportGenerator } from '@/components/admin/report-generator';
import { SettingsForm } from '@/components/guard/settings-form';
import { UserManagement } from '@/components/admin/user-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationManagement } from '@/components/admin/location-management';

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
        </Tabs>
    </div>
  );
}
