'use client';

import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TestCaseCard } from './test-case-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type TestCaseViewerProps = {
  testCases: string[];
  setTestCases: (testCases: string[]) => void;
  isLoading: boolean;
  requirements: string;
};

export function TestCaseViewer({
  testCases,
  setTestCases,
  isLoading,
  requirements,
}: TestCaseViewerProps) {
  const emptyStateImage = PlaceHolderImages.find(
    p => p.id === 'test-case-empty-state'
  )!;

  const handleExport = () => {
    const data = JSON.stringify({ requirements, testCases }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-cases.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateTestCase = (index: number, newText: string) => {
    const newTestCases = [...testCases];
    newTestCases[index] = newText;
    setTestCases(newTestCases);
  };

  const deleteTestCase = (index: number) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Generated Test Cases</CardTitle>
          <CardDescription>
            Review, edit, and export the generated test cases.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={testCases.length === 0 || isLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[520px] w-full pr-4">
          <div className="space-y-4">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full pt-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  Generating test cases...
                </p>
              </div>
            )}
            {!isLoading && testCases.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center h-full pt-16">
                <Image
                  src={emptyStateImage.imageUrl}
                  alt={emptyStateImage.description}
                  width={300}
                  height={200}
                  className="rounded-lg mb-4"
                  data-ai-hint={emptyStateImage.imageHint}
                />
                <h3 className="text-xl font-semibold">Ready to Test?</h3>
                <p className="text-muted-foreground">
                  Your generated test cases will appear here once you provide
                  the requirements.
                </p>
              </div>
            )}
            {testCases.map((testCase, index) => (
              <TestCaseCard
                key={index}
                index={index}
                testCase={testCase}
                requirements={requirements}
                onUpdate={updateTestCase}
                onDelete={deleteTestCase}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
