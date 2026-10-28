import { z } from 'zod';

export const RiskLevelEnum = z.enum([
  'HIGH',
  'MEDIUM',
  'LOW',
  'INSUFFICIENT_INFORMATION'
]);

export type RiskLevel = z.infer<typeof RiskLevelEnum>;

export const WarningSignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  evidence: z.string().min(1, 'Evidence is required'),
  explanation: z.string().min(1, 'Explanation is required'),
});

export type WarningSign = z.infer<typeof WarningSignSchema>;

export const AnalysisResultSchema = z.object({
  riskLevel: RiskLevelEnum,
  summary: z.string().min(1, 'Summary is required'),
  warningSigns: z.array(WarningSignSchema),
  safeActions: z.array(z.string().min(1)).min(1, 'At least one safe action is required'),
  limitations: z.string().min(1, 'Limitations text is required'),
  mode: z.enum(['live', 'demo']),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export const AnalyzeRequestSchema = z.object({
  message: z
    .string({
      required_error: 'Please enter a message to analyse.',
      invalid_type_error: 'Message must be text.',
    })
    .trim()
    .min(1, 'Message cannot be empty or only whitespace.')
    .max(5000, 'Message cannot exceed 5,000 characters.'),
  forceDemo: z.boolean().optional(),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
