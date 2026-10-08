import { AIProvider, AICompletionMessage } from './AIProvider';
import { ParsedIntent, Meal } from '../../types';

export class GeminiProvider implements AIProvider {
  public name = 'GeminiProvider';
  private apiKey: string;
  private candidateModels = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    if (model) {
      this.candidateModels = [model, ...this.candidateModels.filter((m) => m !== model)];
    }
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText(messages: AICompletionMessage[], temperature = 0.4): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('GeminiProvider: GEMINI_API_KEY is not configured');
    }

    const systemMsg = messages.find((m) => m.role === 'system');
    const nonSystemMsgs = messages.filter((m) => m.role !== 'system');

    const contents = nonSystemMsgs.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (contents.length === 0 && systemMsg) {
      contents.push({ role: 'user', parts: [{ text: systemMsg.content }] });
    }

    const payload: any = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: 1024,
      },
    };

    if (systemMsg && nonSystemMsgs.length > 0) {
      payload.systemInstruction = {
        parts: [{ text: systemMsg.content }],
      };
    }

    let lastError: Error | null = null;

    // Try candidate models in order with timeout
    for (const model of this.candidateModels) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 9000);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Gemini API error (${res.status}) on ${model}: ${errText}`);
        }

        const data: any = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        // Proceed to next fallback model
      }
    }

    throw lastError || new Error('All Gemini models failed');
  }

  async parseIntent(userInput: string, sessionContext?: any): Promise<ParsedIntent> {
    if (!this.isAvailable()) {
      throw new Error('GeminiProvider: GEMINI_API_KEY is not configured');
    }

    const prompt = `You are the Intent Parser for Drop AI, an intelligent GPT-powered food dining assistant for Daily Drop.
Extract intent from the user query into this strict JSON format:
{
  "job": "FIND" | "CHOOSE" | "BUILD" | "ORDER",
  "query": string,
  "protein": string | null,
  "cuisine": string | null,
  "budgetCap": number | null,
  "mealSlot": "lunch" | "dinner" | null,
  "targetDate": string | null,
  "spicyFilter": boolean | null,
  "healthyFilter": boolean | null,
  "wellnessCategory": "high-protein" | "weight-management" | "high-fibre" | null,
  "dishKeyword": string | null,
  "isUsualRequest": boolean,
  "wantsBasket": boolean,
  "wantsPlan": boolean,
  "wantsDropForMe": boolean,
  "requestedModifications": string[],
  "explicitConfirmation": boolean
}
Return ONLY valid raw JSON with NO markdown formatting.
User Query: "${userInput}"`;

    const text = await this.generateText([
      { role: 'system', content: 'You extract food assistant intent accurately into valid raw JSON without extra commentary.' },
      { role: 'user', content: prompt },
    ], 0.1);

    try {
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Gemini intent JSON: ${text.slice(0, 100)}`);
    }
  }

  async generateConversationalReply(
    userInput: string,
    meals: Meal[],
    userContext?: { userName?: string; dietPreferences?: string[]; allergies?: string[] }
  ): Promise<string> {
    if (!this.isAvailable() || meals.length === 0) {
      return '';
    }

    const mealSummaries = meals
      .slice(0, 4)
      .map((m) => `• ${m.name} ($${m.price.toFixed(2)}, ${m.cuisine}, ${m.calories} cal, ${m.proteinGrams}g protein, tags: ${m.dietaryTags.join(', ')})`)
      .join('\n');

    const prompt = `The user asked: "${userInput}".
Dietary preferences: ${userContext?.dietPreferences?.join(', ') || 'None specified'}.
Allergies: ${userContext?.allergies?.join(', ') || 'None'}.

Dishes selected from our menu:
${mealSummaries}

Write a natural, warm, thoughtful, 2 to 3 sentence GPT-style response:
- Answer directly with clear culinary reasoning (why these dishes fit their craving/nutrition).
- Do NOT ask repetitive survey questions (do NOT ask "what are you in the mood for?" or "what price works for you?").
- Act like an intelligent food expert who already picked the best options for them.`;

    try {
      const reply = await this.generateText([
        {
          role: 'system',
          content: 'You are Drop AI, an intelligent personal dining assistant for Daily Drop. You think like ChatGPT and provide thoughtful culinary reasoning directly.',
        },
        { role: 'user', content: prompt },
      ], 0.6);

      return reply.trim();
    } catch (err) {
      console.warn('Gemini generateConversationalReply error:', err);
      return '';
    }
  }
}
