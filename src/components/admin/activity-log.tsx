'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/mock-data';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { useData } from '@/context/data-context';
import { Clock, LogIn, LogOut, UserCheck } from 'lucide-react';

type Activity = {
  id: string;
  guardId: string;
  guard: string;
  type: 'Clock In' | 'Clock Out' | 'Check-in';
  timestamp: string;
  status: 'Success' | 'Failed';
};

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
    const { users, activities } = useData();
    const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>({});
    
    useEffect(() => {
        const guards = users.filter((u: User) => u.role === 'guard');
        const sortedActivities = activities.sort((a: Activity, b: Activity) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const grouped: GroupedActivities = {};
        
        guards.forEach((guard: User) => {
            if (guard.id) {
                 grouped[guard.id] = {
                    guard,
                    activities: sortedActivities.filter((a: Activity) => a.guardId === guard.id)
                };
            }
        });

        setGroupedActivities(grouped);
    }, [users, activities]);

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