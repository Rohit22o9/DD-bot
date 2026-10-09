export type MealSlot = 'lunch' | 'dinner';
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
export type MealCategory = 'main' | 'side' | 'drink' | 'dessert';

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
  category: MealCategory;
  dietaryTags: string[];
  ingredients: string[];
  spicyLevel: number; // 0 (none) to 3 (very spicy)
  availableDays: DayOfWeek[];
  availableSlots: MealSlot[];
  active: boolean;
  calories?: number;
  proteinGrams?: number;
  // Tier 1 Internal Qualification Attributes
  nutrition?: MealNutrition;
  healthFlags?: MealHealthFlags;
  // Customer-facing display badges
  displayBadges?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  minimumOrder: number;
  active: boolean;
  address?: string;
}

export interface UserPreferences {
  favoriteCuisines: string[];
  dislikedFoods: string[];
  dietaryPreferences: string[];
  allergies: string[]; // Explicit user-declared only!
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

export interface OrderItem {
  mealId: string;
  mealName: string;
  price: number;
  quantity: number;
  restaurantName: string;
  category?: MealCategory;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  slot: MealSlot;
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
  selectedSlot: MealSlot;
  selectedDate: string;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  estimatedTax: number;
  total: number;
  currency: string;
}

export interface Recommendation {
  meal: Meal;
  score: number; // 0 - 100
  reasons: string[];
}

export interface DailyMealPlanItem {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  dateStr?: string;
  slot: MealSlot;
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
  dietaryNotes?: string[];
  isVegetarianFriday?: boolean;
  updatedAt: string;
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

export type PrimaryJob = 'FIND' | 'CHOOSE' | 'BUILD' | 'ORDER';

export interface ParsedIntent {
  job: PrimaryJob;
  query: string;
  protein?: string;
  cuisine?: string;
  budgetCap?: number;
  targetDate?: string;
  mealSlot?: MealSlot;
  spicyFilter?: boolean;
  healthyFilter?: boolean;
  wellnessCategory?: 'high-protein' | 'weight-management' | 'high-fibre' | string;
  requestedModifications?: string[];
  isUsualRequest?: boolean;
  isQuickOption?: string;
  wantsPlan?: boolean;
  wantsBasket?: boolean;
  wantsDropForMe?: boolean;
  dropForMeMode?: DropForMeMode;
  isAlternativeRequest?: boolean;
  dishKeyword?: string;
  explicitConfirmation?: boolean;
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

export type RejectionReasonCode =
  | 'too_expensive'
  | 'dislike_ingredient'
  | 'too_heavy'
  | 'not_today'
  | 'too_spicy'
  | 'not_in_mood';

export interface NegativeFeedback {
  id: string;
  userId: string;
  mealId: string;
  mealName: string;
  reasonCode: RejectionReasonCode;
  reasonLabel: string;
  isTemporary: boolean;
  timestamp: string;
}

export interface HealthGoalOption {
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
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

export interface ChatResponsePayload {
  message: string;
  job: PrimaryJob;
  quickOptions?: string[];
  recommendations?: Recommendation[];
  healthGoals?: HealthGoalOption[];
  dismissGoalPrompt?: string;
  addedCartItem?: {
    meal: Meal;
    quantity: number;
  };
  usualOrder?: Order;
  budgetBasket?: BudgetBasket;
  dropForMe?: DropForMeResult;
  weeklyPlan?: WeeklyMealPlan;
  draftCart?: Cart;
  inChatCart?: Cart;
  gamePayload?: GamePayload;
  confirmationRequired?: boolean;
  confirmationDetails?: {
    action: 'PLACE_ORDER' | 'CLEAR_CART' | 'CONFIRM_PLAN';
    total: number;
    summary: string;
  };
  appliedFilters?: {
    budget?: number;
    protein?: string;
    slot?: MealSlot;
    cuisine?: string;
    dietary?: string[];
    excludedIngredients?: string[];
  };
}
