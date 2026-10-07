import {
  Meal,
  Restaurant,
  UserProfile,
  UserPreferences,
  Order,
  Cart,
  CartItem,
  DayOfWeek,
  MealSlot,
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
  MealSearchFilters
} from './interfaces';
import {
  MOCK_MEALS,
  MOCK_RESTAURANTS,
  MOCK_USERS,
  MOCK_ORDER_HISTORIES
} from './mockData';

export class MockDailyDropAPI
  implements
    DailyDropMealsAPI,
    DailyDropRestaurantAPI,
    DailyDropUserAPI,
    DailyDropOrdersAPI,
    DailyDropCartAPI,
    DailyDropAvailabilityAPI,
    DailyDropFeedbackAPI
{
  private meals: Meal[];
  private restaurants: Restaurant[];
  private users: Record<string, UserProfile>;
  private orderHistories: Record<string, Order[]>;
  private carts: Map<string, Cart>;
  private negativeFeedbacks: Map<string, NegativeFeedback[]> = new Map();

  constructor() {
    // Clone mock data so in-memory mutations don't alter base definitions
    this.meals = JSON.parse(JSON.stringify(MOCK_MEALS));
    this.restaurants = JSON.parse(JSON.stringify(MOCK_RESTAURANTS));
    this.users = JSON.parse(JSON.stringify(MOCK_USERS));
    this.orderHistories = JSON.parse(JSON.stringify(MOCK_ORDER_HISTORIES));
    this.carts = new Map<string, Cart>();
  }

  // --- Meals API ---
  async searchMeals(filters?: MealSearchFilters): Promise<Meal[]> {
    let result = this.meals.filter((m) => m.active);

    if (!filters) return result;

    const searchTarget = filters.query || filters.keyword;
    if (searchTarget) {
      const q = searchTarget.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.cuisine.toLowerCase().includes(q) ||
          m.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    if (filters.cuisine) {
      const c = filters.cuisine.toLowerCase();
      result = result.filter((m) => m.cuisine.toLowerCase() === c);
    }

    if (filters.category) {
      result = result.filter((m) => m.category === filters.category);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((m) => m.price <= filters.maxPrice!);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((m) => m.price >= filters.minPrice!);
    }

    if (filters.day) {
      result = result.filter((m) => m.availableDays.includes(filters.day!));
    }

    if (filters.slot) {
      result = result.filter((m) => m.availableSlots.includes(filters.slot!));
    }

    if (filters.dietaryTags && filters.dietaryTags.length > 0) {
      result = result.filter((m) =>
        filters.dietaryTags!.every((tag) =>
          m.dietaryTags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
        )
      );
    }

    if (filters.excludeIngredients && filters.excludeIngredients.length > 0) {
      const excluded = filters.excludeIngredients.map((e) => e.toLowerCase());
      result = result.filter((m) =>
        !m.ingredients.some((ing) =>
          excluded.some((ex) => ing.toLowerCase().includes(ex))
        )
      );
    }

    if (filters.spicyLevel !== undefined) {
      result = result.filter((m) => m.spicyLevel === filters.spicyLevel);
    }

    if (filters.restaurantId) {
      result = result.filter((m) => m.restaurantId === filters.restaurantId);
    }

    return result;
  }

  async getMeal(id: string): Promise<Meal | null> {
    const meal = this.meals.find((m) => m.id === id);
    return meal ? { ...meal } : null;
  }

  async getMealsByIds(ids: string[]): Promise<Meal[]> {
    return this.meals.filter((m) => ids.includes(m.id));
  }

  // --- Restaurant API ---
  async getRestaurant(id: string): Promise<Restaurant | null> {
    const rest = this.restaurants.find((r) => r.id === id);
    return rest ? { ...rest } : null;
  }

  async listRestaurants(): Promise<Restaurant[]> {
    return this.restaurants.filter((r) => r.active);
  }

  // --- Availability API ---
  async checkMealAvailability(mealId: string, day: DayOfWeek, slot: MealSlot): Promise<boolean> {
    const meal = await this.getMeal(mealId);
    if (!meal || !meal.active) return false;
    const hasDay = meal.availableDays.includes(day);
    const hasSlot = meal.availableSlots.includes(slot);
    return hasDay && hasSlot;
  }

  // --- User & Preferences API ---
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = this.users[userId];
    return user ? JSON.parse(JSON.stringify(user)) : null;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const user = this.users[userId];
    return user ? JSON.parse(JSON.stringify(user.preferences)) : null;
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    if (!this.users[userId]) {
      this.users[userId] = {
        id: userId,
        name: 'Guest User',
        email: `${userId}@example.com`,
        preferences: {
          favoriteCuisines: [],
          dislikedFoods: [],
          dietaryPreferences: [],
          allergies: [],
          preferredPriceRange: { min: 5, max: 25 },
          spicyPreference: 'any',
          healthyPreference: false,
          favoriteRestaurants: [],
        },
      };
    }

    this.users[userId].preferences = {
      ...this.users[userId].preferences,
      ...preferences,
    };
    return JSON.parse(JSON.stringify(this.users[userId].preferences));
  }

  async addPreferenceItem(
    userId: string,
    category: 'cuisines' | 'dislikes' | 'dietary' | 'allergies' | 'restaurants',
    value: string
  ): Promise<UserPreferences> {
    const prefs = (await this.getUserPreferences(userId)) || {
      favoriteCuisines: [],
      dislikedFoods: [],
      dietaryPreferences: [],
      allergies: [],
      preferredPriceRange: { min: 5, max: 25 },
      spicyPreference: 'any',
      healthyPreference: false,
      favoriteRestaurants: [],
    };

    const cleanVal = value.trim();
    if (!cleanVal) return prefs;

    if (category === 'cuisines' && !prefs.favoriteCuisines.includes(cleanVal)) {
      prefs.favoriteCuisines.push(cleanVal);
    } else if (category === 'dislikes' && !prefs.dislikedFoods.includes(cleanVal)) {
      prefs.dislikedFoods.push(cleanVal.toLowerCase());
    } else if (category === 'dietary' && !prefs.dietaryPreferences.includes(cleanVal)) {
      prefs.dietaryPreferences.push(cleanVal.toLowerCase());
    } else if (category === 'allergies' && !prefs.allergies.includes(cleanVal)) {
      // Explicit allergy addition
      prefs.allergies.push(cleanVal.toLowerCase());
    } else if (category === 'restaurants' && !prefs.favoriteRestaurants.includes(cleanVal)) {
      prefs.favoriteRestaurants.push(cleanVal);
    }

    return this.updateUserPreferences(userId, prefs);
  }

  async removePreferenceItem(
    userId: string,
    category: 'cuisines' | 'dislikes' | 'dietary' | 'allergies' | 'restaurants',
    value: string
  ): Promise<UserPreferences> {
    const prefs = await this.getUserPreferences(userId);
    if (!prefs) throw new Error('User not found');

    const cleanVal = value.trim().toLowerCase();

    if (category === 'cuisines') {
      prefs.favoriteCuisines = prefs.favoriteCuisines.filter((c) => c.toLowerCase() !== cleanVal);
    } else if (category === 'dislikes') {
      prefs.dislikedFoods = prefs.dislikedFoods.filter((d) => d.toLowerCase() !== cleanVal);
    } else if (category === 'dietary') {
      prefs.dietaryPreferences = prefs.dietaryPreferences.filter((d) => d.toLowerCase() !== cleanVal);
    } else if (category === 'allergies') {
      prefs.allergies = prefs.allergies.filter((a) => a.toLowerCase() !== cleanVal);
    } else if (category === 'restaurants') {
      prefs.favoriteRestaurants = prefs.favoriteRestaurants.filter((r) => r.toLowerCase() !== cleanVal);
    }

    return this.updateUserPreferences(userId, prefs);
  }

  // --- Orders API ---
  async getOrderHistory(userId: string, limit = 5): Promise<Order[]> {
    const list = this.orderHistories[userId] || [];
    return JSON.parse(JSON.stringify(list.slice(0, limit)));
  }

  async getUsualOrder(userId: string): Promise<Order | null> {
    const history = this.orderHistories[userId] || [];
    const usual = history.find((o) => o.isUsual) || history[0];
    return usual ? JSON.parse(JSON.stringify(usual)) : null;
  }

  async placeOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
    };

    if (!this.orderHistories[orderData.userId]) {
      this.orderHistories[orderData.userId] = [];
    }
    this.orderHistories[orderData.userId].unshift(newOrder);

    // Clear cart on successful order
    await this.clearCart(orderData.userId);

    return newOrder;
  }

  // --- Cart API ---
  calculateCartTotal(items: CartItem[]): Cart {
    const subtotal = items.reduce((sum, item) => sum + item.meal.price * item.quantity, 0);
    const roundedSubtotal = Math.round(subtotal * 100) / 100;
    const deliveryFee = items.length > 0 ? 2.49 : 0;
    const estimatedTax = Math.round(roundedSubtotal * 0.09 * 100) / 100;
    const total = Math.round((roundedSubtotal + deliveryFee + estimatedTax) * 100) / 100;

    return {
      items,
      subtotal: roundedSubtotal,
      deliveryFee,
      estimatedTax,
      total,
      currency: 'USD',
    };
  }

  async getCart(userId: string): Promise<Cart> {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, {
        items: [],
        subtotal: 0,
        deliveryFee: 0,
        estimatedTax: 0,
        total: 0,
        currency: 'USD',
      });
    }
    return JSON.parse(JSON.stringify(this.carts.get(userId)!));
  }

  async addToCart(
    userId: string,
    mealId: string,
    quantity = 1,
    slot: MealSlot = 'dinner',
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<Cart> {
    const meal = await this.getMeal(mealId);
    if (!meal) throw new Error(`Meal with id ${mealId} not found`);

    const cart = await this.getCart(userId);
    const existingIndex = cart.items.findIndex(
      (item) => item.mealId === mealId && item.selectedSlot === slot && item.selectedDate === date
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        mealId,
        meal,
        quantity,
        selectedSlot: slot,
        selectedDate: date,
      });
    }

    const updated = this.calculateCartTotal(cart.items);
    this.carts.set(userId, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  async removeFromCart(userId: string, mealId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.mealId !== mealId);
    const updated = this.calculateCartTotal(cart.items);
    this.carts.set(userId, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  async updateCartItem(userId: string, mealId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    if (quantity <= 0) {
      return this.removeFromCart(userId, mealId);
    }
    const item = cart.items.find((i) => i.mealId === mealId);
    if (item) {
      item.quantity = quantity;
    }
    const updated = this.calculateCartTotal(cart.items);
    this.carts.set(userId, updated);
    return JSON.parse(JSON.stringify(updated));
  }

  async clearCart(userId: string): Promise<Cart> {
    const emptyCart: Cart = {
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      estimatedTax: 0,
      total: 0,
      currency: 'USD',
    };
    this.carts.set(userId, emptyCart);
    return emptyCart;
  }

  // --- Feedback & Swipes API (Drop AI Spec Page 21, 41-42) ---
  async recordNegativeFeedback(feedback: Omit<NegativeFeedback, 'id' | 'timestamp'>): Promise<NegativeFeedback> {
    const record: NegativeFeedback = {
      ...feedback,
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    if (!this.negativeFeedbacks.has(feedback.userId)) {
      this.negativeFeedbacks.set(feedback.userId, []);
    }
    this.negativeFeedbacks.get(feedback.userId)!.unshift(record);

    // If persistent dislike (e.g. not temporary like "not today" or "too heavy"), update taste profile
    if (!feedback.isTemporary) {
      if (feedback.reasonCode === 'dislike_ingredient' && feedback.reasonLabel) {
        await this.addPreferenceItem(feedback.userId, 'dislikes', feedback.reasonLabel);
      }
    }

    return record;
  }

  async getNegativeFeedback(userId: string): Promise<NegativeFeedback[]> {
    return JSON.parse(JSON.stringify(this.negativeFeedbacks.get(userId) || []));
  }

  async recordSwipe(userId: string, mealId: string, direction: 'right' | 'left', reason?: string): Promise<void> {
    const meal = await this.getMeal(mealId);
    if (!meal) return;

    if (direction === 'left' && reason) {
      const isTemp = reason.toLowerCase().includes('today') || reason.toLowerCase().includes('heavy');
      let code: any = 'not_in_mood';
      if (reason.toLowerCase().includes('expensive')) code = 'too_expensive';
      else if (reason.toLowerCase().includes('spicy')) code = 'too_spicy';
      else if (reason.toLowerCase().includes('heavy')) code = 'too_heavy';
      else if (reason.toLowerCase().includes('today')) code = 'not_today';
      else if (reason.toLowerCase().includes("don't like") || reason.toLowerCase().includes('dislike')) code = 'dislike_ingredient';

      await this.recordNegativeFeedback({
        userId,
        mealId,
        mealName: meal.name,
        reasonCode: code,
        reasonLabel: reason,
        isTemporary: isTemp,
      });
    } else if (direction === 'right') {
      // Swiping right indicates positive affinity for this cuisine
      const prefs = await this.getUserPreferences(userId);
      if (prefs && !prefs.favoriteCuisines.includes(meal.cuisine)) {
        await this.addPreferenceItem(userId, 'cuisines', meal.cuisine);
      }
    }
  }
}

// Export singleton instance for standalone use
export const mockDailyDropAPI = new MockDailyDropAPI();
