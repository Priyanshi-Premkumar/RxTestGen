"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { RequirementsInput } from '@/components/requirements-input';
import { TestCaseViewer } from '@/components/test-case-viewer';
import { handleGenerateTestCases } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [requirements, setRequirements] = useState<string>('');
  const [testCases, setTestCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const onGenerate = async (currentRequirements: string) => {
    if (!currentRequirements.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Requirements cannot be empty.',
      });
      return;
    }
    setIsLoading(true);
    setTestCases([]); // Clear previous test cases
    try {
      const result = await handleGenerateTestCases(currentRequirements);
      if (result.testCases && result.testCases.length > 0) {
        setTestCases(result.testCases);
        toast({
          title: 'Success',
          description: `${result.testCases.length} test cases generated.`,
        });
      } else {
        throw new Error(
          'The AI returned an empty result. Try rephrasing your requirements.'
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
      setTestCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <RequirementsInput
            requirements={requirements}
            setRequirements={setRequirements}
            onGenerate={onGenerate}
            isLoading={isLoading}
          />
          <TestCaseViewer
            testCases={testCases}
            setTestCases={setTestCases}
            isLoading={isLoading}
            requirements={requirements}
          />
        </div>
      </main>
    </div>
  );
}
