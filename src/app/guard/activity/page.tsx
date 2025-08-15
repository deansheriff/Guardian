"use client"

import { GuardActivityLog } from "@/components/guard/guard-activity-log";

export default function ActivityPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Activity Log</h2>
      <GuardActivityLog />
    </div>
  );
}