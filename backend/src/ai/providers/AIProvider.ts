import { ParsedIntent, PrimaryJob } from '../../types';

export interface AICompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  parseIntent(userInput: string, sessionContext?: any): Promise<ParsedIntent>;
  generateText(messages: AICompletionMessage[], temperature?: number): Promise<string>;
}
