"use client"

import { UserManagement } from "@/components/admin/user-management";

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">User Management</h2>
      <UserManagement />
    </div>
  );
}