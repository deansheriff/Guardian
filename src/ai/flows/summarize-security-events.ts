// Summarize Security Events
'use server';
/**
 * @fileOverview Summarizes unusual security events reported by security guards.
 *
 * - summarizeSecurityEvents - A function that summarizes security events.
 * - SummarizeSecurityEventsInput - The input type for the summarizeSecurityEvents function.
 * - SummarizeSecurityEventsOutput - The return type for the summarizeSecurityEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSecurityEventsInputSchema = z.object({
  events: z.string().describe('The unusual activity report from security guards.'),
});
export type SummarizeSecurityEventsInput = z.infer<typeof SummarizeSecurityEventsInputSchema>;

const SummarizeSecurityEventsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the unusual activity.'),
});
export type SummarizeSecurityEventsOutput = z.infer<typeof SummarizeSecurityEventsOutputSchema>;

export async function summarizeSecurityEvents(input: SummarizeSecurityEventsInput): Promise<SummarizeSecurityEventsOutput> {
  return summarizeSecurityEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSecurityEventsPrompt',
  input: {schema: SummarizeSecurityEventsInputSchema},
  output: {schema: SummarizeSecurityEventsOutputSchema},
  prompt: `You are a security expert summarizing unusual activity reports from security guards.
  Given the following report, provide a concise summary of the events.

  Report: {{{events}}}`,
});

const summarizeSecurityEventsFlow = ai.defineFlow(
  {
    name: 'summarizeSecurityEventsFlow',
    inputSchema: SummarizeSecurityEventsInputSchema,
    outputSchema: SummarizeSecurityEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
