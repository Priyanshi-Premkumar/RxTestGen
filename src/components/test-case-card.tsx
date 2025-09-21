'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BrainCircuit, Info, Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  handleImproveTestCase,
  handleSummarizeCompliance,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

type TestCaseCardProps = {
  index: number;
  testCase: string;
  requirements: string;
  onUpdate: (index: number, newText: string) => void;
  onDelete: (index: number) => void;
};

export function TestCaseCard({
  index,
  testCase,
  requirements,
  onUpdate,
  onDelete,
}: TestCaseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(testCase);

  const [isImproving, setIsImproving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isImproveDialogOpen, setImproveDialogOpen] = useState(false);

  const [isComplianceLoading, setComplianceLoading] = useState(false);
  const [complianceSummary, setComplianceSummary] = useState('');

  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(index, editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(testCase);
    setIsEditing(false);
  };

  const handleImprove = async () => {
    if (!feedback.trim()) {
      toast({ variant: 'destructive', title: 'Feedback is required.' });
      return;
    }
    setIsImproving(true);
    try {
      const result = await handleImproveTestCase(
        testCase,
        feedback,
        requirements
      );
      onUpdate(index, result.improvedTestCase);
      toast({
        title: 'Test Case Improved',
        description: `Reasoning: ${result.reasoning}`,
      });
      setImproveDialogOpen(false);
      setFeedback('');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Improvement Failed',
        description: errorMessage,
      });
    } finally {
      setIsImproving(false);
    }
  };

  const fetchComplianceSummary = async (standard: 'HIPAA' | 'GDPR') => {
    setComplianceLoading(true);
    setComplianceSummary('');
    try {
      const result = await handleSummarizeCompliance(standard, testCase);
      setComplianceSummary(result.summary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Could not fetch summary',
        description: errorMessage,
      });
    } finally {
      setComplianceLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 transition-shadow hover:shadow-md">
      <CardContent className="p-4 pb-2">
        <div className="flex justify-between items-start gap-4">
          <p className="pt-1.5 text-sm font-semibold text-muted-foreground">
            Test Case #{index + 1}
          </p>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      Compliance Info
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get a summary of compliance standards for this test case.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchComplianceSummary('HIPAA')}
                    >
                      Summarize HIPAA
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchComplianceSummary('GDPR')}
                    >
                      Summarize GDPR
                    </Button>
                  </div>
                  {isComplianceLoading && (
                    <div className="flex justify-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                  {complianceSummary && (
                    <>
                      <Separator />
                      <p className="text-sm">{complianceSummary}</p>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Dialog
              open={isImproveDialogOpen}
              onOpenChange={setImproveDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <BrainCircuit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Improve Test Case with AI</DialogTitle>
                  <DialogDescription>
                    Provide feedback or context to help the AI refine this test
                    case.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <blockquote className="mt-2 border-l-2 pl-6 italic">
                    {testCase}
                  </blockquote>
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="e.g., 'Make this test case more specific to pediatric patients.'"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setImproveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleImprove} disabled={isImproving}>
                    {isImproving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Improve
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            rows={3}
            className="mt-2 w-full text-sm"
            autoFocus
          />
        ) : (
          <p
            className="mt-2 p-3 text-sm text-foreground whitespace-pre-wrap rounded-md hover:bg-muted/50 cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {testCase}
          </p>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
