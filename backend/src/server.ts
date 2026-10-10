import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Drop AI Standalone Backend running on http://localhost:${PORT}`);
  console.log(`📡 Clean integration layer initialized: MockDailyDropAPI active`);
  const providerLog = (process.env.AI_PROVIDER || '').toLowerCase() === 'qwen' || process.env.QWEN_BASE_URL
    ? 'QwenProvider (Local / Self-Hosted Qwen Active 🦙)'
    : process.env.GEMINI_API_KEY
    ? 'GeminiProvider (Google Gemini Active ✨)'
    : process.env.OPENAI_API_KEY
    ? 'OpenAIProvider'
    : 'HybridRuleProvider (Offline Fallback)';
  console.log(`🤖 AI Provider: ${providerLog}`);
});
