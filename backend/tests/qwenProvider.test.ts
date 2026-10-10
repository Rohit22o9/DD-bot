import { describe, it, expect, vi } from 'vitest';
import { QwenProvider } from '../src/ai/providers/QwenProvider';

describe('QwenProvider Tests', () => {
  it('should initialize with default local Ollama configuration', () => {
    const qwen = new QwenProvider();
    expect(qwen.name).toBe('QwenProvider');
  });

  it('should be available if AI_PROVIDER is set to qwen or base url is configured', () => {
    const customQwen = new QwenProvider({ baseUrl: 'http://localhost:11434/v1', model: 'qwen2.5:7b' });
    expect(customQwen.isAvailable()).toBe(true);
  });

  it('should parse intent correctly from mock JSON response', async () => {
    const qwen = new QwenProvider({ baseUrl: 'http://localhost:11434/v1', model: 'qwen2.5:7b' });

    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              job: 'FIND',
              query: 'healthy chicken dinner',
              protein: 'chicken',
              cuisine: null,
              budgetCap: 15,
              mealSlot: 'dinner',
              targetDate: 'tonight',
              spicyFilter: false,
              healthyFilter: true,
              wellnessCategory: 'high-protein',
              dishKeyword: null,
              isUsualRequest: false,
              wantsBasket: false,
              wantsPlan: false,
              wantsDropForMe: false,
              requestedModifications: [],
              explicitConfirmation: false,
            }),
          },
        },
      ],
    };

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const intent = await qwen.parseIntent('healthy chicken dinner under $15');
    expect(intent.job).toBe('FIND');
    expect(intent.protein).toBe('chicken');
    expect(intent.budgetCap).toBe(15);
    expect(intent.healthyFilter).toBe(true);
  });

  it('should generate conversational culinary reasoning', async () => {
    const qwen = new QwenProvider({ baseUrl: 'http://localhost:11434/v1', model: 'qwen2.5:7b' });

    const mockText = 'I have selected our high-protein grilled chicken bowl and wok-tossed noodles, perfectly matching your post-workout dinner goals!';

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockText } }],
      }),
    } as any);

    const reply = await qwen.generateConversationalReply(
      'high protein food',
      [
        {
          id: 'meal_1',
          name: 'Grilled Chicken',
          price: 13,
          cuisine: 'Mediterranean',
          calories: 450,
          proteinGrams: 35,
          dietaryTags: ['High Protein'],
          ingredients: ['Chicken'],
          restaurantId: 'rest_1',
          restaurantName: 'Grill House',
          category: 'main',
          availableDays: ['monday'],
          availableSlots: ['dinner'],
          active: true,
        },
      ],
      { userName: 'Alex' }
    );

    expect(reply).toBe(mockText);
  });
});
