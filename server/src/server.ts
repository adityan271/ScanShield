import dotenv from 'dotenv';
dotenv.config();

import { app } from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const mode = process.env.ANALYSIS_MODE || 'demo';
  const hasKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
  console.log(`[ScamShield Server] Running on http://localhost:${PORT}`);
  console.log(`[ScamShield Server] Analysis Mode: ${mode} (API Key Configured: ${hasKey})`);
});
