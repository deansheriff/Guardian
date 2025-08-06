"use client"

import { AddUserForm } from "@/components/admin/add-user-form";

export default function AddAdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Add New Admin</h2>
      <AddUserForm isAdmin={true} />
    </div>
  );
}