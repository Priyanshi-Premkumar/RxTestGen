'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving generated test cases based on user feedback.
 *
 * It exports:
 * - `improveGeneratedTestCases`: The main function to improve test cases.
 * - `ImproveTestCaseInput`: The input type for the function.
 * - `ImproveTestCaseOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTestCaseInputSchema = z.object({
  testCase: z.string().describe('The generated test case to improve.'),
  feedback: z.string().describe('Specific feedback or context for improvement.'),
  requirements: z.string().describe('The original healthcare software requirements.'),
});
export type ImproveTestCaseInput = z.infer<typeof ImproveTestCaseInputSchema>;

const ImproveTestCaseOutputSchema = z.object({
  improvedTestCase: z.string().describe('The improved test case based on the feedback.'),
  reasoning: z.string().describe('The AI reasoning behind the improvements.'),
});
export type ImproveTestCaseOutput = z.infer<typeof ImproveTestCaseOutputSchema>;

export async function improveGeneratedTestCases(input: ImproveTestCaseInput): Promise<ImproveTestCaseOutput> {
  return improveGeneratedTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveTestCasePrompt',
  input: {schema: ImproveTestCaseInputSchema},
  output: {schema: ImproveTestCaseOutputSchema},
  prompt: `You are an expert test case writer specializing in healthcare software.
  Given the original requirements, a generated test case, and user feedback, improve the test case to be more relevant, comprehensive, and compliant.
  Explain your reasoning for the changes.

  Original Requirements: {{{requirements}}}
  Generated Test Case: {{{testCase}}}
  User Feedback: {{{feedback}}}

  Improved Test Case:  (Provide the improved test case here)
  Reasoning: (Explain the changes and why they were made)
  `,
});

const improveGeneratedTestCasesFlow = ai.defineFlow(
  {
    name: 'improveGeneratedTestCasesFlow',
    inputSchema: ImproveTestCaseInputSchema,
    outputSchema: ImproveTestCaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
