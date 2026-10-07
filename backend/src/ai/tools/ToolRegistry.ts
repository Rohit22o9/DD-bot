import {
  Meal,
  Restaurant,
  UserProfile,
  UserPreferences,
  Order,
  Cart,
  WeeklyMealPlan,
  BudgetBasket,
  DayOfWeek,
  MealSlot,
  MealCategory,
  DropForMeResult,
  DropForMeMode,
  NegativeFeedback
} from '../../types';
import {
  DailyDropMealsAPI,
  DailyDropRestaurantAPI,
  DailyDropUserAPI,
  DailyDropOrdersAPI,
  DailyDropCartAPI,
  DailyDropAvailabilityAPI,
  DailyDropFeedbackAPI,
  MealSearchFilters,
  mockDailyDropAPI
} from '../../integrations/dailydrop';
import { recommendationEngine } from '../orchestrator/RecommendationEngine';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (params: any, context?: any) => Promise<any>;
}

export class ToolRegistry {
  private mealsAPI: DailyDropMealsAPI;
  private restaurantAPI: DailyDropRestaurantAPI;
  private userAPI: DailyDropUserAPI;
  private ordersAPI: DailyDropOrdersAPI;
  private cartAPI: DailyDropCartAPI;
  private availabilityAPI: DailyDropAvailabilityAPI;
  private feedbackAPI: DailyDropFeedbackAPI;
  private tools: Map<string, ToolDefinition> = new Map();

  constructor(
    mealsAPI: DailyDropMealsAPI = mockDailyDropAPI,
    restaurantAPI: DailyDropRestaurantAPI = mockDailyDropAPI,
    userAPI: DailyDropUserAPI = mockDailyDropAPI,
    ordersAPI: DailyDropOrdersAPI = mockDailyDropAPI,
    cartAPI: DailyDropCartAPI = mockDailyDropAPI,
    availabilityAPI: DailyDropAvailabilityAPI = mockDailyDropAPI,
    feedbackAPI: DailyDropFeedbackAPI = mockDailyDropAPI
  ) {
    this.mealsAPI = mealsAPI;
    this.restaurantAPI = restaurantAPI;
    this.userAPI = userAPI;
    this.ordersAPI = ordersAPI;
    this.cartAPI = cartAPI;
    this.availabilityAPI = availabilityAPI;
    this.feedbackAPI = feedbackAPI;

    this.registerAllTools();
  }

  // Allow swapping integration implementations cleanly
  setIntegrations(apis: {
    mealsAPI?: DailyDropMealsAPI;
    restaurantAPI?: DailyDropRestaurantAPI;
    userAPI?: DailyDropUserAPI;
    ordersAPI?: DailyDropOrdersAPI;
    cartAPI?: DailyDropCartAPI;
    availabilityAPI?: DailyDropAvailabilityAPI;
  }) {
    if (apis.mealsAPI) this.mealsAPI = apis.mealsAPI;
    if (apis.restaurantAPI) this.restaurantAPI = apis.restaurantAPI;
    if (apis.userAPI) this.userAPI = apis.userAPI;
    if (apis.ordersAPI) this.ordersAPI = apis.ordersAPI;
    if (apis.cartAPI) this.cartAPI = apis.cartAPI;
    if (apis.availabilityAPI) this.availabilityAPI = apis.availabilityAPI;
    this.registerAllTools();
  }

  // --- Individual Tool Methods ---

  async searchMeals(filters?: MealSearchFilters): Promise<Meal[]> {
    return this.mealsAPI.searchMeals(filters);
  }

  async getMeal(id: string): Promise<Meal | null> {
    return this.mealsAPI.getMeal(id);
  }

  async getRestaurant(id: string): Promise<Restaurant | null> {
    return this.restaurantAPI.getRestaurant(id);
  }

  async checkAvailability(mealId: string, day: DayOfWeek, slot: MealSlot): Promise<boolean> {
    return this.availabilityAPI.checkMealAvailability(mealId, day, slot);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userAPI.getUserProfile(userId);
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.userAPI.getUserPreferences(userId);
  }

  async getOrderHistory(userId: string, limit = 5): Promise<Order[]> {
    return this.ordersAPI.getOrderHistory(userId, limit);
  }

  async getFavoriteMeals(userId: string): Promise<Meal[]> {
    const history = await this.ordersAPI.getOrderHistory(userId, 10);
    const mealCounts = new Map<string, number>();
    for (const order of history) {
      for (const item of order.items) {
        mealCounts.set(item.mealId, (mealCounts.get(item.mealId) || 0) + item.quantity);
      }
    }
    const sortedMealIds = Array.from(mealCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    return this.mealsAPI.getMealsByIds(sortedMealIds);
  }

  async getCart(userId: string): Promise<Cart> {
    return this.cartAPI.getCart(userId);
  }

  async addToCart(
    userId: string,
    mealId: string,
    quantity = 1,
    slot: MealSlot = 'dinner',
    date = new Date().toISOString().split('T')[0]
  ): Promise<Cart> {
    return this.cartAPI.addToCart(userId, mealId, quantity, slot, date);
  }

  async removeFromCart(userId: string, mealId: string): Promise<Cart> {
    return this.cartAPI.removeFromCart(userId, mealId);
  }

  async updateCart(userId: string, mealId: string, quantity: number): Promise<Cart> {
    return this.cartAPI.updateCartItem(userId, mealId, quantity);
  }

  async clearCart(userId: string): Promise<Cart> {
    if ((this.cartAPI as any).clearCart) {
      return (this.cartAPI as any).clearCart(userId);
    }
    const cart = await this.getCart(userId);
    for (const item of cart.items) {
      await this.removeFromCart(userId, item.mealId);
    }
    return this.getCart(userId);
  }

  calculateCartTotal(items: any[]): Cart {
    return this.cartAPI.calculateCartTotal(items);
  }

  async buildBudgetBasket(
    userId: string,
    budgetCap = 20.0,
    slot: MealSlot = 'dinner'
  ): Promise<BudgetBasket | null> {
    const prefs = await this.getUserPreferences(userId);
    const excludedIngredients = [
      ...(prefs?.dislikedFoods || []),
      ...(prefs?.allergies || []),
    ];

    const mains = await this.searchMeals({
      category: 'main',
      slot,
      excludeIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
    });
    const sides = await this.searchMeals({
      category: 'side',
      slot,
      excludeIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
    });
    const drinks = await this.searchMeals({
      category: 'drink',
      slot,
      excludeIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
    });

    // Score mains based on preference
    const preferredCuisines = prefs?.favoriteCuisines || [];
    mains.sort((a, b) => {
      const aScore = (preferredCuisines.includes(a.cuisine) ? 2 : 0) + (a.price <= 13 ? 1 : 0);
      const bScore = (preferredCuisines.includes(b.cuisine) ? 2 : 0) + (b.price <= 13 ? 1 : 0);
      return bScore - aScore;
    });

    // Find a combination: 1 Main + 1 Side + 1 Drink <= budgetCap
    for (const main of mains) {
      const remainingForSideAndDrink = budgetCap - main.price;
      if (remainingForSideAndDrink < 5) continue;

      // Prefer sides and drinks from the same restaurant first
      const sameRestSides = sides.filter((s) => s.restaurantId === main.restaurantId);
      const otherSides = sides.filter((s) => s.restaurantId !== main.restaurantId);
      const candidateSides = [...sameRestSides, ...otherSides];

      const sameRestDrinks = drinks.filter((d) => d.restaurantId === main.restaurantId);
      const otherDrinks = drinks.filter((d) => d.restaurantId !== main.restaurantId);
      const candidateDrinks = [...sameRestDrinks, ...otherDrinks];

      for (const side of candidateSides) {
        for (const drink of candidateDrinks) {
          const total = Math.round((main.price + side.price + drink.price) * 100) / 100;
          if (total <= budgetCap) {
            return {
              main,
              side,
              drink,
              total,
              budgetCap,
              currency: 'USD',
              items: [
                { category: 'Meal', name: main.name, price: main.price, mealId: main.id },
                { category: 'Side', name: side.name, price: side.price, mealId: side.id },
                { category: 'Drink', name: drink.name, price: drink.price, mealId: drink.id },
              ],
            };
          }
        }
      }
    }

    return null;
  }

  async buildMealPlan(
    userId: string,
    options?: {
      targetBudget?: number;
      slot?: MealSlot;
      modifications?: {
        day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
        isVegetarian?: boolean;
        excludeKeywords?: string[];
        replaceMealId?: string;
      }[];
      isVegetarianFriday?: boolean;
      excludeKeywords?: string[];
    }
  ): Promise<WeeklyMealPlan> {
    const prefs = await this.getUserPreferences(userId);
    const targetBudget = options?.targetBudget || 65.0;
    const slot: MealSlot = options?.slot || 'dinner';
    const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];

    const excluded = [
      ...(prefs?.dislikedFoods || []),
      ...(prefs?.allergies || []),
      ...(options?.excludeKeywords || []),
    ];

    const allMains = await this.searchMeals({
      category: 'main',
      slot,
      excludeIngredients: excluded.length > 0 ? excluded : undefined,
    });

    const chosenDays: WeeklyMealPlan['days'] = [];
    const usedMealIds = new Set<string>();

    const dailyTarget = targetBudget / days.length;

    for (let i = 0; i < days.length; i++) {
      const dayName = days[i];
      const remainingDays = days.length - i;
      const currentSpent = chosenDays.reduce((sum, item) => sum + item.meal.price, 0);
      const remainingBudget = targetBudget - currentSpent;
      const maxAllowedPriceForDay = remainingDays > 1 ? remainingBudget / remainingDays + 2 : remainingBudget;

      const dayLower = dayName.toLowerCase() as DayOfWeek;
      const isFriday = dayName === 'Friday';
      const forceVegetarian =
        options?.isVegetarianFriday && isFriday;

      let candidateMains = allMains.filter((m) => m.availableDays.includes(dayLower));

      if (forceVegetarian) {
        candidateMains = candidateMains.filter((m) =>
          m.dietaryTags.some((t) => t.toLowerCase() === 'vegetarian' || t.toLowerCase() === 'vegan')
        );
      }

      // Check if user requested exclusion for specific keywords e.g. "salads"
      if (options?.excludeKeywords && options.excludeKeywords.length > 0) {
        candidateMains = candidateMains.filter(
          (m) =>
            !options.excludeKeywords!.some(
              (kw) =>
                m.name.toLowerCase().includes(kw.toLowerCase()) ||
                m.description.toLowerCase().includes(kw.toLowerCase())
            )
        );
      }

      // Filter out already used meals if possible to ensure variety
      let pool = candidateMains.filter((m) => !usedMealIds.has(m.id));
      if (pool.length === 0) pool = candidateMains;

      // Filter by maxAllowedPriceForDay if we need to stay within tight budget
      const withinBudgetPool = pool.filter((m) => m.price <= maxAllowedPriceForDay);
      if (withinBudgetPool.length > 0) {
        pool = withinBudgetPool;
      }

      // Sort by price if tight budget, otherwise balance favorite cuisine
      pool.sort((a, b) => {
        if (targetBudget <= 60) {
          return a.price - b.price;
        }
        const prefCuisines = prefs?.favoriteCuisines || [];
        const aFav = prefCuisines.includes(a.cuisine) ? 1 : 0;
        const bFav = prefCuisines.includes(b.cuisine) ? 1 : 0;
        return bFav - aFav || a.price - b.price;
      });

      const selectedMeal = pool[0] || allMains[0];
      usedMealIds.add(selectedMeal.id);

      chosenDays.push({
        day: dayName,
        slot,
        meal: selectedMeal,
        reason: forceVegetarian
          ? 'Vegetarian Friday selection'
          : `Curated ${selectedMeal.cuisine} dinner under budget ($${selectedMeal.price.toFixed(2)})`,
      });
    }

    const actualTotal = Math.round(
      chosenDays.reduce((sum, item) => sum + item.meal.price, 0) * 100
    ) / 100;

    return {
      id: `plan_${Date.now()}`,
      userId,
      days: chosenDays,
      targetBudget,
      actualTotal,
      currency: 'USD',
      isVegetarianFriday: options?.isVegetarianFriday,
      updatedAt: new Date().toISOString(),
    };
  }

  async dropForMe(userId: string, mode: DropForMeMode = 'safe', excludeMealIds: string[] = []): Promise<DropForMeResult> {
    const [allMeals, prefs, orders] = await Promise.all([
      this.mealsAPI.searchMeals(),
      this.userAPI.getUserPreferences(userId),
      this.ordersAPI.getOrderHistory(userId, 10),
    ]);
    return recommendationEngine.buildDropForMe(allMeals, prefs, mode, orders, excludeMealIds);
  }

  async recordFeedback(userId: string, mealId: string, reason: string): Promise<NegativeFeedback> {
    const meal = await this.mealsAPI.getMeal(mealId);
    const mealName = meal ? meal.name : mealId;
    const isTemp = reason.toLowerCase().includes('today') || reason.toLowerCase().includes('heavy');
    let code: any = 'not_in_mood';
    if (reason.toLowerCase().includes('expensive')) code = 'too_expensive';
    else if (reason.toLowerCase().includes('spicy')) code = 'too_spicy';
    else if (reason.toLowerCase().includes('heavy')) code = 'too_heavy';
    else if (reason.toLowerCase().includes('today')) code = 'not_today';
    else if (reason.toLowerCase().includes("don't like") || reason.toLowerCase().includes('dislike')) code = 'dislike_ingredient';

    return this.feedbackAPI.recordNegativeFeedback({
      userId,
      mealId,
      mealName,
      reasonCode: code,
      reasonLabel: reason,
      isTemporary: isTemp,
    });
  }

  async recordSwipe(userId: string, mealId: string, direction: 'right' | 'left', reason?: string): Promise<void> {
    return this.feedbackAPI.recordSwipe(userId, mealId, direction, reason);
  }

  async getFeedbackHistory(userId: string): Promise<NegativeFeedback[]> {
    return this.feedbackAPI.getNegativeFeedback(userId);
  }

  // --- Register Tool Schemas ---
  private registerAllTools() {
    this.tools.set('searchMeals', {
      name: 'searchMeals',
      description: 'Search available meals by cuisine, max budget, day, meal slot, or keywords.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term or protein name' },
          cuisine: { type: 'string', description: 'Cuisine type (e.g. Thai, Japanese, Mexican)' },
          maxPrice: { type: 'number', description: 'Maximum price limit in USD' },
          slot: { type: 'string', enum: ['lunch', 'dinner'], description: 'Meal slot' },
          day: { type: 'string', description: 'Day of the week (e.g. monday, friday)' },
          dietaryTags: { type: 'array', items: { type: 'string' } },
        },
      },
      execute: async (params) => this.searchMeals(params),
    });

    this.tools.set('getMeal', {
      name: 'getMeal',
      description: 'Get full details of a specific meal by ID.',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      execute: async ({ id }) => this.getMeal(id),
    });

    this.tools.set('getRestaurant', {
      name: 'getRestaurant',
      description: 'Get restaurant details by ID.',
      parameters: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
      execute: async ({ id }) => this.getRestaurant(id),
    });

    this.tools.set('checkAvailability', {
      name: 'checkAvailability',
      description: 'Check if a meal is available for ordering on a specific day and slot.',
      parameters: {
        type: 'object',
        properties: {
          mealId: { type: 'string' },
          day: { type: 'string' },
          slot: { type: 'string', enum: ['lunch', 'dinner'] },
        },
        required: ['mealId', 'day', 'slot'],
      },
      execute: async ({ mealId, day, slot }) => this.checkAvailability(mealId, day, slot),
    });

    this.tools.set('getUserProfile', {
      name: 'getUserProfile',
      description: 'Get user profile information.',
      parameters: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId'],
      },
      execute: async ({ userId }) => this.getUserProfile(userId),
    });

    this.tools.set('getUserPreferences', {
      name: 'getUserPreferences',
      description: 'Get explicit dietary preferences, allergies, liked cuisines, and disliked foods.',
      parameters: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId'],
      },
      execute: async ({ userId }) => this.getUserPreferences(userId),
    });

    this.tools.set('getOrderHistory', {
      name: 'getOrderHistory',
      description: 'Get previous orders of a user.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          limit: { type: 'number' },
        },
        required: ['userId'],
      },
      execute: async ({ userId, limit }) => this.getOrderHistory(userId, limit),
    });

    this.tools.set('getFavoriteMeals', {
      name: 'getFavoriteMeals',
      description: 'Get meals ordered frequently by the user in order of frequency.',
      parameters: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId'],
      },
      execute: async ({ userId }) => this.getFavoriteMeals(userId),
    });

    this.tools.set('getCart', {
      name: 'getCart',
      description: 'Retrieve current draft cart for a user.',
      parameters: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId'],
      },
      execute: async ({ userId }) => this.getCart(userId),
    });

    this.tools.set('addToCart', {
      name: 'addToCart',
      description: 'Add a meal to user draft cart.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mealId: { type: 'string' },
          quantity: { type: 'number' },
          slot: { type: 'string', enum: ['lunch', 'dinner'] },
          date: { type: 'string' },
        },
        required: ['userId', 'mealId'],
      },
      execute: async ({ userId, mealId, quantity, slot, date }) =>
        this.addToCart(userId, mealId, quantity, slot, date),
    });

    this.tools.set('removeFromCart', {
      name: 'removeFromCart',
      description: 'Remove a meal from cart.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mealId: { type: 'string' },
        },
        required: ['userId', 'mealId'],
      },
      execute: async ({ userId, mealId }) => this.removeFromCart(userId, mealId),
    });

    this.tools.set('updateCart', {
      name: 'updateCart',
      description: 'Update quantity of an item in cart.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mealId: { type: 'string' },
          quantity: { type: 'number' },
        },
        required: ['userId', 'mealId', 'quantity'],
      },
      execute: async ({ userId, mealId, quantity }) =>
        this.updateCart(userId, mealId, quantity),
    });

    this.tools.set('calculateCartTotal', {
      name: 'calculateCartTotal',
      description: 'Calculate subtotal, delivery fee, taxes, and total for items.',
      parameters: {
        type: 'object',
        properties: { items: { type: 'array' } },
        required: ['items'],
      },
      execute: async ({ items }) => this.calculateCartTotal(items),
    });

    this.tools.set('buildMealPlan', {
      name: 'buildMealPlan',
      description: 'Generate or modify a 5-day Monday to Friday weekly meal plan under budget.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          targetBudget: { type: 'number' },
          isVegetarianFriday: { type: 'boolean' },
          excludeKeywords: { type: 'array', items: { type: 'string' } },
        },
        required: ['userId'],
      },
      execute: async ({ userId, targetBudget, isVegetarianFriday, excludeKeywords }) =>
        this.buildMealPlan(userId, { targetBudget, isVegetarianFriday, excludeKeywords }),
    });

    this.tools.set('dropForMe', {
      name: 'dropForMe',
      description: 'Generate an instant recommended Drop meal or combo (Safe, Adventure, Budget, or Healthy).',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mode: { type: 'string', enum: ['safe', 'adventure', 'budget', 'healthy'] },
        },
        required: ['userId'],
      },
      execute: async ({ userId, mode }) => this.dropForMe(userId, mode),
    });

    this.tools.set('recordFeedback', {
      name: 'recordFeedback',
      description: 'Record user feedback on why they rejected/skipped a meal (e.g. too expensive, not today, dislike beef).',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mealId: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['userId', 'mealId', 'reason'],
      },
      execute: async ({ userId, mealId, reason }) => this.recordFeedback(userId, mealId, reason),
    });

    this.tools.set('recordSwipe', {
      name: 'recordSwipe',
      description: 'Record user swipe event (right for like, left for pass) with optional reason.',
      parameters: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          mealId: { type: 'string' },
          direction: { type: 'string', enum: ['right', 'left'] },
          reason: { type: 'string' },
        },
        required: ['userId', 'mealId', 'direction'],
      },
      execute: async ({ userId, mealId, direction, reason }) =>
        this.recordSwipe(userId, mealId, direction, reason),
    });

    this.tools.set('getFeedbackHistory', {
      name: 'getFeedbackHistory',
      description: 'Retrieve logged negative feedback for a user.',
      parameters: {
        type: 'object',
        properties: { userId: { type: 'string' } },
        required: ['userId'],
      },
      execute: async ({ userId }) => this.getFeedbackHistory(userId),
    });
  }

  getTool(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }
}

export const toolRegistry = new ToolRegistry();
