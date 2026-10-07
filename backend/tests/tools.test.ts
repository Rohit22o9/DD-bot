import { describe, it, expect, beforeEach } from 'vitest';
import { MockDailyDropAPI } from '../src/integrations/dailydrop/MockDailyDropAPI';
import { ToolRegistry } from '../src/ai/tools/ToolRegistry';
import { RecommendationEngine } from '../src/ai/orchestrator/RecommendationEngine';
import { SafetyValidator } from '../src/ai/orchestrator/SafetyValidator';

describe('Drop AI Core Tools & Integration Layer', () => {
  let mockAPI: MockDailyDropAPI;
  let tools: ToolRegistry;
  let recommender: RecommendationEngine;
  let safety: SafetyValidator;

  beforeEach(() => {
    mockAPI = new MockDailyDropAPI();
    tools = new ToolRegistry(mockAPI, mockAPI, mockAPI, mockAPI, mockAPI, mockAPI, mockAPI);
    recommender = new RecommendationEngine();
    safety = new SafetyValidator();
  });

  it('1. should search meals by keyword and cuisine', async () => {
    const results = await tools.searchMeals({ cuisine: 'Thai' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((m) => m.cuisine === 'Thai')).toBe(true);
  });

  it('2. should enforce budget filtering (meals <= $15)', async () => {
    const budgetResults = await tools.searchMeals({ maxPrice: 15.0 });
    expect(budgetResults.length).toBeGreaterThan(0);
    expect(budgetResults.every((m) => m.price <= 15.0)).toBe(true);
  });

  it('3. should verify availability filtering for day and slot', async () => {
    const isAvail = await tools.checkAvailability('meal_thai_basil_chicken', 'wednesday', 'dinner');
    expect(isAvail).toBe(true);

    const isRisottoDinnerOnly = await tools.checkAvailability('meal_wild_mushroom_risotto', 'wednesday', 'lunch');
    expect(isRisottoDinnerOnly).toBe(false); // Risotto is dinner only
  });

  it('4. should match preferences and produce transparent scores with reasons', async () => {
    const meal = await tools.getMeal('meal_thai_basil_chicken');
    expect(meal).toBeDefined();

    const userPrefs = await tools.getUserPreferences('user_alex');
    const scored = recommender.scoreMeal(meal!, userPrefs, {
      maxPrice: 15,
      targetProtein: 'chicken',
      spicyRequested: true,
    });

    expect(scored.score).toBeGreaterThanOrEqual(80);
    expect(scored.reasons).toBeInstanceOf(Array);
    expect(scored.reasons.length).toBeGreaterThan(1);
    expect(scored.reasons.some((r) => r.includes('Spicy'))).toBe(true);
    expect(scored.reasons.some((r) => r.includes('Under $15'))).toBe(true);
  });

  it('5. should strictly enforce explicit allergy and dislike exclusion', async () => {
    const allMeals = await tools.searchMeals();
    // Sam dislikes mushrooms and is allergic to peanuts
    const userPrefs = await tools.getUserPreferences('user_sam');

    const safeMeals = safety.filterSafeMeals(allMeals, userPrefs);

    // Ensure no mushroom meals exist in safeMeals
    const hasMushrooms = safeMeals.some(
      (m) =>
        m.ingredients.some((ing) => ing.toLowerCase().includes('mushroom')) ||
        m.name.toLowerCase().includes('mushroom')
    );
    expect(hasMushrooms).toBe(false);

    // Ensure no peanut meals exist in safeMeals
    const hasPeanuts = safeMeals.some((m) =>
      m.ingredients.some((ing) => ing.toLowerCase().includes('peanut'))
    );
    expect(hasPeanuts).toBe(false);
  });

  it('6. should retrieve order history and frequent favorite meals', async () => {
    const history = await tools.getOrderHistory('user_alex', 5);
    expect(history.length).toBeGreaterThan(0);

    const favorites = await tools.getFavoriteMeals('user_alex');
    expect(favorites.length).toBeGreaterThan(0);
    expect(favorites[0].id).toBe('meal_thai_basil_chicken');
  });

  it('7. should handle "order my usual" retrieval', async () => {
    const usual = await mockAPI.getUsualOrder('user_alex');
    expect(usual).toBeDefined();
    expect(usual?.isUsual).toBe(true);
    expect(usual?.items[0].mealName).toBe('Thai Basil Chicken');
  });

  it('8. should build a complete budget basket combo under budget cap ($20)', async () => {
    const basket = await tools.buildBudgetBasket('user_alex', 20.0, 'dinner');
    expect(basket).not.toBeNull();
    expect(basket?.main).toBeDefined();
    expect(basket?.side).toBeDefined();
    expect(basket?.drink).toBeDefined();
    expect(basket!.total).toBeLessThanOrEqual(20.0);
    expect(basket!.items.length).toBe(3);
  });

  it('9. should build weekly Monday-Friday meal plan under budget cap ($65)', async () => {
    const plan = await tools.buildMealPlan('user_alex', {
      targetBudget: 65.0,
      isVegetarianFriday: true,
    });

    expect(plan.days.length).toBe(5);
    expect(plan.actualTotal).toBeLessThanOrEqual(65.0);

    const fridayItem = plan.days.find((d) => d.day === 'Friday');
    expect(fridayItem).toBeDefined();
    expect(
      fridayItem?.meal.dietaryTags.some((t) => t === 'vegetarian' || t === 'vegan')
    ).toBe(true);
  });

  it('10. should construct cart and calculate subtotals and fees accurately', async () => {
    await mockAPI.clearCart('test_user');
    await tools.addToCart('test_user', 'meal_thai_basil_chicken', 2, 'dinner', '2026-09-18');
    const cart = await tools.getCart('test_user');

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.subtotal).toBe(26.0); // 2 * $13
    expect(cart.deliveryFee).toBe(2.49);
    expect(cart.total).toBe(Math.round((26.0 + 2.49 + 26.0 * 0.09) * 100) / 100);
  });

  it('11. should block order placement without explicit confirmation', async () => {
    await mockAPI.clearCart('test_user_confirm');
    await tools.addToCart('test_user_confirm', 'meal_thai_basil_chicken', 1, 'dinner', '2026-09-18');
    const cart = await tools.getCart('test_user_confirm');

    // Without explicit confirmation
    const unconfirmedCheck = safety.canPlaceOrder({
      isExplicitlyConfirmed: false,
      cart,
    });
    expect(unconfirmedCheck.allowed).toBe(false);
    expect(unconfirmedCheck.reason).toContain('Explicit user confirmation is required');

    // With explicit confirmation
    const confirmedCheck = safety.canPlaceOrder({
      isExplicitlyConfirmed: true,
      cart,
    });
    expect(confirmedCheck.allowed).toBe(true);
  });

  it('12. should generate Drop For Me across Safe, Adventure, Budget, and Healthy modes', async () => {
    const safeDrop = await tools.dropForMe('user_alex', 'safe');
    expect(safeDrop).toBeDefined();
    expect(safeDrop.mode).toBe('safe');
    expect(safeDrop.main).toBeDefined();
    expect(safeDrop.matchScore).toBeGreaterThanOrEqual(80);
    expect(safeDrop.reasons.length).toBeGreaterThan(0);

    const budgetDrop = await tools.dropForMe('user_alex', 'budget');
    expect(budgetDrop.mode).toBe('budget');
    expect(budgetDrop.main.price).toBeLessThanOrEqual(13.0);

    const healthyDrop = await tools.dropForMe('user_alex', 'healthy');
    expect(healthyDrop.mode).toBe('healthy');
    expect(healthyDrop.main).toBeDefined();

    const adventureDrop = await tools.dropForMe('user_alex', 'adventure');
    expect(adventureDrop.mode).toBe('adventure');
    expect(adventureDrop.main).toBeDefined();
  });

  it('13. should handle "Why Not?" negative feedback and distinguish temporary from persistent dislikes', async () => {
    // Temporary feedback: "Not today" or "Too heavy"
    const tempFb = await tools.recordFeedback('user_alex', 'meal_thai_basil_chicken', 'Not today');
    expect(tempFb.isTemporary).toBe(true);
    expect(tempFb.reasonCode).toBe('not_today');

    // User preferences should NOT have added this as a permanent dislike
    let prefs = await tools.getUserPreferences('user_alex');
    expect(prefs?.dislikedFoods.includes('Not today')).toBe(false);

    // Persistent feedback: "Don't like mushrooms"
    const permFb = await tools.recordFeedback('user_alex', 'meal_wild_mushroom_risotto', "Don't like mushrooms");
    expect(permFb.isTemporary).toBe(false);
    expect(permFb.reasonCode).toBe('dislike_ingredient');

    const history = await tools.getFeedbackHistory('user_alex');
    expect(history.length).toBe(2);
  });

  it('14. should record swipe interactions and update preferences', async () => {
    await tools.recordSwipe('user_alex', 'meal_spicy_tofu_pad_thai', 'right');
    const prefs = await tools.getUserPreferences('user_alex');
    expect(prefs?.favoriteCuisines.includes('Thai')).toBe(true);

    await tools.recordSwipe('user_alex', 'meal_spicy_katsu_chicken', 'left', 'Too expensive');
    const history = await tools.getFeedbackHistory('user_alex');
    expect(history.some((h) => h.reasonCode === 'too_expensive')).toBe(true);
  });
});
