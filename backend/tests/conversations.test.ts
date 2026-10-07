import { describe, it, expect, beforeEach } from 'vitest';
import { DropAIOrchestrator } from '../src/ai/orchestrator/Orchestrator';
import { MockDailyDropAPI } from '../src/integrations/dailydrop/MockDailyDropAPI';
import { ToolRegistry } from '../src/ai/tools/ToolRegistry';
import { HybridRuleProvider } from '../src/ai/providers/HybridRuleProvider';

describe('Drop AI: 20+ Realistic Test Conversations', () => {
  let orchestrator: DropAIOrchestrator;
  let mockAPI: MockDailyDropAPI;
  let tools: ToolRegistry;

  beforeEach(() => {
    mockAPI = new MockDailyDropAPI();
    tools = new ToolRegistry(mockAPI, mockAPI, mockAPI, mockAPI, mockAPI, mockAPI);
    orchestrator = new DropAIOrchestrator({
      aiProvider: new HybridRuleProvider(),
      tools,
    });
  });

  // Test 1: Decision reduction opening
  it('Conversation 1: "I don\'t know what to eat."', async () => {
    const res = await orchestrator.processMessage('user_alex', "I don't know what to eat.");
    expect(res.job).toBe('CHOOSE');
    expect(res.message).toContain("You've been having a lot of chicken and rice lately. Want something different?");
    expect(res.quickOptions).toEqual(['Something different', 'Healthy', 'Spicy', 'Surprise me']);
  });

  // Test 2: Quick option branch "Something different"
  it('Conversation 2: User responds "Something different"', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Something different');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
    expect(res.recommendations![0].meal.name).toBeDefined();
    expect(res.recommendations![0].score).toBeGreaterThan(60);
    expect(res.recommendations![0].reasons.length).toBeGreaterThan(0);
  });

  // Test 3: Core Example 2 - Protein, budget, date, slot extraction
  it('Conversation 3: "Find me a filling chicken meal under $15 for tomorrow dinner."', async () => {
    const res = await orchestrator.processMessage(
      'user_alex',
      'Find me a filling chicken meal under $15 for tomorrow dinner.'
    );
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.price).toBeLessThanOrEqual(15);
      const isChicken =
        rec.meal.ingredients.includes('chicken') ||
        rec.meal.name.toLowerCase().includes('chicken');
      expect(isChicken).toBe(true);
      expect(rec.reasons.some((r) => r.includes('Under $15') || r.includes('chicken'))).toBe(true);
    });
  });

  // Test 4: Core Example 3 - Order my usual (draft + confirmation safety)
  it('Conversation 4: "Order my usual."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Order my usual.');
    expect(res.job).toBe('ORDER');
    expect(res.message).toContain('Your usual is available');
    expect(res.usualOrder).toBeDefined();
    expect(res.confirmationRequired).toBe(true);
    expect(res.confirmationDetails?.action).toBe('PLACE_ORDER');
    // Ensure it did not automatically submit final order without confirmation
    expect(res.usualOrder?.status).not.toBe('submitted');
  });

  // Test 5: Core Example 4 - $20 Drop dinner combo construction
  it('Conversation 5: "I\'ve got $20. Make me a good dinner."', async () => {
    const res = await orchestrator.processMessage('user_alex', "I've got $20. Make me a good dinner.");
    expect(res.job).toBe('BUILD');
    expect(res.budgetBasket).toBeDefined();
    expect(res.budgetBasket?.total).toBeLessThanOrEqual(20);
    expect(res.budgetBasket?.items.length).toBe(3);
    expect(res.message).toContain('Your $20 Drop');
    expect(res.quickOptions).toContain('Add all to cart');
  });

  // Test 6: Core Example 5 - Weekly meal planning Monday-Friday under $65
  it('Conversation 6: "Sort my dinners Monday-Friday. Keep it under $65."', async () => {
    const res = await orchestrator.processMessage(
      'user_alex',
      'Sort my dinners Monday-Friday. Keep it under $65.'
    );
    expect(res.job).toBe('BUILD');
    expect(res.weeklyPlan).toBeDefined();
    expect(res.weeklyPlan?.days.length).toBe(5);
    expect(res.weeklyPlan!.actualTotal).toBeLessThanOrEqual(65);
  });

  // Test 7: Multi-turn meal plan modification - Change Wednesday
  it('Conversation 7: Multi-turn plan refinement "Change Wednesday"', async () => {
    await orchestrator.processMessage('user_alex', 'Sort my dinners Monday-Friday. Keep it under $65.');
    const res = await orchestrator.processMessage('user_alex', 'Change Wednesday');
    expect(res.job).toBe('BUILD');
    expect(res.weeklyPlan).toBeDefined();
    const wed = res.weeklyPlan?.days.find((d) => d.day === 'Wednesday');
    expect(wed?.reason).toContain('Updated');
  });

  // Test 8: Multi-turn meal plan modification - Make Friday vegetarian
  it('Conversation 8: "Make Friday vegetarian."', async () => {
    await orchestrator.processMessage('user_alex', 'Sort my dinners Monday-Friday. Keep it under $65.');
    const res = await orchestrator.processMessage('user_alex', 'Make Friday vegetarian.');
    expect(res.weeklyPlan).toBeDefined();
    const friday = res.weeklyPlan?.days.find((d) => d.day === 'Friday');
    expect(
      friday?.meal.dietaryTags.some((t) => t === 'vegetarian' || t === 'vegan')
    ).toBe(true);
  });

  // Test 9: Multi-turn meal plan modification - Remove salads
  it('Conversation 9: "Remove salads from my weekly dinners"', async () => {
    await orchestrator.processMessage('user_alex', 'Sort my dinners Monday-Friday. Keep it under $65.');
    const res = await orchestrator.processMessage('user_alex', 'Remove salads');
    expect(res.weeklyPlan).toBeDefined();
    const hasSalad = res.weeklyPlan?.days.some((d) =>
      d.meal.name.toLowerCase().includes('salad')
    );
    expect(hasSalad).toBe(false);
  });

  // Test 10: Multi-turn meal plan modification - Keep everything under $60
  it('Conversation 10: "Keep everything under $60."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Keep everything under $60.');
    expect(res.weeklyPlan).toBeDefined();
    expect(res.weeklyPlan?.targetBudget).toBe(60);
    expect(res.weeklyPlan!.actualTotal).toBeLessThanOrEqual(60);
  });

  // Test 11: Spicy filter under $15
  it('Conversation 11: "Give me something spicy under $15."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Give me something spicy under $15.');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.price).toBeLessThanOrEqual(15);
      expect(rec.meal.spicyLevel).toBeGreaterThan(0);
      expect(rec.reasons.some((r) => r.includes('Spicy'))).toBe(true);
    });
  });

  // Test 12: Explicit allergy/dislike exclusion ("I don't eat mushrooms")
  it('Conversation 12: User dislikes mushrooms - ensure exclusion', async () => {
    // Sam dislikes mushrooms
    const res = await orchestrator.processMessage('user_sam', 'Recommend a good dinner tonight.');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.ingredients).not.toContain('cremini mushrooms');
      expect(rec.meal.name.toLowerCase()).not.toContain('mushroom');
    });
  });

  // Test 13: High protein search
  it('Conversation 13: "Find high-protein meals under $16."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Find high-protein meals under $16.');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.price).toBeLessThanOrEqual(16);
    });
  });

  // Test 14: Mexican lunch
  it('Conversation 14: "Find a Mexican lunch under $14."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Find a Mexican lunch under $14.');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.cuisine.toLowerCase()).toBe('mexican');
      expect(rec.meal.price).toBeLessThanOrEqual(14);
    });
  });

  // Test 15: Quick choice "Healthy"
  it('Conversation 15: "Healthy"', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Healthy');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
  });

  // Test 16: Quick choice "Spicy"
  it('Conversation 16: "Spicy"', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Spicy');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.spicyLevel).toBeGreaterThan(0);
    });
  });

  // Test 17: "Surprise me"
  it('Conversation 17: "Surprise me"', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Surprise me');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
  });

  // Test 18: Re-order request via alternative phrasing
  it('Conversation 18: "Reorder previous dinner"', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Reorder previous dinner');
    expect(res.job).toBe('ORDER');
    expect(res.usualOrder).toBeDefined();
  });

  // Test 19: Explicit confirmation flow
  it('Conversation 19: "Confirm order" triggers order submission', async () => {
    // Add item to cart first
    await tools.addToCart('user_alex', 'meal_thai_basil_chicken', 1);
    const res = await orchestrator.processMessage('user_alex', 'Yes, confirm order');
    expect(res.job).toBe('ORDER');
    expect(res.message).toContain('Order confirmed');
    expect(res.confirmationRequired).toBe(false);
  });

  // Test 20: Vegetarian preferences strictly respected
  it('Conversation 20: "Find me dinner" for vegetarian persona Sam', async () => {
    const res = await orchestrator.processMessage('user_sam', 'Find me dinner under $15');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      // Must not contain meat ingredients
      expect(rec.meal.ingredients).not.toContain('chicken');
      expect(rec.meal.ingredients).not.toContain('beef');
      // Must not contain peanuts (Sam allergy)
      expect(rec.meal.ingredients).not.toContain('peanuts');
    });
  });

  // Test 21: Budget cap $12 tight query
  it('Conversation 21: "Give me options under $12."', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Give me options under $12.');
    expect(res.recommendations).toBeDefined();
    res.recommendations!.forEach((rec) => {
      expect(rec.meal.price).toBeLessThanOrEqual(12);
    });
  });

  // Test 22: "Drop for me" triggers 1-tap Drop For Me
  it('Conversation 22: "Drop for me" generates signature Drop with match score', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Drop for me');
    expect(res.job).toBe('BUILD');
    expect(res.dropForMe).toBeDefined();
    expect(res.dropForMe?.main).toBeDefined();
    expect(res.message).toContain("tonight's Drop");
    expect(res.quickOptions).toContain('Accept Drop');
  });

  // Test 23: "Adventure Drop" generates exploratory cuisine
  it('Conversation 23: "Adventure drop" explores exciting options', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Adventure drop');
    expect(res.job).toBe('BUILD');
    expect(res.dropForMe).toBeDefined();
    expect(res.dropForMe?.mode).toBe('adventure');
    expect(res.message).toContain('Adventure Drop');
  });

  // Test 24: "Accept Drop" drafts to cart
  it('Conversation 24: "Accept drop" moves Drop items into cart with confirmation modal', async () => {
    // Generate drop first
    await orchestrator.processMessage('user_alex', 'Budget drop');
    const res = await orchestrator.processMessage('user_alex', 'Accept drop');
    expect(res.job).toBe('ORDER');
    expect(res.draftCart).toBeDefined();
    expect(res.draftCart!.items.length).toBeGreaterThan(0);
    expect(res.confirmationRequired).toBe(true);
  });

  // Test 25: Wellness Meals filter via sessionState
  it('Conversation 25: Wellness filter (Weight Management) returns tailored wellness meals', async () => {
    const res = await orchestrator.processMessage(
      'user_alex',
      'Show weight-management options',
      { activeFilters: { wellness: 'weight-management' } }
    );
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
    expect(res.message).toContain('Weight Management');
  });

  // Test 26: Wellness Meals query (High Fibre / Gut Friendly)
  it('Conversation 26: High Fibre / Gut Friendly query returns tailored wellness meals', async () => {
    const res = await orchestrator.processMessage('user_alex', 'High fibre gut friendly dinner');
    expect(res.job).toBe('FIND');
    expect(res.recommendations).toBeDefined();
    expect(res.recommendations!.length).toBeGreaterThan(0);
    expect(res.message).toContain('High Fibre & Gut Friendly');
  });

  // Test 27: Ask for budget from customer (Srini feedback)
  it('Conversation 27: Inquiring about lunch asks customer for their budget', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Recommend lunch for today');
    expect(res.job).toBe('CHOOSE');
    expect(res.message).toContain("What's your budget for today's meal?");
    expect(res.message).toContain('Value Meal');
    expect(res.message).toContain('Premium Meal');
    expect(res.quickOptions).toContain('💚 Value (Under $15)');
    expect(res.quickOptions).toContain('⭐ Premium ($18+)');
  });

  // Test 28: Value meal combo creates cart with Biryani & AI-recommended Mirchi Ka Salan (Srini feedback)
  it('Conversation 28: Biryani value combo creates cart with Biryani and Mirchi Ka Salan', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Recommend biryani combo with side orders');
    expect(res.job).toBe('BUILD');
    expect(res.draftCart).toBeDefined();
    expect(res.draftCart!.items.length).toBe(2);
    expect(res.draftCart!.items.some((i) => i.meal.name.toLowerCase().includes('biryani'))).toBe(true);
    expect(res.draftCart!.items.some((i) => i.meal.name.toLowerCase().includes('mirchi ka salan'))).toBe(true);
    expect(res.message).toContain('Mirchi Ka Salan');
    expect(res.message).toContain('created your cart');
    expect(res.quickOptions).toContain('🔄 Swap Side');
    expect(res.confirmationRequired).toBe(true);
  });

  // Test 29: Customer swaps side in active combo before confirming
  it('Conversation 29: Customer swaps side from Mirchi Ka Salan to Salad before confirming', async () => {
    await orchestrator.processMessage('user_alex', 'Biryani combo');
    const res = await orchestrator.processMessage('user_alex', 'Swap side to salad');
    expect(res.job).toBe('BUILD');
    expect(res.draftCart).toBeDefined();
    expect(res.draftCart!.items.length).toBe(2);
    expect(res.draftCart!.items.some((i) => i.meal.name.toLowerCase().includes('salad'))).toBe(true);
    expect(res.message).toContain('Salad');
    expect(res.quickOptions).toContain('Confirm order');
  });

  // Test 30: Premium meal combo with gourmet main and side
  it('Conversation 30: Premium meal combo selects gourmet meal and side within budget', async () => {
    const res = await orchestrator.processMessage('user_alex', 'Premium ($18+)');
    expect(res.job).toBe('BUILD');
    expect(res.draftCart).toBeDefined();
    expect(res.draftCart!.items.length).toBe(2);
    expect(res.message).toContain('Premium Combo');
    expect(res.draftCart!.subtotal).toBeGreaterThan(15);
  });
});

