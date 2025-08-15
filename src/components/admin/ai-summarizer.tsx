'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { summarizeSecurityEvents } from '@/ai/flows/summarize-security-events';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AiSummarizer() {
  const [report, setReport] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!report.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter a security report to summarize.',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const result = await summarizeSecurityEvents({ events: report });
      setSummary(result.summary);
      toast({
        title: 'Summary Generated',
        description: 'The report has been successfully summarized.',
      });
    } catch (error) {
      console.error('Error summarizing events:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'An error occurred while generating the summary.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Event Summarizer</CardTitle>
        <CardDescription>
          Paste an unusual activity report from a guard to get a quick, AI-powered summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the unusual activity in detail here..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={6}
          disabled={isLoading}
        />
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Generating...' : 'Summarize Events'}
        </Button>

        {(isLoading || summary) && (
            <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI Summary</AlertTitle>
                <AlertDescription>
                    {isLoading ? (
                       <div className="flex items-center space-x-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Analyzing report...</span>
                       </div>
                    ) : (
                        summary
                    )}
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
