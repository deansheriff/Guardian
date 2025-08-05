'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const settingsFormSchema = z.object({
  frequency: z.enum(['30', '60', '120'], {
    required_error: 'You need to select a notification frequency.',
  }),
});

export function SettingsForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
  });

  useEffect(() => {
    const savedFrequency = localStorage.getItem('checkinFrequency') || '60';
    form.setValue('frequency', savedFrequency as '30' | '60' | '120');
  }, [form]);

  function onSubmit(data: z.infer<typeof settingsFormSchema>) {
    localStorage.setItem('checkinFrequency', data.frequency);
    toast({
      title: 'Settings Saved',
      description: `Your check-in prompt frequency has been set to every ${data.frequency} minutes.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Check-in Prompt Frequency</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="30" />
                    </FormControl>
                    <FormLabel className="font-normal">Every 30 minutes</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="60" />
                    </FormControl>
                    <FormLabel className="font-normal">Every 60 minutes (Recommended)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="120" />
                    </FormControl>
                    <FormLabel className="font-normal">Every 120 minutes</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
        </Button>
      </form>
    </Form>
  );
}
