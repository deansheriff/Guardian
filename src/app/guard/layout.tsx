'use client';

import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useActiveGuards } from '@/context/active-guards-context';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BottomNav from '@/components/guard/bottom-nav';
import { UserProvider, useUser } from '@/context/user-context';

function GuardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();
  const { removeActiveGuard } = useActiveGuards();

  useEffect(() => {
    if (!loading && !user) {
        router.push('/');
    }
    if (!loading && user && user.role !== 'guard') {
        router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    if (user) {
      removeActiveGuard(user.id);
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <ShieldCheck />
            </div>
            <h1 className="font-headline text-xl font-semibold">
              Guardian Angel
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/guard">
                <SidebarMenuButton isActive>
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
           <SidebarMenuItem>
             <Link href="/guard/shifts">
               <SidebarMenuButton>
                 <Calendar />
                 Shifts
               </SidebarMenuButton>
             </Link>
           </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.image_url} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="mb-16 md:mb-0">{children}</main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function GuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <GuardLayoutContent>{children}</GuardLayoutContent>
    </UserProvider>
  );
}
