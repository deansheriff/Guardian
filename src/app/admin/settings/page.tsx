"use client"

import { SettingsForm } from "@/components/guard/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Shift Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Shift Settings</CardTitle>
          <CardDescription>Configure guard shift settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}