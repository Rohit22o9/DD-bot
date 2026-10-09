export interface MealNutrition {
  calories: number;
  proteinGrams: number;
  fibreGrams?: number;
  sodiumMg?: number;
  saturatedFatGrams?: number;
  carbsGrams?: number;
  sugarGrams?: number;
}

export interface MealHealthFlags {
  heartHealthy?: boolean;
  diabetesFriendly?: boolean;
  highProtein?: boolean;
  lowCarb?: boolean;
  lowSodium?: boolean;
  antiInflammatory?: boolean;
  weightManagement?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  vegan?: boolean;
  vegetarian?: boolean;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  imageUrl: string;
  cuisine: string;
  category: 'main' | 'side' | 'drink' | 'dessert';
  dietaryTags: string[];
  ingredients: string[];
  spicyLevel: number;
  availableDays: string[];
  availableSlots: ('lunch' | 'dinner')[];
  active: boolean;
  calories?: number;
  proteinGrams?: number;
  portion?: string;
  // Tier 1 Internal Qualification Attributes
  nutrition?: MealNutrition;
  healthFlags?: MealHealthFlags;
  // Customer-facing display badges (clean UI badges, e.g. "❤️ Heart Healthy", "💪 38g Protein")
  displayBadges?: string[];
}

export interface Recommendation {
  meal: Meal;
  score: number;
  reasons: string[];
}

export interface OrderItem {
  mealId: string;
  mealName: string;
  price: number;
  quantity: number;
  restaurantName: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  slot: 'lunch' | 'dinner';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  restaurantId: string;
  restaurantName: string;
  status: 'delivered' | 'pending' | 'draft';
  isUsual?: boolean;
}

export interface CartItem {
  mealId: string;
  meal: Meal;
  quantity: number;
  selectedSlot: 'lunch' | 'dinner';
  selectedDate: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  estimatedTax: number;
  total: number;
  currency: string;
}

export interface DailyMealPlanItem {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  slot: 'lunch' | 'dinner';
  meal: Meal;
  reason: string;
}

export interface WeeklyMealPlan {
  id: string;
  userId: string;
  days: DailyMealPlanItem[];
  targetBudget: number;
  actualTotal: number;
  currency: string;
  isVegetarianFriday?: boolean;
}

export interface BudgetBasket {
  title?: string;
  main: Meal;
  side: Meal;
  drink: Meal;
  total: number;
  budgetCap: number;
  currency: string;
  items: {
    category: 'Meal' | 'Side' | 'Drink';
    name: string;
    price: number;
    mealId: string;
  }[];
}

export interface UserPreferences {
  favoriteCuisines: string[];
  dislikedFoods: string[];
  dietaryPreferences: string[];
  allergies: string[];
  preferredPriceRange: { min: number; max: number };
  spicyPreference: 'none' | 'mild' | 'spicy' | 'any';
  healthyPreference: boolean;
  favoriteRestaurants: string[];
  frequentProteins?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export type DropForMeMode = 'safe' | 'adventure' | 'budget' | 'healthy';

export interface DropForMeResult {
  mode: DropForMeMode;
  modeLabel: string;
  main: Meal;
  side?: Meal;
  drink?: Meal;
  dessert?: Meal;
  totalPrice: number;
  matchScore: number;
  reasons: string[];
  rationale: string;
}

export interface HealthGoalOption {
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
}

export interface QuickSearchFilters {
  budgetCap?: number;
  wellness?: 'high-protein' | 'weight-management' | 'high-fibre';
  dietary?: 'vegetarian' | 'vegan' | 'halal' | 'gluten-free';
  spicyFilter?: boolean;
  mealSlot?: 'lunch' | 'dinner';
}

export type DiscoveryGameType =
  | 'food_tinder'
  | 'meal_battle'
  | 'this_or_that'
  | 'meal_roulette'
  | 'mystery_meal'
  | 'food_passport'
  | 'guess_dish'
  | 'build_meal';

export interface GamePayload {
  gameType: DiscoveryGameType;
  title: string;
  data?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAnimated?: boolean;
  isStreaming?: boolean;
  statusText?: string;
  job?: 'FIND' | 'CHOOSE' | 'BUILD' | 'ORDER';
  recommendations?: Recommendation[];
  healthGoals?: HealthGoalOption[];
  dismissGoalPrompt?: string;
  addedCartItem?: {
    meal: Meal;
    quantity: number;
  };
  addedCartItems?: {
    meal: Meal;
    quantity: number;
  }[];
  quickOptions?: string[];
  usualOrder?: Order;
  budgetBasket?: BudgetBasket;
  dropForMe?: DropForMeResult;
  weeklyPlan?: WeeklyMealPlan;
  gamePayload?: GamePayload;
  inChatCart?: Cart | null;
  confirmationRequired?: boolean;
  confirmationDetails?: {
    action: 'PLACE_ORDER' | 'CLEAR_CART' | 'CONFIRM_PLAN';
    total: number;
    summary: string;
  };
}
