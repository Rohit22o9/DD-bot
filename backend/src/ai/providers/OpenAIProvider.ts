import { AIProvider, AICompletionMessage } from './AIProvider';
import { ParsedIntent } from '../../types';

export class OpenAIProvider implements AIProvider {
  public name = 'OpenAIProvider';
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    this.model = model || process.env.AI_MODEL || 'gpt-4o-mini';
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText(messages: AICompletionMessage[], temperature = 0.3): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${errorText}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async parseIntent(userInput: string, sessionContext?: any): Promise<ParsedIntent> {
    if (!this.isAvailable()) {
      throw new Error('OpenAIProvider: OPENAI_API_KEY is not configured');
    }

    const prompt = `You are the Intent Parser for Drop AI, a food delivery assistant for Daily Drop.
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
  "isUsualRequest": boolean,
  "wantsBasket": boolean,
  "wantsPlan": boolean,
  "requestedModifications": string[],
  "explicitConfirmation": boolean
}
Return ONLY valid JSON.
User Query: "${userInput}"`;

    const text = await this.generateText([
      { role: 'system', content: 'You extract food assistant intent accurately.' },
      { role: 'user', content: prompt },
    ]);

    try {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      throw new Error('Failed to parse OpenAI intent JSON');
    }
  }
}
