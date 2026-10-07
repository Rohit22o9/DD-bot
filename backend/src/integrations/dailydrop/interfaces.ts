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
  MealCategory,
  NegativeFeedback
} from '../../types';

export interface MealSearchFilters {
  query?: string;
  keyword?: string;
  cuisine?: string;
  category?: MealCategory;
  maxPrice?: number;
  minPrice?: number;
  day?: DayOfWeek;
  slot?: MealSlot;
  dietaryTags?: string[];
  excludeIngredients?: string[];
  spicyLevel?: number;
  restaurantId?: string;
}

export interface DailyDropMealsAPI {
  searchMeals(filters?: MealSearchFilters): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | null>;
  getMealsByIds(ids: string[]): Promise<Meal[]>;
}

export interface DailyDropRestaurantAPI {
  getRestaurant(id: string): Promise<Restaurant | null>;
  listRestaurants(): Promise<Restaurant[]>;
}

export interface DailyDropUserAPI {
  getUserProfile(userId: string): Promise<UserProfile | null>;
  getUserPreferences(userId: string): Promise<UserPreferences | null>;
  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences>;
  addPreferenceItem(userId: string, category: 'cuisines' | 'dislikes' | 'dietary' | 'allergies' | 'restaurants', value: string): Promise<UserPreferences>;
  removePreferenceItem(userId: string, category: 'cuisines' | 'dislikes' | 'dietary' | 'allergies' | 'restaurants', value: string): Promise<UserPreferences>;
}

export interface DailyDropOrdersAPI {
  getOrderHistory(userId: string, limit?: number): Promise<Order[]>;
  getUsualOrder(userId: string): Promise<Order | null>;
  placeOrder(order: Omit<Order, 'id'>): Promise<Order>;
}

export interface DailyDropCartAPI {
  getCart(userId: string): Promise<Cart>;
  addToCart(userId: string, mealId: string, quantity: number, slot: MealSlot, date: string): Promise<Cart>;
  removeFromCart(userId: string, mealId: string): Promise<Cart>;
  updateCartItem(userId: string, mealId: string, quantity: number): Promise<Cart>;
  clearCart(userId: string): Promise<Cart>;
  calculateCartTotal(items: CartItem[]): Cart;
}

export interface DailyDropAvailabilityAPI {
  checkMealAvailability(mealId: string, day: DayOfWeek, slot: MealSlot): Promise<boolean>;
}

export interface DailyDropFeedbackAPI {
  recordNegativeFeedback(feedback: Omit<NegativeFeedback, 'id' | 'timestamp'>): Promise<NegativeFeedback>;
  getNegativeFeedback(userId: string): Promise<NegativeFeedback[]>;
  recordSwipe(userId: string, mealId: string, direction: 'right' | 'left', reason?: string): Promise<void>;
}
