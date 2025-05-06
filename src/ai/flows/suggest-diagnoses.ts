// 'use server'
'use server';
/**
 * @fileOverview AI flow to analyze patient data and suggest potential diagnoses.
 *
 * - suggestDiagnoses - The main function to trigger the diagnosis suggestion flow.
 * - SuggestDiagnosesInput - Input type for the suggestDiagnoses function.
 * - SuggestDiagnosesOutput - Output type for the suggestDiagnoses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getVitalSigns} from '@/services/iot';

const SuggestDiagnosesInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient to analyze.'),
});
export type SuggestDiagnosesInput = z.infer<typeof SuggestDiagnosesInputSchema>;

const SuggestDiagnosesOutputSchema = z.object({
  suggestedDiagnoses: z
    .string()
    .describe('A list of potential diagnoses or risk factors for the patient.'),
});
export type SuggestDiagnosesOutput = z.infer<typeof SuggestDiagnosesOutputSchema>;

export async function suggestDiagnoses(input: SuggestDiagnosesInput): Promise<SuggestDiagnosesOutput> {
  return suggestDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDiagnosesPrompt',
  input: {schema: SuggestDiagnosesInputSchema},
  output: {schema: SuggestDiagnosesOutputSchema},
  prompt: `You are an AI assistant helping doctors by suggesting potential diagnoses and risk factors based on patient data.

  Analyze the patient's historical vital signs and consultation records to suggest potential diagnoses or risk factors.

  Patient ID: {{{patientId}}}
  Current Vital Signs: {{vitalSigns}}

  Provide a list of potential diagnoses or risk factors that the doctor should consider. Return the answer in one paragraph.
  `,
});

const suggestDiagnosesFlow = ai.defineFlow(
  {
    name: 'suggestDiagnosesFlow',
    inputSchema: SuggestDiagnosesInputSchema,
    outputSchema: SuggestDiagnosesOutputSchema,
  },
  async input => {
    const vitalSigns = await getVitalSigns(input.patientId);
    const {output} = await prompt({...input, vitalSigns});
    return output!;
  }
);
