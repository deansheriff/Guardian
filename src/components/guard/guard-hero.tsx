'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Location } from '@/lib/types';
import { Building, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUser } from '@/context/user-context';
import { useData } from '@/context/data-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function GuardHero() {
  const { user } = useUser();
  const { locations } = useData();
  const [locationName, setLocationName] = useState('No location assigned');

  useEffect(() => {
    if (user && user.location_id) {
        const location = locations.find((l: Location) => l.id === user.location_id);
        if (location) {
            setLocationName(location.name);
        }
    }
  }, [user, locations]);

  if (!user) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
            <AvatarImage src={user.image_url} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <CardTitle className="text-2xl font-bold">Welcome, {user.name}!</CardTitle>
            <CardDescription>
                <Badge variant="secondary" className="capitalize">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    {user.rank}
                </Badge>
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
         <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <Building className="h-8 w-8 text-muted-foreground" />
            <div>
                <p className="text-xs text-muted-foreground">Current Assigned Location</p>
                <p className="text-base font-medium">{locationName || 'No location assigned'}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}