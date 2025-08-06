'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/mock-data';
import { Building, UserCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useUser } from '@/context/user-context';
import { Location } from '@/lib/mock-data';

export function GuardHero() {
  const { user } = useUser();
  const [locationName, setLocationName] = useState('No location assigned');

  useEffect(() => {
    async function fetchLocation() {
      if (user && user.locationId) {
        const res = await fetch('/api/locations');
        const locations = await res.json();
        const location = locations.find((l: Location) => l.id === user.locationId);
        if (location) {
          setLocationName(location.name);
        }
      }
    }
    fetchLocation();
  }, [user]);

  if (!user) {
    return null; // Or a loading skeleton
  }

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome, {user.name}!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
            {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover border-2 border-primary-foreground/50" />
            ) : (
                <UserCircle className="h-16 w-16" />
            )}
            <div className='space-y-1'>
                <p className="text-lg font-semibold">{user.name}</p>
                <Badge variant="secondary" className="capitalize bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    {user.rank}
                </Badge>
            </div>
        </div>
        <div className="mt-6 border-t border-primary-foreground/20 pt-4">
             <div className="flex items-center gap-4">
                <Building className="h-8 w-8 text-primary-foreground/80" />
                <div>
                    <p className="text-xs text-primary-foreground/80">Assigned Location</p>
                    <p className="text-base font-medium">{locationName || 'No location assigned'}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}