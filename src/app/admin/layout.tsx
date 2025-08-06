'use client';

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Settings,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PanicAlert from '@/components/admin/panic-alert';
import { DataProvider } from '@/context/data-context';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function checkSession() {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const { user } = await response.json();
            if (user.role !== 'admin') {
                router.push('/');
            } else {
                setUser(user);
            }
        } else {
            router.push('/');
        }
    }
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }


  if (!isClient || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          <h1 className="font-headline text-xl font-semibold">
            Guardian Angel
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut />
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <PanicAlert />
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </DataProvider>
  );
}
