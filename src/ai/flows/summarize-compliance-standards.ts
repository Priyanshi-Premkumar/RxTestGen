// Summarize Compliance Standards
'use server';
/**
 * @fileOverview Summarizes a specific healthcare compliance standard in the context of a specific requirement.
 *
 * - summarizeComplianceStandard - A function that summarizes the compliance standard.
 * - SummarizeComplianceStandardInput - The input type for the summarizeComplianceStandard function.
 * - SummarizeComplianceStandardOutput - The return type for the summarizeComplianceStandard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeComplianceStandardInputSchema = z.object({
  complianceStandard: z
    .string()
    .describe('The healthcare compliance standard to summarize (e.g., HIPAA, GDPR).'),
  requirementText: z
    .string()
    .describe('The specific requirement to provide context for the summary.'),
});
export type SummarizeComplianceStandardInput = z.infer<
  typeof SummarizeComplianceStandardInputSchema
>;

const SummarizeComplianceStandardOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the specified compliance standard in the context of the given requirement.'
    ),
});
export type SummarizeComplianceStandardOutput = z.infer<
  typeof SummarizeComplianceStandardOutputSchema
>;

export async function summarizeComplianceStandard(
  input: SummarizeComplianceStandardInput
): Promise<SummarizeComplianceStandardOutput> {
  return summarizeComplianceStandardFlow(input);
}

const summarizeComplianceStandardPrompt = ai.definePrompt({
  name: 'summarizeComplianceStandardPrompt',
  input: {schema: SummarizeComplianceStandardInputSchema},
  output: {schema: SummarizeComplianceStandardOutputSchema},
  prompt: `You are an expert in healthcare compliance standards.

  Summarize the following compliance standard in the context of the given requirement.

  Compliance Standard: {{{complianceStandard}}}
  Requirement: {{{requirementText}}}

  Summary:`,
});

const summarizeComplianceStandardFlow = ai.defineFlow(
  {
    name: 'summarizeComplianceStandardFlow',
    inputSchema: SummarizeComplianceStandardInputSchema,
    outputSchema: SummarizeComplianceStandardOutputSchema,
  },
  async input => {
    const {output} = await summarizeComplianceStandardPrompt(input);
    return output!;
  }
);
