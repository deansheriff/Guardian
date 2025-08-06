"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings, Calendar } from 'lucide-react';

const navItems = [
  { href: '/guard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/guard/activity', label: 'Activity', icon: FileText },
  { href: '/guard/incidents', label: 'Incidents', icon: FileText },
  { href: '/guard/shifts', label: 'Shifts', icon: Calendar },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="grid h-16 grid-cols-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 text-xs font-medium">
            <Icon className={cn('h-6 w-6', pathname === href ? 'text-primary' : 'text-muted-foreground')} />
            <span className={cn(pathname === href ? 'text-primary' : 'text-muted-foreground')}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;