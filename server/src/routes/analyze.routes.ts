import { Router, Request, Response } from 'express';
import { AnalyzeRequestSchema } from '../schemas/analysis.schema.js';
import { runDemoAnalysis } from '../services/demoEngine.js';
import { runLiveAnalysis } from '../services/liveAiEngine.js';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  // Input validation using Zod
  const parseResult = AnalyzeRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    const isLengthError = parseResult.error.issues.some((i) =>
      i.message.includes('5,000')
    );
    const errorMessage = parseResult.error.issues.map((i) => i.message).join(' ');

    res.status(isLengthError ? 413 : 400).json({
      success: false,
      error: errorMessage,
    });
    return;
  }

  const { message, forceDemo } = parseResult.data;

  const mode = process.env.ANALYSIS_MODE || 'demo';
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

  // If user requested demo mode explicitly or server is configured in demo mode or no key exists
  if (forceDemo || mode === 'demo' || !apiKey) {
    const analysis = runDemoAnalysis(message);
    res.status(200).json({
      success: true,
      analysis,
    });
    return;
  }

  // Attempt live AI analysis
  try {
    const analysis = await runLiveAnalysis(message, apiKey, modelName);
    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (err: unknown) {
    const error = err as Error;
    const isTimeout = error.message?.includes('timed out');
    const isSchemaError = error.message?.includes('schema validation') || error.message?.includes('malformed JSON');

    const statusCode = isTimeout ? 503 : isSchemaError ? 502 : 503;

    res.status(statusCode).json({
      success: false,
      error: error.message || 'Live AI analysis service failed.',
      canFallbackToDemo: true,
    });
  }
});

analyzeRouter.get('/health', (_req: Request, res: Response) => {
  const mode = process.env.ANALYSIS_MODE || 'demo';
  const hasKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);

  res.status(200).json({
    status: 'ok',
    mode: mode === 'live' && hasKey ? 'live' : 'demo',
    provider: mode === 'live' && hasKey ? 'Google Gemini' : 'Rule-based Demo Engine',
    timestamp: new Date().toISOString(),
  });
});
