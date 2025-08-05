'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockUsers, User } from '@/lib/mock-data';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Clock, LogIn, LogOut, UserCheck } from 'lucide-react';

type Activity = {
  id: string;
  guardId: string;
  guard: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
};

const mockActivities: Activity[] = [
    { id: '1', guardId: '2', guard: 'Guard One', type: 'Clock In', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: 'Success' },
    { id: '2', guardId: '2', guard: 'Guard One', type: 'Check-in', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), status: 'Success' },
    { id: '3', guardId: '3', guard: 'Guard Two', type: 'Clock In', timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), status: 'Success' },
    { id: '4', guardId: '2', guard: 'Guard One', type: 'Check-in', timestamp: new Date().toISOString(), status: 'Success' },
    { id: '5', guardId: '3', guard: 'Guard Two', type: 'Clock Out', timestamp: new Date().toISOString(), status: 'Success' },
];

type GroupedActivities = {
    [guardId: string]: {
        guard: User;
        activities: Activity[];
    };
};

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

export function ActivityLog() {
    const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});
    
    useEffect(() => {
        const users = getMockUsers();
        const guards = users.filter(u => u.role === 'guard');
        
        const sortedActivities = mockActivities.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const grouped: GroupedActivities = {};
        
        guards.forEach(guard => {
            if (guard.id) {
                 grouped[guard.id] = {
                    guard,
                    activities: sortedActivities.filter(a => a.guardId === guard.id)
                };
            }
        });

        // Add guards from activities who might not be in the main user list anymore
        sortedActivities.forEach(activity => {
            if (!grouped[activity.guardId]) {
                const guardUser = users.find(u => u.id === activity.guardId) || { id: activity.guardId, name: activity.guard, email: '', role: 'guard' };
                 grouped[activity.guardId] = {
                    guard: guardUser,
                    activities: [activity]
                }
            }
        });


        setGroupedActivities(grouped);
    }, []);

    const activeGuards = Object.values(groupedActivities).filter(g => g.activities.length > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Guard Activity Board</CardTitle>
                <CardDescription>A real-time kanban view of guard activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea>
                    <div className="flex gap-4 pb-4">
                        {activeGuards.map(({ guard, activities }) => (
                            <div key={guard.id} className="w-72 flex-shrink-0">
                                <Card className="bg-muted/50">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base flex justify-between items-center">
                                            {guard.name}
                                            <Badge variant="secondary" className="capitalize text-xs">{guard.role}</Badge>
                                        </CardTitle>
                                         {guard.shift && (
                                            <CardDescription className="flex items-center gap-2 text-xs pt-1">
                                                <Clock className="h-3 w-3" />
                                                {guard.shift.start} - {guard.shift.end}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 space-y-2 h-96 overflow-y-auto">
                                        {activities.map((activity) => (
                                            <Card key={activity.id} className="bg-background shadow-sm">
                                                <CardContent className="p-3 flex items-start gap-3">
                                                    <ActivityIcon type={activity.type} />
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm">{activity.type}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                                                    </div>
                                                     <Badge variant={activity.status === 'Success' ? 'default' : 'destructive'} className={`text-xs ${activity.status === 'Success' ? 'bg-green-600/20 text-green-500 border-green-600/20' : ''}`}>
                                                        {activity.status}
                                                    </Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}