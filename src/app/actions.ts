'use server';

import {
  generateTestCases,
  type GenerateTestCasesOutput,
} from '@/ai/flows/generate-test-cases-from-requirements';
import {
  improveGeneratedTestCases,
  type ImproveTestCaseOutput,
} from '@/ai/flows/improve-generated-test-cases';
import {
  summarizeComplianceStandard,
  type SummarizeComplianceStandardOutput,
} from '@/ai/flows/summarize-compliance-standards';

export async function handleGenerateTestCases(
  requirements: string
): Promise<GenerateTestCasesOutput> {
  try {
    const result = await generateTestCases({ requirements });
    return result;
  } catch (error) {
    console.error('Error generating test cases:', error);
    throw new Error('Failed to communicate with the AI model.');
  }
}

export async function handleImproveTestCase(
  testCase: string,
  feedback: string,
  requirements: string
): Promise<ImproveTestCaseOutput> {
  try {
    const result = await improveGeneratedTestCases({
      testCase,
      feedback,
      requirements,
    });
    return result;
  } catch (error) {
    console.error('Error improving test case:', error);
    throw new Error('Failed to communicate with the AI model.');
  }
}

export async function handleSummarizeCompliance(
  complianceStandard: string,
  requirementText: string
): Promise<SummarizeComplianceStandardOutput> {
  try {
    const result = await summarizeComplianceStandard({
      complianceStandard,
      requirementText,
    });
    return result;
  } catch (error) {
    console.error('Error summarizing compliance standard:', error);
    throw new Error('Failed to communicate with the AI model.');
  }
}
