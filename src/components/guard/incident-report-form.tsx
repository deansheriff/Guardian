"use client"

import React, { useState, useEffect } from 'react';
import { useIncidentReport } from '@/context/incident-report-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockUsers, User } from '@/lib/mock-data';

const IncidentReportForm = () => {
  const { addReport } = useIncidentReport();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport({
      guard: user?.name ?? "Unknown Guard",
      location,
      description,
    });
    setLocation('');
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Incident Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description of incident"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button type="submit">Submit Report</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentReportForm;