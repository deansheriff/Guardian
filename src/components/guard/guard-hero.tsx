'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockLocations, User } from '@/lib/mock-data';
import { Building, UserCircle } from 'lucide-react';

export function GuardHero() {
  const [user, setUser] = useState<User | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.locationId) {
        const locations = getMockLocations();
        const userLocation = locations.find(loc => loc.id === parsedUser.locationId);
        if (userLocation) {
          setLocationName(userLocation.name);
        }
      }
    }
  }, []);

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
            <UserCircle className="h-10 w-10" />
            <div>
                <p className="text-sm text-primary-foreground/80">You are on duty</p>
                <p className="text-lg font-semibold">{user.name}</p>
            </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
            <Building className="h-10 w-10" />
            <div>
                <p className="text-sm text-primary-foreground/80">Assigned Location</p>
                <p className="text-lg font-semibold">{locationName || 'No location assigned'}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}