
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { LogIn, LogOut, UserCheck, History } from 'lucide-react';
import { User, Activity } from '@/lib/mock-data';

const ActivityIcon = ({ type }: { type: Activity['type']}) => {
    switch (type) {
        case 'Clock In':
            return <LogIn className="h-4 w-4 text-green-500" />;
        case 'Clock Out':
            return <LogOut className="h-4 w-4 text-red-500" />;
        case 'Check-in':
            return <UserCheck className="h-4 w-4 text-blue-500" />;
        default:
            return null;
    }
}

export function GuardActivityLog() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchActivities() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                
                const res = await fetch('/api/activities');
                const allActivities = await res.json();
                
                const userActivities = allActivities
                    .filter((a: Activity) => a.guardId === parsedUser.id)
                    .sort((a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                
                setActivities(userActivities);
            }
        }
        fetchActivities();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-6 w-6" />
                    My Activity Log
                </CardTitle>
                <CardDescription>A record of your recent shift activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length > 0 ? activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            <ActivityIcon type={activity.type} />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{activity.type}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <Badge variant={activity.status === 'Success' ? 'default' : 'destructive'} className={`text-xs ${activity.status === 'Success' ? 'bg-green-600/20 text-green-500 border-green-600/20' : ''}`}>
                                {activity.status}
                            </Badge>
                        </div>
                    )) : (
                        <p className="text-sm text-center text-muted-foreground py-8">No recent activity found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
