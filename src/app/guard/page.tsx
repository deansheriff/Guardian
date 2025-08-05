import { Clock, UserCheck } from "lucide-react";
import { ClockWidget } from "@/components/guard/clock-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckInStatus } from "@/components/guard/check-in-status";
import { GuardActivityLog } from "@/components/guard/guard-activity-log";
import { GuardHero } from "@/components/guard/guard-hero";
 
 export default function GuardDashboardPage() {
   return (
     <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
             <h2 className="text-3xl font-bold tracking-tight font-headline">Guard Dashboard</h2>
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-3">
                <GuardHero />
            </div>
             <div className="lg:col-span-1 flex flex-col gap-4">
                 <ClockWidget />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Check-in Status
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       <CheckInStatus />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <GuardActivityLog />
            </div>
        </div>
    </div>
  );
}
