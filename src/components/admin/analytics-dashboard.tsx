'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { supabase } from '@/lib/db';

export default function AnalyticsDashboard() {
  const [incidents, setIncidents] = useState<{ date: string; count: number }[]>([]);
  const [activities, setActivities] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch and process incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('incidents')
        .select('timestamp');
      if (incidentsError) {
        console.error('Error fetching incidents:', incidentsError);
      } else {
        const dailyIncidents = incidentsData.reduce((acc, report) => {
          const date = new Date(report.timestamp).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setIncidents(Object.entries(dailyIncidents).map(([date, count]) => ({ date, count })));
      }

      // Fetch and process activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('type');
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      } else {
        const activityCounts = activitiesData.reduce((acc, activity) => {
          acc[activity.type] = (acc[activity.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setActivities(Object.entries(activityCounts).map(([type, count]) => ({ type, count })));
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Daily Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="min-h-[200px] w-full">
            <BarChart data={incidents}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activity Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="min-h-[200px] w-full">
            <BarChart data={activities}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="type" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--secondary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}