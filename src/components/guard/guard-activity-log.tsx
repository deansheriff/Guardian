
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { LogIn, LogOut, UserCheck, History } from 'lucide-react';
import { User } from '@/lib/mock-data';

type Activity = {
  id: string;
  guardId: string;
  guard: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
};

// This should be fetched from a shared source in a real app
const mockActivities: Activity[] = [
    { id: '1', guardId: '2', guard: 'Guard One', type: 'Clock In', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: 'Success' },
    { id: '2', guardId: '2', guard: 'Guard One', type: 'Check-in', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), status: 'Success' },
    { id: '3', guardId: '3', guard: 'Guard Two', type: 'Clock In', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), status: 'Success' },
    { id: '4', guardId: '2', guard: 'Guard One', type: 'Check-in', timestamp: new Date().toISOString(), status: 'Success' },
    { id: '5', guardId: '3', guard: 'Guard Two', type: 'Clock Out', timestamp: new Date().toISOString(), status: 'Success' },
];


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
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            const userActivities = mockActivities
                .filter(a => a.guardId === parsedUser.id)
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            setActivities(userActivities);
        }
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
