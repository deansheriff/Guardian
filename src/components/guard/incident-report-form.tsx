'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useIncidentReport } from '@/context/incident-report-context';
import { useUser } from '@/context/user-context';
import { useData } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FileWarning, Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  severity: z.enum(['low', 'medium', 'high'], { required_error: 'You must select a severity level.' }),
});

export function IncidentReportForm() {
  const { toast } = useToast();
  const { addReport } = useIncidentReport();
  const { user } = useUser();
  const { locations } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      severity: 'low',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'You must be logged in to submit a report.',
        });
        setIsSubmitting(false);
        return;
    }
    const location = locations.find(l => l.id === user.location_id);
    
    // This is a mock API call, replace with your actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));

    addReport({
      guardName: user.name,
      location: location ? location.name : 'Unknown',
      description: values.description,
      severity: values.severity,
      status: 'Open',
    });
    
    toast({
      title: 'Report Submitted',
      description: 'Your incident report has been successfully submitted.',
    });
    form.reset();
    setIsSubmitting(false);
  }
  

  return (
    <Card>
        <CardHeader>
            <CardTitle>File an Incident Report</CardTitle>
            <CardDescription>Describe the event in detail. This will be sent to the administrators immediately.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description of Incident</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Provide a detailed description of the incident, including times, people involved, and actions taken."
                        className="resize-y min-h-[120px]"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Severity Level</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="low" />
                                </FormControl>
                                <FormLabel className="font-normal">Low</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="medium" />
                                </FormControl>
                                <FormLabel className="font-normal">Medium</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="high" />
                                </FormControl>
                                <FormLabel className="font-normal">High</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileWarning className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

export default IncidentReportForm;