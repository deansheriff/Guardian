"use client"

import { LocationManagement } from "@/components/admin/location-management";

export default function LocationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Location Management</h2>
      <LocationManagement />
    </div>
  );
}