import { AIProvider, AICompletionMessage } from './AIProvider';
import { ParsedIntent, Meal } from '../../types';

export class QwenProvider implements AIProvider {
  public name = 'QwenProvider';
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private explicitlyConfigured: boolean;

  constructor(options?: { baseUrl?: string; apiKey?: string; model?: string }) {
    let rawUrl = options?.baseUrl || process.env.QWEN_BASE_URL || 'http://localhost:11434/v1';
    rawUrl = rawUrl.replace(/\/+$/, ''); // Strip trailing slashes
    this.baseUrl = rawUrl;
    this.apiKey = options?.apiKey || process.env.QWEN_API_KEY || 'ollama';
    this.model = options?.model || process.env.QWEN_MODEL || 'qwen2.5:7b';
    this.explicitlyConfigured = Boolean(options?.baseUrl || options?.apiKey || options?.model);
  }

  isAvailable(): boolean {
    if (this.explicitlyConfigured) return true;
    const pref = (process.env.AI_PROVIDER || '').toLowerCase();
    if (pref === 'qwen') return true;
    if (process.env.QWEN_BASE_URL || process.env.QWEN_API_KEY) return true;
    return false;
  }

  async generateText(messages: AICompletionMessage[], temperature = 0.3): Promise<string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout for local inference

    try {
      const endpoint = this.baseUrl.endsWith('/chat/completions')
        ? this.baseUrl
        : `${this.baseUrl}/chat/completions`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Qwen API error (${res.status}): ${errText}`);
      }

      const data: any = await res.json();
      return data.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeout);
    }
  }

  async parseIntent(userInput: string, sessionContext?: any): Promise<ParsedIntent> {
    const prompt = `You are the Intent Parser for Drop AI, an intelligent food assistant for Daily Drop.
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

    const text = await this.generateText(
      [
        {
          role: 'system',
          content: 'You extract food assistant intent accurately into valid raw JSON without extra commentary.',
        },
        { role: 'user', content: prompt },
      ],
      0.1
    );

    try {
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse Qwen intent JSON: ${text.slice(0, 100)}`);
    }
  }

  async generateConversationalReply(
    userInput: string,
    meals: Meal[],
    userContext?: { userName?: string; dietPreferences?: string[]; allergies?: string[] }
  ): Promise<string> {
    if (meals.length === 0) return '';

    const mealSummaries = meals
      .slice(0, 4)
      .map(
        (m) =>
          `• ${m.name} ($${m.price.toFixed(2)}, ${m.cuisine}, ${m.calories} cal, ${m.proteinGrams}g protein, tags: ${m.dietaryTags.join(', ')})`
      )
      .join('\n');

    const prompt = `The user asked: "${userInput}".
Dietary preferences: ${userContext?.dietPreferences?.join(', ') || 'None specified'}.
Allergies: ${userContext?.allergies?.join(', ') || 'None'}.

Dishes selected from our kitchen:
${mealSummaries}

Write a natural, warm, thoughtful, 2 to 3 sentence GPT-style response:
- Answer directly with clear culinary reasoning (why these dishes fit their craving/nutrition).
- Do NOT ask repetitive survey questions (do NOT ask "what are you in the mood for?" or "what price works for you?").
- Act like an intelligent food expert who already picked the best options for them.`;

    try {
      const reply = await this.generateText(
        [
          {
            role: 'system',
            content:
              'You are Drop AI, an intelligent personal dining assistant for Daily Drop. You think like ChatGPT and provide thoughtful culinary reasoning directly.',
          },
          { role: 'user', content: prompt },
        ],
        0.5
      );

      return reply.trim();
    } catch (err) {
      console.warn('Qwen generateConversationalReply error:', err);
      return '';
    }
  }
}
