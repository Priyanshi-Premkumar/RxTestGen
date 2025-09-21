'use client';

import { FileUp, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type RequirementsInputProps = {
  requirements: string;
  setRequirements: (value: string) => void;
  onGenerate: (requirements: string) => Promise<void>;
  isLoading: boolean;
};

export function RequirementsInput({
  requirements,
  setRequirements,
  onGenerate,
  isLoading,
}: RequirementsInputProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Software Requirements</span>
        </CardTitle>
        <CardDescription>
          Enter the software requirements below or upload a document. The AI
          will generate test cases based on your input.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-2">
          <Label htmlFor="requirements" className="sr-only">
            Requirements
          </Label>
          <Textarea
            id="requirements"
            placeholder="e.g., The system must allow doctors to securely access patient records..."
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            rows={15}
            disabled={isLoading}
            className="text-base"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled={isLoading}>
          <FileUp className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
        <Button onClick={() => onGenerate(requirements)} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Test Cases
        </Button>
      </CardFooter>
    </Card>
  );
}
