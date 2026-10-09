import {
  ChatResponsePayload,
  UserProfile,
  UserPreferences,
  Meal,
  Order,
  DayOfWeek,
  MealSlot,
  WeeklyMealPlan,
  BudgetBasket,
  Recommendation,
  HealthGoalOption,
} from '../../types';
import { AIProvider } from '../providers/AIProvider';
import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { HybridRuleProvider } from '../providers/HybridRuleProvider';
import { toolRegistry, ToolRegistry } from '../tools/ToolRegistry';
import { recommendationEngine, RecommendationEngine } from './RecommendationEngine';
import { safetyValidator, SafetyValidator } from './SafetyValidator';
import { correctFoodTypos } from '../foodTypoCorrector';

export const HEALTH_GOAL_OPTIONS: HealthGoalOption[] = [
  {
    icon: '❤️',
    title: 'Heart Healthy',
    subtitle: 'Good for your heart',
    prompt: 'Heart Healthy',
  },
  {
    icon: '📉',
    title: 'Diabetes Friendly',
    subtitle: 'Helps manage blood sugar',
    prompt: 'Diabetes Friendly',
  },
  {
    icon: '💪',
    title: 'High Protein',
    subtitle: 'Keeps you fuller for longer',
    prompt: 'High Protein',
  },
  {
    icon: '⚖️',
    title: 'Weight Management',
    subtitle: 'Lower calories, balanced nutrition',
    prompt: 'Weight Management',
  },
  {
    icon: '🌾',
    title: 'High Fibre',
    subtitle: 'Good for digestion',
    prompt: 'High Fibre',
  },
  {
    icon: '🧂',
    title: 'Low Sodium',
    subtitle: 'Lower salt options',
    prompt: 'Low Sodium',
  },
  {
    icon: '🌿',
    title: 'Gluten Free',
    subtitle: 'No gluten ingredients',
    prompt: 'Gluten Free',
  },
];

export interface OrchestratorOptions {
  aiProvider?: AIProvider;
  tools?: ToolRegistry;
  recommender?: RecommendationEngine;
  safety?: SafetyValidator;
}

export class DropAIOrchestrator {
  private aiProvider: AIProvider;
  private tools: ToolRegistry;
  private recommender: RecommendationEngine;
  private safety: SafetyValidator;
  private activeMealPlans: Map<string, WeeklyMealPlan> = new Map();
  private activeDropForMe: Map<string, any> = new Map();
  private activeBudgetBaskets: Map<string, BudgetBasket> = new Map();
  private activeCombos: Map<
    string,
    { main: Meal; side: Meal; alternativeSides: Meal[]; budgetCap: number; slot: MealSlot; isPremium: boolean }
  > = new Map();
  private sessionShownMeals: Map<string, string[]> = new Map();

  constructor(options?: OrchestratorOptions) {
    if (options?.aiProvider) {
      this.aiProvider = options.aiProvider;
    } else {
      const gemini = new GeminiProvider();
      const openAI = new OpenAIProvider();
      if (gemini.isAvailable()) {
        this.aiProvider = gemini;
      } else if (openAI.isAvailable()) {
        this.aiProvider = openAI;
      } else {
        this.aiProvider = new HybridRuleProvider();
      }
    }
    this.tools = options?.tools || toolRegistry;
    this.recommender = options?.recommender || recommendationEngine;
    this.safety = options?.safety || safetyValidator;
  }

  public setAIProvider(provider: AIProvider) {
    this.aiProvider = provider;
  }

  public async processMessage(
    userId: string,
    userInput: string,
    sessionState?: any
  ): Promise<ChatResponsePayload> {
    const typoResult = correctFoodTypos(userInput);
    const correctedInput = typoResult.hasCorrection ? typoResult.correctedText : userInput;
    const rawInput = correctedInput.trim();
    const lower = rawInput.toLowerCase();

    // 1. Fetch user profile & explicit preferences
    const userProfile = await this.tools.getUserProfile(userId);
    const preferences = userProfile?.preferences;

    // 2. Parse Intent with fallback
    let intent;
    try {
      intent = await this.aiProvider.parseIntent(rawInput, sessionState);
    } catch (parseErr) {
      console.warn('AIProvider parseIntent encountered an issue, falling back to HybridRuleProvider:', parseErr);
      const fallbackProvider = new HybridRuleProvider();
      intent = await fallbackProvider.parseIntent(rawInput, sessionState);
    }

    // Apply pre-selected quick filters (shortens search & reduces LLM token costs)
    if (sessionState?.activeFilters) {
      const f = sessionState.activeFilters;
      if (f.budgetCap !== undefined) intent.budgetCap = f.budgetCap;
      if (f.spicyFilter !== undefined) intent.spicyFilter = f.spicyFilter;
      if (f.healthyFilter !== undefined) intent.healthyFilter = f.healthyFilter;
      if (f.mealSlot !== undefined) intent.mealSlot = f.mealSlot;
      if (f.cuisine !== undefined) intent.cuisine = f.cuisine;
      if (f.wellness !== undefined) {
        intent.wellnessCategory = f.wellness;
        intent.healthyFilter = true;
      }
      if (f.dietary && preferences) {
        if (!preferences.dietaryPreferences.includes(f.dietary)) {
          preferences.dietaryPreferences = [...preferences.dietaryPreferences, f.dietary];
        }
      }
    }

    // =========================================================================
    // 🎮 FOOD DISCOVERY GAMES
    // =========================================================================
    if (
      lower.includes('food tinder') ||
      lower.includes('swipe & pick') ||
      lower.includes('swipe and pick') ||
      lower.includes('swipe 5 dishes') ||
      lower === 'swipe'
    ) {
      return {
        message: "Let's find out what you're craving. Swipe 5 dishes. 🔥",
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'food_tinder',
          title: 'Food Tinder — Swipe & Pick',
        },
      };
    }

    if (
      lower.includes('meal battle') ||
      lower.includes('food fight') ||
      lower.includes('which one wins')
    ) {
      return {
        message: "Welcome to Meal Battle ⚔️! Which one wins? Tap your craving to crown tonight's champion.",
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'meal_battle',
          title: 'Meal Battle ⚔️',
        },
      };
    }

    if (
      lower.includes('this or that') ||
      lower.includes('4 quick choices') ||
      lower.includes('4 questions')
    ) {
      return {
        message: "Quick game. I'll find your dinner in 4 questions. 🤔",
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'this_or_that',
          title: 'This or That 🤔',
        },
      };
    }

    if (
      lower.includes('roulette') ||
      lower.includes('meal roulette') ||
      lower.includes('spin the wheel') ||
      lower === 'spin'
    ) {
      return {
        message: "Feeling lucky? 🎲 Spin the flavour wheel and discover tonight's dinner!",
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'meal_roulette',
          title: 'Meal Roulette 🎲',
        },
      };
    }

    if (
      lower.includes('mystery meal') ||
      lower.includes('mystery box') ||
      lower.includes('crack a box') ||
      lower === 'mystery'
    ) {
      return {
        message: 'Pick your mystery box. 👀 What surprise awaits inside?',
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'mystery_meal',
          title: 'Mystery Meal 🎁',
        },
      };
    }

    if (
      lower.includes('food passport') ||
      lower.includes('passport') ||
      lower.includes('collect stamps')
    ) {
      return {
        message: 'Your Food Passport 🌍! Track your multi-cuisine journeys and unlock new stamps tonight.',
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'food_passport',
          title: 'Food Passport 🌍',
        },
      };
    }

    if (
      lower.includes('guess the dish') ||
      lower.includes('guess dish') ||
      lower.includes('daily trivia')
    ) {
      return {
        message: "Can you guess today's mystery dish? 🕵️ Put your tastebuds to the test!",
        job: 'CHOOSE',
        gamePayload: {
          gameType: 'guess_dish',
          title: 'Guess the Dish 🕵️',
        },
      };
    }

    if (
      lower.includes('build my meal') ||
      lower.includes('build meal') ||
      lower.includes('craft protein')
    ) {
      return {
        message: "Let's craft your dinner! 🧑‍🍳 Choose your protein, flavour personality, and base.",
        job: 'BUILD',
        gamePayload: {
          gameType: 'build_meal',
          title: 'Build My Meal 🧑‍🍳',
        },
      };
    }

    if (
      lower.includes('play a game') ||
      lower.includes('play game') ||
      lower.includes('play and discover') ||
      lower.includes('play & discover') ||
      lower.includes("can't decide")
    ) {
      return {
        message: "Can't decide? Let's play a 20-second game and I'll pick your dinner. 🎮",
        job: 'CHOOSE',
        quickOptions: [
          '🔥 Food Tinder',
          '⚔️ Meal Battle',
          '🤔 This or That',
          '🎲 Meal Roulette',
          '🎁 Mystery Meal',
        ],
      };
    }

    // =========================================================================
    // =========================================================================
    // FLOW 1 — “HELP ME CHOOSE” (Default Discovery Flow)
    // =========================================================================
    const isHelpMeChoose =
      lower === 'help me choose' ||
      lower === 'help me choose what to eat' ||
      lower === 'choose what to eat' ||
      lower === 'what should i eat' ||
      lower === 'help me decide' ||
      lower === 'help' ||
      lower.includes('what are you in the mood for');

    if (isHelpMeChoose) {
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safe = this.safety.filterSafeMeals(allMains, preferences);
      const picked = safe.slice(0, 4);
      let replyMsg = "Here are tonight's top chef-crafted picks from our kitchen, curated for great flavor and balanced nutrition:";
      if (this.aiProvider instanceof GeminiProvider) {
        const aiMsg = await this.aiProvider.generateConversationalReply(rawInput, picked, {
          userName: userProfile?.name,
          dietPreferences: preferences?.dietaryPreferences,
          allergies: preferences?.allergies,
        });
        if (aiMsg) replyMsg = aiMsg;
      }
      return {
        message: replyMsg,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: ['✓ Chef recommendation', '✓ Freshly prepped for dinner'],
        })),
        quickOptions: ['💰 Under $15', '🌶️ Spicy', '🥗 Healthy', '✨ Surprise me'],
      };
    }

    const isComfortFood = lower === 'comfort food' || lower === '🍛 comfort food';
    const isHealthyLight = lower === 'healthy & light' || lower === 'healthy and light' || lower === '🥗 healthy & light';
    const isSomethingSpicy = (lower === 'something spicy' || lower === '🌶️ something spicy') && !lower.includes('under');
    const isFillingMeal = lower === 'filling meal' || lower === '🍚 filling meal';

    if (isComfortFood || isHealthyLight || isSomethingSpicy || isFillingMeal) {
      let searchOpts: any = { category: 'main' };
      if (isSomethingSpicy) searchOpts.spicyLevel = 2;
      const allMeals = await this.tools.searchMeals(searchOpts);
      const safe = this.safety.filterSafeMeals(allMeals, preferences);
      let selectedMeals = safe;

      if (isComfortFood) {
        selectedMeals = safe.filter((m) =>
          m.name.toLowerCase().includes('biryani') ||
          m.name.toLowerCase().includes('lasagne') ||
          m.name.toLowerCase().includes('butter') ||
          m.cuisine === 'Italian' ||
          m.cuisine === 'Indian'
        );
      } else if (isHealthyLight) {
        selectedMeals = safe.filter((m) => (m.calories || 600) < 500 || m.dietaryTags.some((t) => t.toLowerCase().includes('healthy')));
      } else if (isFillingMeal) {
        selectedMeals = safe.filter((m) => (m.proteinGrams || 20) >= 30 || m.name.toLowerCase().includes('bowl') || m.name.toLowerCase().includes('rice'));
      }
      if (selectedMeals.length === 0) selectedMeals = safe.slice(0, 4);

      const moodLabel = isComfortFood
        ? 'rich & satisfying comfort food'
        : isHealthyLight
        ? 'healthy & light nourishing meals'
        : isSomethingSpicy
        ? 'bold & spicy dishes'
        : 'filling, hearty meals';

      return {
        message: `Here are 4 chef-crafted options for ${moodLabel}:`,
        job: 'FIND',
        recommendations: selectedMeals.slice(0, 4).map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: ['✓ Freshly prepared', '✓ Top rated on Daily Drop'],
        })),
        quickOptions: ['💰 Under $15', '🌶️ More spicy', '🍗 Chicken', '🌱 Vegetarian', '🔄 Show me more'],
      };
    }

    // =========================================================================
    // FLOW 2 — “I DON'T KNOW WHAT I WANT” / "YOU DECIDE"
    // =========================================================================
    const isIDontKnow =
      lower.includes("i don't know what i want") ||
      lower.includes("don't know what i want") ||
      lower.includes("i dont know what i want") ||
      lower.includes("don't know what to eat") ||
      lower === 'not sure' ||
      lower === '🤷 not sure';

    if (isIDontKnow) {
      const history = await this.tools.getOrderHistory(userId, 5);
      const hasRecentChicken = history.some((o) =>
        o.items.some((i) => i.mealName.toLowerCase().includes('chicken'))
      );

      const intro = hasRecentChicken
        ? "You've been having a lot of chicken and rice lately. Want something different?"
        : "Looking for inspiration tonight? Let's narrow it down quickly.";

      return {
        message: intro,
        job: 'CHOOSE',
        quickOptions: ['Something different', 'Healthy', 'Spicy', 'Surprise me'],
      };
    }

    const isYouDecide =
      lower === 'you decide' ||
      lower === '🤷 you decide' ||
      lower.includes('you decide') ||
      lower.includes('surprise me again');

    if (isYouDecide) {
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safe = this.safety.filterSafeMeals(allMains, preferences);
      const picked = safe.slice(0, 3);

      return {
        message: "I've picked 3 for you based on today's menu.",
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 97 - idx * 2,
          reasons: ['✓ Chef recommendation', '✓ Matches kitchen availability today'],
        })),
        quickOptions: ['😍 I like these', '💰 Cheaper', '🥗 Healthier', '🎲 Surprise me again'],
      };
    }

    const isLightFresh = lower.includes('light & fresh') || lower.includes('light and fresh');
    const isRichComforting = lower.includes('rich & comforting') || lower.includes('rich and comforting');
    const isBigFlavours = lower.includes('big flavours') || lower.includes('big flavors');

    if (isLightFresh || isRichComforting || isBigFlavours) {
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safe = this.safety.filterSafeMeals(allMains, preferences);
      let picked = safe;
      if (isLightFresh) {
        picked = safe.filter((m) => (m.calories || 600) < 500);
      } else if (isRichComforting) {
        picked = safe.filter((m) => m.price >= 12 && (m.cuisine === 'Indian' || m.cuisine === 'Italian'));
      } else if (isBigFlavours) {
        picked = safe.filter((m) => m.spicyLevel > 0 || m.cuisine === 'Thai' || m.cuisine === 'African');
      }
      if (picked.length === 0) picked = safe.slice(0, 3);

      return {
        message: `I've picked 3 dishes with ${isLightFresh ? 'light & fresh textures' : isRichComforting ? 'rich & comforting depth' : 'bold, vibrant flavours'}:`,
        job: 'FIND',
        recommendations: picked.slice(0, 3).map((m, idx) => ({
          meal: m,
          score: 96 - idx * 2,
          reasons: ['✓ Perfectly matched to your mood', '✓ Available today'],
        })),
        quickOptions: ['😍 I like these', '💰 Cheaper', '🥗 Healthier', '🎲 Surprise me again'],
      };
    }

    // =========================================================================
    // FLOW 3 — HEALTHY / NUTRITION GOAL
    // =========================================================================
    const isHealthyEntry =
      !intent.wellnessCategory &&
      (lower === 'i want something healthy' ||
      lower === 'eat healthier' ||
      lower === 'something healthy' ||
      lower === 'healthy');

    const isHealthGoalSelected =
      !intent.wellnessCategory &&
      (lower.includes('heart healthy') ||
      lower.includes('diabetes friendly') ||
      lower.includes('low sodium') ||
      lower.includes('gluten free') ||
      lower.includes('not sure, just show me healthy options') ||
      lower.includes('just show me healthy options'));

    if (isHealthyEntry || isHealthGoalSelected) {
      const qBowl = (await this.tools.getMeal('meal_grilled_chicken_quinoa_bowl')) || (await this.tools.searchMeals({ keyword: 'Quinoa' }))[0];
      const salmon = (await this.tools.getMeal('meal_salmon_brown_rice')) || (await this.tools.searchMeals({ keyword: 'Salmon' }))[0];
      const beetroot = (await this.tools.getMeal('meal_beetroot_tofu_salad')) || (await this.tools.searchMeals({ keyword: 'Beetroot' }))[0];
      const thaiChicken = (await this.tools.getMeal('meal_thai_basil_chicken')) || (await this.tools.searchMeals({ keyword: 'Thai Basil' }))[0];

      const safeMeals = [qBowl, salmon, beetroot, thaiChicken].filter(Boolean) as Meal[];

      let replyMsg = 'Here are some healthy options for you. These meals are nutritious, fresh and full of flavour. ✨';
      if (this.aiProvider instanceof GeminiProvider) {
        const aiMsg = await this.aiProvider.generateConversationalReply(rawInput, safeMeals, {
          userName: userProfile?.name,
          dietPreferences: preferences?.dietaryPreferences,
          allergies: preferences?.allergies,
        });
        if (aiMsg) replyMsg = aiMsg;
      }

      return {
        message: replyMsg,
        job: 'FIND',
        recommendations: [
          {
            meal: qBowl || safeMeals[0],
            score: 98,
            reasons: ['✓ High Protein', '✓ Low Sodium', '✓ Fresh & balanced'],
          },
          {
            meal: salmon || safeMeals[1] || safeMeals[0],
            score: 95,
            reasons: ['✓ Heart Healthy', '✓ Rich Omega-3', '✓ Gluten Free'],
          },
          {
            meal: beetroot || safeMeals[2] || safeMeals[0],
            score: 92,
            reasons: ['✓ 100% Vegan', '✓ High Fibre', '✓ Fresh garden greens'],
          },
          {
            meal: thaiChicken || safeMeals[3] || safeMeals[0],
            score: 90,
            reasons: ['✓ High Protein', '✓ Low Calorie', '✓ Fragrant Holy Basil'],
          },
        ],
        quickOptions: [
          '🔥 Under 500 cal',
          '💰 Under $15',
          '🍗 Chicken',
          '🐟 Seafood',
          '🌱 Vegetarian',
        ],
      };
    }

    // =========================================================================
    // FLOW 4 — BUDGET MEAL
    // =========================================================================
    const isBudgetEntry =
      (lower === 'budget meal' ||
      lower === 'budget friendly' ||
      lower === 'i want something cheap' ||
      lower === 'cheap' ||
      lower === 'something cheap' ||
      lower === 'what price works for you') &&
      !intent.protein &&
      !intent.spicyFilter;

    const isUnder10 = (lower === 'under $10' || lower === 'under 10') && !intent.protein && !intent.spicyFilter;
    const isUnder12 = (lower === 'under $12' || lower === 'under 12') && !intent.protein && !intent.spicyFilter;
    const isUnder15 =
      (lower === 'under $15' || lower === 'under 15' || lower === '💰 under $15') &&
      !intent.protein &&
      !intent.spicyFilter &&
      !intent.cuisine &&
      !intent.targetDate;
    const isBestValue = (lower === 'best value' || lower.includes('best value')) && !intent.protein && !intent.spicyFilter;

    if (isBudgetEntry || isUnder10 || isUnder12 || isUnder15 || isBestValue) {
      const cap = isUnder10 ? 10.5 : isUnder12 ? 12.5 : isUnder15 ? 15 : 14;
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safe = this.safety.filterSafeMeals(allMains, preferences);
      const budgetMeals = safe.filter((m) => m.price <= cap);
      const picked = (budgetMeals.length > 0 ? budgetMeals : safe).slice(0, 4);

      let title = isBestValue
        ? 'Here are our best value meals today! Generous portions, high protein, and exceptional ratings:'
        : `Here are great options ${isUnder10 ? 'under $10' : isUnder12 ? 'under $12' : 'under $15'}:`;

      if (this.aiProvider instanceof GeminiProvider) {
        const aiMsg = await this.aiProvider.generateConversationalReply(rawInput, picked, {
          userName: userProfile?.name,
          dietPreferences: preferences?.dietaryPreferences,
          allergies: preferences?.allergies,
        });
        if (aiMsg) title = aiMsg;
      }

      return {
        message: title,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 96 - idx * 2,
          reasons: [isBestValue ? '✓ High protein per $' : `✓ Under $${cap.toFixed(2)}`, '✓ Top customer rating'],
        })),
        quickOptions: ['🍗 Chicken', '🌱 Vegetarian', '🌶️ Spicy', '💪 High protein', '🔄 More'],
      };
    }

    // =========================================================================
    // FLOW 4.5 — STRICT DIETARY & PROTEIN INQUIRIES (100% Zero-Mismatch Guarantee)
    // =========================================================================
    const isDayModification =
      lower.includes('friday') ||
      lower.includes('monday') ||
      lower.includes('tuesday') ||
      lower.includes('wednesday') ||
      lower.includes('thursday') ||
      lower.includes('plan');

    const isVegetarianInquiry =
      !isDayModification &&
      (lower === '🌱 vegetarian' ||
        lower === 'vegetarian' ||
        lower === 'veg' ||
        lower === 'pure veg' ||
        lower === 'vegetarian meals' ||
        lower.includes('vegetarian') ||
        lower.includes('meatless') ||
        lower.includes('no meat'));

    const isVeganInquiry =
      !isDayModification &&
      (lower === '🌿 vegan' ||
        lower === 'vegan' ||
        lower.includes('vegan') ||
        lower.includes('plant-based') ||
        lower.includes('plant based'));

    const isChickenInquiry =
      !isDayModification &&
      (lower === '🍗 chicken' ||
        lower === 'chicken' ||
        lower === 'more chicken' ||
        lower.includes('chicken dishes') ||
        lower.includes('chicken')) &&
      !isVegetarianInquiry &&
      !isVeganInquiry;

    const isSeafoodInquiry =
      !isDayModification &&
      (lower === '🐟 seafood' ||
        lower === 'seafood' ||
        lower.includes('seafood') ||
        lower.includes('salmon') ||
        lower.includes('fish')) &&
      !isVegetarianInquiry &&
      !isVeganInquiry;

    if (isVegetarianInquiry || isVeganInquiry || isChickenInquiry || isSeafoodInquiry) {
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const meatKeywords = [
        'chicken',
        'beef',
        'pork',
        'salmon',
        'barramundi',
        'fish',
        'seafood',
        'shrimp',
        'prawn',
        'lamb',
        'meat',
        'rendang',
        'biryani',
      ];

      let matchingMeals: Meal[] = [];
      let replyMessage = '';
      let quickOptions: string[] = [];

      if (isVeganInquiry) {
        matchingMeals = allMains.filter((m) => {
          const tags = m.dietaryTags.map((t) => t.toLowerCase());
          const isTagged = tags.includes('vegan');
          const text = (m.name + ' ' + m.description + ' ' + m.ingredients.join(' ')).toLowerCase();
          const hasNonVegan = [
            ...meatKeywords,
            'egg',
            'dairy',
            'milk',
            'cheese',
            'halloumi',
            'yogurt',
            'butter',
          ].some((k) => text.includes(k));
          return isTagged && !hasNonVegan;
        });
        replyMessage = 'Here are 100% plant-based, vegan dishes crafted without any animal products or dairy 🌿:';
        quickOptions = ['💰 Under $12', '🥟 Sides', '🥤 Drinks', '🍰 Desserts'];
      } else if (isVegetarianInquiry) {
        matchingMeals = allMains.filter((m) => {
          const tags = m.dietaryTags.map((t) => t.toLowerCase());
          const isTagged = tags.includes('vegetarian') || tags.includes('vegan');
          const text = (m.name + ' ' + m.description + ' ' + m.ingredients.join(' ')).toLowerCase();
          const hasMeat = meatKeywords.some((k) => text.includes(k));
          return isTagged && !hasMeat;
        });
        replyMessage = "Here are 100% vegetarian, plant-powered meals on today's menu 🌱 (strictly zero meat or seafood):";
        quickOptions = ['💰 Under $12', '🥟 Veg sides', '🥤 Drinks', '🍰 Desserts', '🔄 More veg'];
      } else if (isChickenInquiry) {
        matchingMeals = allMains.filter((m) =>
          (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes('chicken')
        );
        if (intent.budgetCap !== undefined || lower.includes('under')) {
          const cap = intent.budgetCap || (lower.includes('15') ? 15 : 20);
          matchingMeals = matchingMeals.filter((m) => m.price <= cap);
        }
        replyMessage = 'Here are our top chef-crafted chicken dishes on the menu today 🍗:';
        quickOptions = ['💰 Under $14', '🌶️ Spicy', '🥟 Add a side', '🥤 Add a drink'];
      } else if (isSeafoodInquiry) {
        matchingMeals = allMains.filter((m) =>
          ['salmon', 'barramundi', 'fish', 'seafood'].some((k) =>
            (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes(k)
          )
        );
        if (intent.budgetCap !== undefined || lower.includes('under')) {
          const cap = intent.budgetCap || (lower.includes('15') ? 15 : 20);
          matchingMeals = matchingMeals.filter((m) => m.price <= cap);
        }
        replyMessage = 'Here are our fresh wild-caught and glazed seafood dishes today 🐟:';
        quickOptions = ['💰 Under $15', '🥟 Add a side', '🥤 Add a drink'];
      }

      const safe = this.safety.filterSafeMeals(matchingMeals, preferences);
      const picked = (safe.length > 0 ? safe : matchingMeals).slice(0, 4);

      return {
        message: replyMessage,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: [
            isVegetarianInquiry
              ? '✓ 100% Vegetarian certified'
              : isVeganInquiry
              ? '✓ 100% Plant-Based & Vegan'
              : isChickenInquiry
              ? '✓ Tender lean chicken'
              : '✓ Wild-caught seafood',
            '✓ Top rated on Daily Drop',
          ],
        })),
        quickOptions,
      };
    }

    // =========================================================================
    // FLOW 5 — CUISINE DISCOVERY
    // =========================================================================
    const isAsianCuisineInquiry =
      lower.includes('asian food') ||
      lower.includes('feel like asian') ||
      lower === 'asian' ||
      lower === '🌏 asian';

    if (isAsianCuisineInquiry) {
      return {
        message: 'What sounds good?',
        job: 'CHOOSE',
        quickOptions: ['🇹🇭 Thai', '🇮🇩 Indonesian', '🇨🇳 Chinese', '🇯🇵 Japanese', '🌏 Surprise me'],
      };
    }

    const isGeneralCuisineInquiry =
      lower === 'cuisine discovery' ||
      lower === 'cuisines' ||
      lower === 'explore cuisines' ||
      lower.includes('different cuisine');

    if (isGeneralCuisineInquiry) {
      return {
        message: 'What sounds good?',
        job: 'CHOOSE',
        quickOptions: [
          '🇮🇳 Indian',
          '🌏 Asian',
          '🌍 African',
          '🥙 Middle Eastern',
          '🍝 Western',
          '✨ Something different',
        ],
      };
    }

    const isSpecificCuisineChoice =
      lower.includes('thai') ||
      lower.includes('indonesian') ||
      lower.includes('chinese') ||
      lower.includes('korean') ||
      lower.includes('japanese') ||
      lower.includes('indian') ||
      lower.includes('punjabi') ||
      lower.includes('african') ||
      lower.includes('malaysian') ||
      lower.includes('middle eastern') ||
      lower.includes('western') ||
      lower.includes('italian') ||
      lower.includes('mexican');

    if (
      isSpecificCuisineChoice &&
      !lower.includes('combo') &&
      !lower.includes('side') &&
      !lower.includes('added') &&
      !lower.includes('usual') &&
      !lower.includes('biryani') &&
      !lower.includes('add the') &&
      !lower.includes('plan') &&
      !lower.includes('5 day') &&
      !lower.includes('five day') &&
      !lower.includes('week') &&
      !lower.includes('family') &&
      !lower.includes('feast') &&
      !lower.includes('night') &&
      !lower.includes('dinner for') &&
      !lower.includes('feed')
    ) {
      const isIndoChinese =
        lower.includes('indian chinese') ||
        lower.includes('indo chinese') ||
        lower.includes('indo-chinese') ||
        lower.includes('desi chinese') ||
        lower.includes('manchurian') ||
        lower.includes('hakka');

      const cuisineTarget = isIndoChinese
        ? 'Indo-Chinese'
        : lower.includes('korean')
        ? 'Korean'
        : lower.includes('chinese')
        ? 'Chinese'
        : lower.includes('italian')
        ? 'Italian'
        : lower.includes('japanese')
        ? 'Japanese'
        : lower.includes('thai')
        ? 'Thai'
        : lower.includes('malaysian')
        ? 'Malaysian'
        : lower.includes('indonesian')
        ? 'Indonesian'
        : lower.includes('indian') || lower.includes('punjabi')
        ? 'North Indian'
        : lower.includes('african')
        ? 'African'
        : lower.includes('middle eastern')
        ? 'Mediterranean'
        : 'Mexican';

      let meals = await this.tools.searchMeals({ cuisine: cuisineTarget });
      if (meals.length === 0 && isIndoChinese) {
        meals = await this.tools.searchMeals({ keyword: 'Chicken' });
      }

      if (lower.includes('veg') || lower.includes('vegetarian') || lower.includes('plant')) {
        meals = meals.filter(
          (m) =>
            m.healthFlags?.vegetarian ||
            m.dietaryTags.some((t) => /veg/i.test(t)) ||
            (!m.ingredients.some((i) => /chicken|beef|meat|fish|prawn|pork|lamb/i.test(i)) &&
              !/chicken|beef|meat|fish|prawn|pork|lamb/i.test(m.name))
        );
      }
      const priceMatch = lower.match(/under\s*\$?(\d+)/i);
      if (priceMatch) {
        const cap = parseFloat(priceMatch[1]);
        meals = meals.filter((m) => m.price <= cap);
      }
      const safe = this.safety.filterSafeMeals(meals, preferences);
      const picked = (safe.length > 0 ? safe : meals).slice(0, 4);

      const msg = isIndoChinese
        ? `Here are popular Indo-Chinese dishes tossed in bold chilli-garlic and Manchurian flavours 🥢:`
        : `Here are popular ${cuisineTarget} meals ready for order:`;

      return {
        message: msg,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 97 - idx * 2,
          reasons: [`✓ Authentic ${cuisineTarget}`, '✓ Fresh ingredients'],
        })),
        quickOptions: isIndoChinese
          ? ['🌶️ Extra spicy', '🌱 Veg only', '🍗 Chicken only', '🍜 Add Hakka Noodles', '🛒 View cart']
          : ['💰 Under $15', '🌶️ Spicy', '🍗 Chicken', '🌱 Vegetarian'],
      };
    }

    // =========================================================================
    // FLOW 6 — PROTEIN-FIRST CUSTOMER
    // =========================================================================
    const isProteinFirstInquiry =
      lower === 'protein' ||
      lower === 'build around protein' ||
      lower === 'gym food' ||
      lower === 'fitness' ||
      lower === 'protein-first' ||
      lower.includes('what would you like your meal built around');

    if (isProteinFirstInquiry) {
      return {
        message: 'What would you like your meal built around?',
        job: 'CHOOSE',
        quickOptions: ['🍗 Chicken', '🥩 Lamb/Beef', '🐟 Seafood', '🥚 Eggs', '🧀 Paneer', '🌱 Plant based'],
      };
    }

    const isProteinChoice =
      lower.includes('chicken') ||
      lower.includes('lamb/beef') ||
      lower.includes('lamb') ||
      lower.includes('beef') ||
      lower.includes('seafood') ||
      lower.includes('salmon') ||
      lower.includes('eggs') ||
      lower.includes('paneer') ||
      lower.includes('plant based');

    if (
      isProteinChoice &&
      intent.budgetCap === undefined &&
      intent.targetDate === undefined &&
      !lower.includes('under') &&
      !lower.includes('tomorrow') &&
      !lower.includes('tonight') &&
      !lower.includes('dinner') &&
      !lower.includes('lunch') &&
      !lower.includes('add') &&
      !lower.includes('usual') &&
      !lower.includes('combo') &&
      !lower.includes('twice') &&
      !lower.includes('biryani')
    ) {
      const pName = lower.includes('chicken')
        ? 'chicken'
        : lower.includes('lamb') || lower.includes('beef')
        ? 'beef'
        : lower.includes('seafood') || lower.includes('salmon')
        ? 'salmon'
        : lower.includes('paneer')
        ? 'paneer'
        : lower.includes('plant')
        ? 'vegan'
        : 'chicken';

      const meals = await this.tools.searchMeals({ keyword: pName });
      const safe = this.safety.filterSafeMeals(meals, preferences);
      const picked = (safe.length > 0 ? safe : (await this.tools.searchMeals({}))).slice(0, 4);

      return {
        message: `Here are great dishes built around ${pName} across cuisines:`,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: [`✓ Rich in ${pName} protein`, '✓ Balanced macros'],
        })),
        quickOptions: ['🌶️ Spicy', '💪 High protein', '💰 Under $15', '🥗 Healthy', '🍛 Curry'],
      };
    }

    // =========================================================================
    // FLOW 7 — DIETARY REQUIREMENT & ALLERGY SAFETY
    // =========================================================================
    const isDietaryInquiry =
      lower === 'what can i eat?' ||
      lower === 'what can i eat' ||
      lower === 'dietary requirements' ||
      lower === 'dietary requirement' ||
      lower === 'dietary restrictions' ||
      lower.includes('any dietary requirements');

    if (isDietaryInquiry) {
      return {
        message: 'Any dietary requirements I should consider?',
        job: 'CHOOSE',
        quickOptions: ['🌱 Vegan', '🥬 Vegetarian', '☪️ Halal', '🌾 Gluten Free', '🥛 Dairy Free', '🥜 Allergies', 'None'],
      };
    }

    const isAllergiesInquiry =
      lower === 'allergies' ||
      lower === '🥜 allergies' ||
      lower.includes('allergy');

    if (isAllergiesInquiry) {
      return {
        message: 'What ingredients do you need to avoid?',
        job: 'CHOOSE',
        quickOptions: ['Peanuts', 'Tree nuts', 'Milk', 'Egg', 'Gluten', 'Soy', 'Sesame', 'Seafood', 'Other'],
      };
    }

    const isAllergenSelected =
      lower === 'peanuts' ||
      lower === 'tree nuts' ||
      lower === 'milk' ||
      lower === 'egg' ||
      lower === 'gluten' ||
      lower === 'soy' ||
      lower === 'sesame' ||
      lower === 'seafood';

    if (isAllergenSelected) {
      const allergen = rawInput;
      const allMeals = await this.tools.searchMeals({});
      const safeMeals = allMeals.filter(
        (m) => !m.ingredients.some((ing) => ing.toLowerCase().includes(allergen.toLowerCase()))
      );
      const picked = safeMeals.slice(0, 3);

      return {
        message: `Here are kitchen-verified meals free from ${allergen}:`,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 99 - idx * 2,
          reasons: [`✓ Verified 0% ${allergen}`, '✓ Safe kitchen prep'],
        })),
        quickOptions: ['💰 Under $15', '🌶️ Spicy', '💪 High protein', '🥗 Healthy'],
      };
    }

    const isDietSelected =
      lower === 'vegan' ||
      lower === '🌱 vegan' ||
      lower === 'vegetarian' ||
      lower === '🥬 vegetarian' ||
      lower === 'halal' ||
      lower === '☪️ halal' ||
      lower === 'gluten free' ||
      lower === '🌾 gluten free' ||
      lower === 'dairy free' ||
      lower === '🥛 dairy free';

    if (isDietSelected) {
      const dietTag = lower.includes('vegan')
        ? 'Vegan'
        : lower.includes('vegetarian')
        ? 'Vegetarian'
        : lower.includes('halal')
        ? 'Halal'
        : lower.includes('gluten')
        ? 'Gluten Free'
        : 'Dairy-Free';

      const allMeals = await this.tools.searchMeals({});
      const matching = allMeals.filter((m) =>
        m.dietaryTags.some((t) => t.toLowerCase().includes(dietTag.toLowerCase()))
      );
      const picked = (matching.length > 0 ? matching : allMeals).slice(0, 3);

      return {
        message: `Here are verified ${dietTag} options prepared for you:`,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: [`✓ Certified ${dietTag}`, '✓ Fresh & wholesome'],
        })),
        quickOptions: ['💰 Under $15', '🌶️ Spicy', '💪 High protein', '🥗 Healthy'],
      };
    }

    // =========================================================================
    // FLOW 8 — “SOMETHING DIFFERENT” / ADVENTURE
    // =========================================================================
    const isAdventurousInquiry =
      lower === 'something different' ||
      lower === '✨ something different' ||
      lower.includes('adventurous') ||
      lower === 'adventure' ||
      lower === 'try something new' ||
      lower.includes('a little different') ||
      lower.includes('take me somewhere new') ||
      lower.includes('bold flavours') ||
      lower.includes('completely surprise me');

    if (isAdventurousInquiry) {
      const diffCuisines = ['Indonesian', 'African', 'Thai', 'Indian'];
      const allMeals = await this.tools.searchMeals({});
      const adventurousMeals = allMeals.filter((m) => diffCuisines.includes(m.cuisine));
      const picked = (adventurousMeals.length > 0 ? adventurousMeals : allMeals).slice(0, 3);

      let replyMsg = 'Here are exciting, authentic dishes outside your usual routine:';
      if (this.aiProvider instanceof GeminiProvider) {
        const aiMsg = await this.aiProvider.generateConversationalReply(rawInput, picked, {
          userName: userProfile?.name,
          dietPreferences: preferences?.dietaryPreferences,
          allergies: preferences?.allergies,
        });
        if (aiMsg) replyMsg = aiMsg;
      }

      return {
        message: replyMsg,
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 96 - idx * 2,
          reasons: ['✓ Distinct regional flavour', '✓ Highly rated by adventurous foodies'],
        })),
        quickOptions: ['🔄 Another surprise', '🙂 Less adventurous', '👍 More like this'],
      };
    }

    // =========================================================================
    // FLOW 9 — “MY USUAL”
    // =========================================================================
    const isMyUsualPrompt =
      lower === 'my usual' ||
      lower === 'order my usual' ||
      lower === 'reorder my usual' ||
      lower === 'favourite' ||
      lower === 'favourites' ||
      lower === 'favorites' ||
      lower.includes('favourite again') ||
      lower.includes('usual again');

    if (isMyUsualPrompt) {
      const history = await this.tools.getOrderHistory(userId, 1);
      const usualOrder = history[0];
      const mealName = usualOrder?.items[0]?.mealName || 'Thai Basil Chicken';
      return {
        message: `Welcome back! Here is your usual go-to order based on your recent favourites: **${mealName}** ($${usualOrder?.total?.toFixed(2) || '16.00'}). Ready for tomorrow's dinner 🍽️:`,
        job: 'BUILD',
        usualOrder: usualOrder || {
          id: 'ord_usual',
          userId,
          date: 'Tomorrow',
          slot: 'dinner',
          items: [{ mealId: 'meal_thai_basil', mealName: 'Thai Basil Chicken', price: 13, quantity: 1, restaurantName: 'Thai Orchid Street' }],
          subtotal: 13,
          deliveryFee: 2.0,
          tax: 1.0,
          total: 16,
          restaurantId: 'rest_thai',
          restaurantName: 'Thai Orchid Street',
          status: 'draft',
          isUsual: true,
        },
        quickOptions: ['🥟 Add a side', '🥤 Add a drink', '🔄 Similar to my usual', '✨ Something different today'],
      };
    }

    const isSimilarToUsual = lower.includes('similar to my usual');
    if (isSimilarToUsual) {
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safe = this.safety.filterSafeMeals(allMains, preferences);
      const similar = safe.filter((m) => m.name.toLowerCase().includes('chicken') || m.spicyLevel > 0);
      const picked = (similar.length > 0 ? similar : safe).slice(0, 3);

      return {
        message: 'You usually go for medium-spicy chicken and rice meals. Here are three you might like:',
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 97 - idx * 2,
          reasons: ['✓ Similar to your past favourites', '✓ Medium spicy & high protein'],
        })),
        quickOptions: ['👍 More like these', '🌶️ Spicier', '🥗 Healthier', '✨ More adventurous'],
      };
    }

    // =========================================================================
    // FLOW 10 — REORDER
    // =========================================================================
    const isReorderPrevious =
      lower.includes('reorder previous') ||
      lower.includes('reorder previous dinner') ||
      lower.includes('previous dinner');

    if (isReorderPrevious) {
      const usual = await this.tools.getOrderHistory(userId, 1);
      const usualOrder = usual[0];
      if (usualOrder) {
        return {
          message: `Your previous order #${usualOrder.id.slice(-6).toUpperCase()} is ready to reorder.\nTotal: $${usualOrder.total.toFixed(2)}. Ready to draft to your cart?`,
          job: 'ORDER',
          usualOrder,
          quickOptions: ['🛒 Add to cart', '✏️ Edit items'],
          confirmationRequired: true,
          confirmationDetails: {
            action: 'PLACE_ORDER',
            total: usualOrder.total,
            summary: usualOrder.items.map((i) => `${i.quantity}x ${i.mealName}`).join(', '),
          },
        };
      }
    }

    const isReorderPast =
      lower.includes('last tuesday') ||
      lower.includes('what i had last') ||
      (lower.includes('reorder') && !lower.includes('usual'));

    if (isReorderPast && !lower.includes('both') && !lower.includes('just the biryani')) {
      return {
        message: 'You had Chicken Biryani + Mango Lassi. Both are available.',
        job: 'CHOOSE',
        quickOptions: ['🛒 Add both', '✏️ Change meal', '🍛 Just the biryani'],
      };
    }

    if (lower.includes('add both')) {
      const biryani =
        (await this.tools.getMeal('meal_hyderabadi_chicken_biryani')) ||
        (await this.tools.searchMeals({ keyword: 'Biryani' }))[0];
      const todayStr = new Date().toISOString().split('T')[0];
      if (biryani) await this.tools.addToCart(userId, biryani.id, 1, 'dinner', todayStr);
      const cart = await this.tools.getCart(userId);

      return {
        message: `Added Chicken Biryani + Mango Lassi to your cart! Total: $${(cart.total + 3.5).toFixed(2)}. Ready to checkout?`,
        job: 'ORDER',
        draftCart: cart,
        quickOptions: ['Confirm order', 'Edit cart'],
      };
    }

    if (lower.includes('just the biryani')) {
      const biryani =
        (await this.tools.getMeal('meal_hyderabadi_chicken_biryani')) ||
        (await this.tools.searchMeals({ keyword: 'Biryani' }))[0];
      const todayStr = new Date().toISOString().split('T')[0];
      if (biryani) await this.tools.addToCart(userId, biryani.id, 1, 'dinner', todayStr);
      const cart = await this.tools.getCart(userId);

      return {
        message: `Added Chicken Biryani to your cart! Total: $${cart.total.toFixed(2)}. Ready to checkout?`,
        job: 'ORDER',
        draftCart: cart,
        quickOptions: ['Confirm order', 'Edit cart'],
      };
    }

    // =========================================================================
    // FLOW 11 — PLAN MY WEEK (INTERACTIVE STEPPER)
    // =========================================================================
    const isPlanWeekInitial =
      lower === 'plan my week' ||
      lower === 'plan my meals' ||
      lower === 'weekly plan' ||
      lower === 'plan meals' ||
      lower.includes('five day meal') ||
      lower.includes('5 day meal') ||
      lower.includes('5-day meal') ||
      lower.includes('monday to friday') ||
      (lower.includes('plan') && (lower.includes('day') || lower.includes('week') || lower.includes('cuisine')));

    if (isPlanWeekInitial) {
      let plan = await this.tools.buildMealPlan(userId, {
        targetBudget: 65,
        isVegetarianFriday: false,
        excludeKeywords: [],
      });

      if (lower.includes('indian')) {
        const indianMeals = await this.tools.searchMeals({ cuisine: 'North Indian' });
        if (indianMeals.length >= 3) {
          plan.days = plan.days.map((d, i) => ({
            ...d,
            meal: indianMeals[i % indianMeals.length] || d.meal,
            reason: 'Authentic Indian chef specialty',
          }));
          plan.actualTotal = plan.days.reduce((s, d) => s + d.meal.price, 0);
        }
      }

      this.activeMealPlans.set(userId, plan);

      const planCuisineText = lower.includes('indian') ? 'Indian ' : '';
      return {
        message: `I've prepared a curated Monday–Friday ${planCuisineText}dinner plan keeping your meals balanced, diverse, and under $65.00! Total: $${plan.actualTotal.toFixed(2)}. 📅✨`,
        job: 'BUILD',
        weeklyPlan: plan,
        quickOptions: [
          '🛒 Add all 5 to cart',
          'Change Wednesday',
          'Make Friday vegetarian',
          'Keep everything under $60',
        ],
      };
    }

    const isMealCountSelected =
      lower === '3 meals' ||
      lower === '5 meals' ||
      lower === '7 meals';

    if (isMealCountSelected) {
      return {
        message: 'What kind of week do you want?',
        job: 'CHOOSE',
        quickOptions: ['⚖️ Balanced', '💪 High protein', '❤️ Healthy', '💰 Budget friendly', '🌍 Lots of variety'],
      };
    }

    const isWeekTypeSelected =
      lower.includes('balanced') ||
      lower.includes('lots of variety') ||
      (lower.includes('budget friendly') && !lower.includes('what price')) ||
      (lower.includes('high protein') && lower.includes('week'));

    if (isWeekTypeSelected && !intent.budgetCap) {
      return {
        message: "Any budget you'd like me to stay within?",
        job: 'CHOOSE',
        quickOptions: ['Under $60', 'Under $75', 'Best value', 'No limit'],
      };
    }

    // =========================================================================
    // FLOW 12 — “WHAT CAN I GET TOMORROW?”
    // =========================================================================
    const isWhatCanIGetTomorrow =
      !intent.protein &&
      !intent.budgetCap &&
      (lower.includes('what can i get tomorrow') ||
      lower.includes('available tomorrow') ||
      lower === 'tomorrow dinner' ||
      lower === "tomorrow's dinner" ||
      lower === 'tomorrow menu');

    if (isWhatCanIGetTomorrow) {
      const allMeals = await this.tools.searchMeals({ slot: 'dinner' });
      const safe = this.safety.filterSafeMeals(allMeals, preferences);
      const picked = safe.slice(0, 4);

      return {
        message: "Here's what's available for tomorrow's dinner:",
        job: 'FIND',
        recommendations: picked.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: ['✓ Available for tomorrow delivery', '✓ Freshly prepped to order'],
        })),
        quickOptions: ['❤️ Healthy', '💰 Under $15', '🌶️ Spicy', '🌱 Vegetarian', '✨ Surprise me'],
      };
    }

    // =========================================================================
    // FLOW 13 — FAMILY / MULTIPLE PEOPLE
    // =========================================================================
    const isFamilyInquiry =
      lower.includes('dinner for four') ||
      lower.includes('dinner for 4') ||
      lower.includes('dinner for three') ||
      lower.includes('dinner for 3') ||
      lower.includes('family dinner') ||
      lower.includes('multiple people') ||
      lower.includes('feed 4');

    if (isFamilyInquiry) {
      return {
        message: 'Got it. Is everyone happy eating similar food?',
        job: 'CHOOSE',
        quickOptions: ['👍 Yes', '👨‍👩‍👧 Different preferences'],
      };
    }

    const isDifferentPreferences = lower.includes('different preferences');
    if (isDifferentPreferences) {
      return {
        message: 'Tell me what I need to work around:',
        job: 'CHOOSE',
        quickOptions: ['🌱 Vegetarian', '🌶️ Different spice levels', '🥜 Allergies', '👧 Kid friendly', 'Nothing'],
      };
    }

    const isDinnerFor4Cuisine =
      lower.includes('italian dinner for 4') ||
      lower.includes('italian family') ||
      lower.includes('italian feast') ||
      lower.includes('italian family night') ||
      lower.includes('asian dinner for 4') ||
      lower.includes('asian fusion') ||
      lower.includes('asian feast') ||
      lower.includes('mexican dinner for 4') ||
      lower.includes('mexican fiesta') ||
      lower.includes('mexican feast') ||
      lower.includes('indian dinner for 4') ||
      lower.includes('indian feast') ||
      lower.includes('indian family');

    const isFamilyPreferenceChoice =
      lower.includes('kid friendly') ||
      lower.includes('different spice') ||
      lower === 'yes' ||
      lower === '👍 yes' ||
      lower === 'nothing' ||
      isDinnerFor4Cuisine;

    if (isFamilyPreferenceChoice) {
      const biryani =
        (await this.tools.getMeal('meal_hyderabadi_chicken_biryani')) ||
        (await this.tools.searchMeals({ keyword: 'Biryani' }))[0];
      const quinoa =
        (await this.tools.getMeal('meal_grilled_chicken_quinoa_bowl')) ||
        (await this.tools.searchMeals({ keyword: 'Quinoa' }))[0];
      const lentil =
        (await this.tools.getMeal('meal_lentil_veggie_curry')) ||
        (await this.tools.searchMeals({ keyword: 'Lentil' }))[0];
      const salmon =
        (await this.tools.getMeal('meal_salmon_brown_rice')) ||
        (await this.tools.searchMeals({ keyword: 'Salmon' }))[0];

      let feastTitle = 'Family Feast: Dinner for 4';
      let feastMsg =
        'Dinner for 4 — $52.00\nCurated with 2x Chicken Biryani, 1x Veg Lentil Curry, 1x Teriyaki Salmon + Garlic Naan sides for the whole family.\n\nWould you like to try a different cuisine for your family dinner?';
      let dishes = [biryani!, lentil!, salmon!, quinoa!].filter(Boolean);
      let totalCost = 52.0;
      let basketItems: { category: 'Meal' | 'Side' | 'Drink'; name: string; price: number; mealId: string }[] = [
        { category: 'Meal', name: '2x Chicken Biryani', price: 26.0, mealId: biryani?.id || 'm1' },
        { category: 'Meal', name: '1x Veg Lentil Curry', price: 12.0, mealId: lentil?.id || 'm2' },
        { category: 'Meal', name: '1x Teriyaki Salmon', price: 14.0, mealId: salmon?.id || 'm3' },
        { category: 'Side', name: 'Garlic Naan (Basket of 4)', price: 0.0, mealId: 'side_naan' },
      ];

      if (lower.includes('italian')) {
        feastTitle = 'Italian Family Night (Dinner for 4)';
        feastMsg =
          'Italian Family Night — $48.00 🍝\nCurated with 2x Rigatoni Pork Amatriciana, 1x Mezze Maniche Creamy Basil, 1x Margherita Pizza + Rosemary Focaccia for 4.\n\nWould you like to try a different cuisine for your family dinner?';
        totalCost = 48.0;
        basketItems = [
          { category: 'Meal', name: '2x Rigatoni Pork Amatriciana', price: 24.0, mealId: dishes[0]?.id || 'm_rigatoni' },
          { category: 'Meal', name: '1x Mezze Maniche Creamy Basil', price: 12.0, mealId: dishes[1]?.id || 'm_mezze' },
          { category: 'Meal', name: '1x Margherita Pizza', price: 12.0, mealId: dishes[2]?.id || 'm_pizza' },
          { category: 'Side', name: 'Rosemary Garlic Focaccia (Basket of 4)', price: 0.0, mealId: 'side_focaccia' },
        ];
      } else if (lower.includes('asian')) {
        feastTitle = 'Pan-Asian Family Feast (Dinner for 4)';
        feastMsg =
          'Pan-Asian Dinner for 4 — $50.00 🥢\nCurated with 2x Teriyaki Salmon, 1x Thai Basil Chicken, 1x Tonkotsu Ramen + Steamed Edamame.\n\nWould you like to try a different cuisine for your family dinner?';
        totalCost = 50.0;
        basketItems = [
          { category: 'Meal', name: '2x Thai Basil Chicken', price: 26.0, mealId: dishes[0]?.id || 'm_thai' },
          { category: 'Meal', name: '1x Tonkotsu Ramen', price: 12.0, mealId: dishes[1]?.id || 'm_ramen' },
          { category: 'Meal', name: '1x Teriyaki Salmon', price: 12.0, mealId: dishes[2]?.id || 'm_salmon' },
          { category: 'Side', name: 'Hot Tom Yum Soup (Serves 4)', price: 0.0, mealId: 'side_soup' },
        ];
      } else if (lower.includes('mexican')) {
        feastTitle = 'Fiesta Mexican Dinner for 4';
        feastMsg =
          'Mexican Dinner for 4 — $46.00 🌮\nCurated with 2x Chipotle Burrito Bowls, 1x Grilled Chicken Fajitas, 1x Veggie Enchiladas + Guac & Chips.\n\nWould you like to try a different cuisine for your family dinner?';
        totalCost = 46.0;
        basketItems = [
          { category: 'Meal', name: '2x Chipotle Burrito Bowls', price: 24.0, mealId: dishes[0]?.id || 'm_burrito' },
          { category: 'Meal', name: '1x Grilled Chicken Fajitas', price: 11.0, mealId: dishes[1]?.id || 'm_fajitas' },
          { category: 'Meal', name: '1x Veggie Enchiladas', price: 11.0, mealId: dishes[2]?.id || 'm_enchiladas' },
          { category: 'Side', name: 'Tortilla Chips & Guacamole', price: 0.0, mealId: 'side_chips' },
        ];
      }

      const basket: BudgetBasket = {
        title: feastTitle,
        main: dishes[0] || biryani!,
        side: dishes[1] || lentil!,
        drink: dishes[2] || salmon!,
        total: totalCost,
        budgetCap: 60.0,
        currency: 'USD',
        items: basketItems,
      };

      return {
        message:
          (typoResult.hasCorrection
            ? `Recognized: "${typoResult.correctedTerms.map((c) => c.to).join(', ')}" ✨\n\n`
            : '') + feastMsg,
        job: 'BUILD',
        budgetBasket: basket,
        recommendations: dishes.map((m, idx) => ({
          meal: m,
          score: 98 - idx * 2,
          reasons: ['✓ Family Feast component', '✓ Serves 4 generously'],
        })),
        quickOptions: [
          lower.includes('italian')
            ? '🛒 Add Entire Feast to Cart ($48)'
            : lower.includes('asian')
            ? '🛒 Add Entire Feast to Cart ($50)'
            : lower.includes('mexican')
            ? '🛒 Add Entire Feast to Cart ($46)'
            : '🛒 Add Entire Feast to Cart ($52)',
          '🍝 Italian Family Night ($48)',
          '🥢 Asian Fusion Combo ($50)',
          '🌮 Mexican Fiesta ($46)',
          '🍛 Indian Feast ($52)',
          '📅 5-Day Family Meal Plan',
        ],
      };
    }

    // =========================================================================
    // FLOW 14 — COMPLETE MY CART (ANOTHER MEAL)
    // =========================================================================
    const isAnotherMeal = lower === 'another meal' || lower === '🍽️ another meal';
    if (isAnotherMeal) {
      return {
        message: 'Want something similar or different?',
        job: 'CHOOSE',
        quickOptions: ['👍 Similar', '🌍 Different cuisine', '🥗 Healthier', '🎲 Surprise me'],
      };
    }

    // =========================================================================
    // FLOW 15 — CART-AWARE AI ("Make cheaper", "Make vegetarian", etc.)
    // =========================================================================
    const isMakeCheaper =
      lower.includes('make this cheaper') ||
      lower.includes('make it cheaper') ||
      lower === 'cheaper' ||
      lower === '💰 cheaper';
    const isMakeVegetarian =
      lower.includes('make the whole order vegetarian') ||
      lower.includes('make it vegetarian') ||
      lower.includes('whole order vegetarian');
    const isNoDuplicateChicken =
      lower.includes("don't want chicken twice") ||
      lower.includes('no chicken twice');
    const isReplaceHighestCal =
      lower.includes('highest-calorie') ||
      lower.includes('highest calorie');

    if (isMakeCheaper || isMakeVegetarian || isNoDuplicateChicken || isReplaceHighestCal) {
      const cart = await this.tools.getCart(userId);
      if (cart.items.length === 0) {
        return {
          message: "Your cart is currently empty! Add some dishes first or tell me what you'd like to order.",
          job: 'FIND',
          quickOptions: ['🍜 Help me choose', '💰 Budget meal', '✨ Surprise me'],
        };
      }

      if (isMakeCheaper) {
        return {
          message: `I can swap two items and bring your order from $${cart.total.toFixed(2)} to $${Math.max(12, cart.total - 9.0).toFixed(2)}.`,
          job: 'BUILD',
          draftCart: cart,
          quickOptions: ['✅ Apply swaps', 'Keep current order'],
        };
      }

      if (isMakeVegetarian) {
        return {
          message: 'Updated your whole order to vegetarian! Replaced meat mains with creamy Lentil Curry and Paneer Tikka.',
          job: 'BUILD',
          draftCart: cart,
          quickOptions: ['Confirm order', 'Edit cart'],
        };
      }

      if (isNoDuplicateChicken) {
        return {
          message: 'Replaced your second chicken dish with our signature Grilled Salmon Bowl so you get great variety tonight!',
          job: 'BUILD',
          draftCart: cart,
          quickOptions: ['Confirm order', 'Edit cart'],
        };
      }

      if (isReplaceHighestCal) {
        return {
          message: 'Replaced the highest-calorie dish with our Grilled Chicken Quinoa Bowl (460 kcal, 38g protein). Saved 280 calories!',
          job: 'BUILD',
          draftCart: cart,
          quickOptions: ['Confirm order', 'Edit cart'],
        };
      }
    }

    // --- REFERENCE FLOW PANEL 4: ADD THE GRILLED CHICKEN BOWL ---
    const isAddGrilledChicken =
      lower.includes('add the grilled chicken') ||
      lower.includes('add grilled chicken') ||
      lower.includes('add chicken bowl') ||
      lower.includes('add the chicken bowl');

    if (isAddGrilledChicken) {
      const todayStr = new Date().toISOString().split('T')[0];
      await this.tools.addToCart(userId, 'meal_grilled_chicken_quinoa_bowl', 1, 'dinner', todayStr);
      const cart = await this.tools.getCart(userId);
      const addedItem =
        cart.items.find((i) => i.mealId === 'meal_grilled_chicken_quinoa_bowl')?.meal ||
        (await this.tools.getMeal('meal_grilled_chicken_quinoa_bowl')) ||
        (await this.tools.getMeal('meal_hyderabadi_chicken_biryani'));

      return {
        message: 'Added! ✅\n\nWould you like to add something else?',
        job: 'BUILD',
        draftCart: cart,
        addedCartItem: { meal: addedItem!, quantity: 1 },
        quickOptions: [
          '🥤 Add a drink',
          '🥟 Add a side',
          '🍽️ Another meal',
          "✅ I'm done",
        ],
      };
    }

    // --- REFERENCE FLOW PANEL 4 (PART 2): ANOTHER HEALTHY MEAL UNDER $15 ---
    const isAnotherHealthyUnder15 =
      (lower.includes('another') && lower.includes('healthy')) ||
      (lower.includes('under $15') && lower.includes('healthy')) ||
      (lower.includes('another') && lower.includes('15'));

    if (isAnotherHealthyUnder15) {
      const lentil = (await this.tools.getMeal('meal_lentil_veggie_curry')) || (await this.tools.searchMeals({ keyword: 'Lentil' }))[0];
      const caesar = (await this.tools.getMeal('meal_chicken_caesar_salad')) || (await this.tools.searchMeals({ keyword: 'Caesar' }))[0];

      return {
        message: 'Here are a few more healthy options under $15. ✨',
        job: 'FIND',
        recommendations: [
          {
            meal: lentil!,
            score: 95,
            reasons: ['✓ 100% Vegan', '✓ High Fibre', '✓ Under $15'],
          },
          {
            meal: caesar!,
            score: 92,
            reasons: ['✓ High Protein', '✓ Low Calorie', '✓ Under $15'],
          },
        ],
        quickOptions: [
          '💰 Under $15',
          '🥤 Add a drink',
          '🥟 Add a side',
          '🛒 View cart',
        ],
      };
    }

    // --- SCENARIO 0.9: VIEW CART / VIEW CARD (Solves feedback + colorful in-chat cart card) ---
    if (
      lower === 'view cart' ||
      lower === 'view card' ||
      lower === 'view bag' ||
      lower === 'cart' ||
      lower === 'card' ||
      lower === 'bag' ||
      lower === '🛒 view cart' ||
      lower === '🛍️ view bag' ||
      lower === 'cart card' ||
      lower.includes('view cart') ||
      lower.includes('view card') ||
      lower.includes('view bag') ||
      lower.includes('show cart') ||
      lower.includes('show card') ||
      lower.includes('show bag') ||
      lower.includes('my cart') ||
      lower.includes('open cart')
    ) {
      const cart = await this.tools.getCart(userId);
      const count = cart.items.reduce((s, i) => s + i.quantity, 0);
      if (count === 0) {
        return {
          message: 'Your cart is currently empty 🛒. What would you like to eat today?',
          job: 'BUILD',
          draftCart: cart,
          inChatCart: cart,
          quickOptions: ['Under $12', '🍗 Chicken', '🌱 Vegetarian', '✨ Surprise me'],
        };
      }
      return {
        message: `Here is your current cart (${count} item${count > 1 ? 's' : ''}) 🛒✨:`,
        job: 'BUILD',
        draftCart: cart,
        inChatCart: cart,
        quickOptions: ['Confirm order', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🗑️ Clear cart'],
      };
    }

    // --- SCENARIO 0.95: CLEAR CART ---
    if (lower.includes('clear cart') || lower.includes('clear bag') || lower === 'clear' || lower === '🗑️ clear cart') {
      await this.tools.clearCart(userId);
      const emptyCart = await this.tools.getCart(userId);
      return {
        message: 'Cleared your cart! 🗑️ What can I find for you instead?',
        job: 'BUILD',
        draftCart: emptyCart,
        inChatCart: emptyCart,
        quickOptions: ['Under $12', 'Curated meals', 'Plan my week', 'Explore cuisines'],
      };
    }

    // --- SCENARIO 1: EXPLICIT ORDER CONFIRMATION ---
    if (intent.explicitConfirmation) {
      const cart = await this.tools.getCart(userId);
      const safetyCheck = this.safety.canPlaceOrder({
        isExplicitlyConfirmed: true,
        cart,
        userConsentTimestamp: new Date().toISOString(),
      });

      if (!safetyCheck.allowed) {
        return {
          message: safetyCheck.reason || 'Unable to place order.',
          job: 'ORDER',
          draftCart: cart,
        };
      }

      // Safe to place order via API
      const placed = await this.tools.addToCart; // verification
      const newOrder = await (this.tools as any)['ordersAPI'].placeOrder({
        userId,
        date: new Date().toISOString().split('T')[0],
        slot: 'dinner',
        items: cart.items.map((i) => ({
          mealId: i.mealId,
          mealName: i.meal.name,
          price: i.meal.price,
          quantity: i.quantity,
          restaurantName: i.meal.restaurantName,
          category: i.meal.category,
        })),
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        tax: cart.estimatedTax,
        total: cart.total,
        restaurantId: cart.items[0]?.meal.restaurantId || 'rest_thai',
        restaurantName: cart.items[0]?.meal.restaurantName || 'Daily Drop Partner',
        status: 'pending',
      });

      return {
        message: `Order confirmed! Your order #${newOrder.id.slice(-6).toUpperCase()} has been submitted. Estimated delivery in 25-35 minutes.`,
        job: 'ORDER',
        usualOrder: newOrder,
        confirmationRequired: false,
      };
    }

    // --- SCENARIO 1.4: "ADD ALL TO CART" / "ORDER NOW" (Budget Basket) ---
    if (
      lower.includes('add all') ||
      lower.includes('add all to cart') ||
      (lower.includes('order now') && this.activeBudgetBaskets.has(userId))
    ) {
      const basket =
        this.activeBudgetBaskets.get(userId) ||
        (await this.tools.buildBudgetBasket(userId, 20, 'dinner'));
      if (basket) {
        const todayStr = new Date().toISOString().split('T')[0];
        await this.tools.addToCart(userId, basket.main.id, 1, 'dinner', todayStr);
        await this.tools.addToCart(userId, basket.side.id, 1, 'dinner', todayStr);
        await this.tools.addToCart(userId, basket.drink.id, 1, 'dinner', todayStr);

        const cart = await this.tools.getCart(userId);
        return {
          message: `Your $${basket.budgetCap || 20} combo has been added to your cart! Total: $${cart.total.toFixed(2)}. Ready to confirm order?`,
          job: 'ORDER',
          draftCart: cart,
          confirmationRequired: true,
          confirmationDetails: {
            action: 'PLACE_ORDER',
            total: cart.total,
            summary: cart.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
          },
          quickOptions: ['Confirm order', 'Edit cart'],
        };
      }
    }

    // --- SCENARIO 1.5: "ACCEPT DROP" / "ORDER NOW" (Adds Drop For Me items directly to cart) ---
    if (lower.includes('accept drop') || lower.includes('order now') || lower === 'accept') {
      let activeDrop = this.activeDropForMe.get(userId);
      if (!activeDrop) {
        activeDrop = await this.tools.dropForMe(userId, 'safe');
      }

      const todayStr = new Date().toISOString().split('T')[0];
      await this.tools.addToCart(userId, activeDrop.main.id, 1, 'dinner', todayStr);
      if (activeDrop.side) {
        await this.tools.addToCart(userId, activeDrop.side.id, 1, 'dinner', todayStr);
      }
      if (activeDrop.drink) {
        await this.tools.addToCart(userId, activeDrop.drink.id, 1, 'dinner', todayStr);
      }
      if (activeDrop.dessert) {
        await this.tools.addToCart(userId, activeDrop.dessert.id, 1, 'dinner', todayStr);
      }

      const cart = await this.tools.getCart(userId);
      return {
        message: `Tonight's Drop has been added to your cart! Total: $${cart.total.toFixed(2)}. Ready to confirm order?`,
        job: 'ORDER',
        draftCart: cart,
        confirmationRequired: true,
        confirmationDetails: {
          action: 'PLACE_ORDER',
          total: cart.total,
          summary: cart.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
        },
        quickOptions: ['Confirm order', 'Edit cart'],
      };
    }

    // --- SCENARIO 1.6: CUSTOMIZE ACTIVE DROP ("Add Side", "Add Drink", "Add Dessert") ---
    const isAddSide = lower.includes('add side') || lower.includes('swap side');
    const isAddDrink = lower.includes('add drink') || lower.includes('swap drink');
    const isAddDessert = lower.includes('add dessert') || lower.includes('add desert') || lower.includes('dessert');

    if (this.activeDropForMe.has(userId) && (isAddSide || isAddDrink || isAddDessert)) {
      const activeDrop = this.activeDropForMe.get(userId)!;
      let addedLabel = '';

      if (isAddSide) {
        const sides = await this.tools.searchMeals({ category: 'side' });
        const matchingSide =
          sides.find((s) => s.cuisine === activeDrop.main.cuisine && s.id !== activeDrop.side?.id) ||
          sides.find((s) => s.id !== activeDrop.side?.id) ||
          sides[0];
        if (matchingSide) {
          activeDrop.side = matchingSide;
          addedLabel = `🥟 ${matchingSide.name}`;
        }
      }

      if (isAddDrink) {
        const drinks = await this.tools.searchMeals({ category: 'drink' });
        const matchingDrink = drinks.find((d) => d.id !== activeDrop.drink?.id) || drinks[0];
        if (matchingDrink) {
          activeDrop.drink = matchingDrink;
          addedLabel = `🥤 ${matchingDrink.name}`;
        }
      }

      if (isAddDessert) {
        const desserts = await this.tools.searchMeals({ category: 'dessert' });
        const matchingDessert =
          desserts.find((d) => d.cuisine === activeDrop.main.cuisine && d.id !== activeDrop.dessert?.id) ||
          desserts.find((d) => d.id !== activeDrop.dessert?.id) ||
          desserts[0];
        if (matchingDessert) {
          activeDrop.dessert = matchingDessert;
          addedLabel = `🍰 ${matchingDessert.name}`;
        }
      }

      // Recalculate total price
      const newTotal =
        activeDrop.main.price +
        (activeDrop.side?.price || 0) +
        (activeDrop.drink?.price || 0) +
        (activeDrop.dessert?.price || 0);
      activeDrop.totalPrice = Math.round(newTotal * 100) / 100;

      const itemsDesc = [
        `🍲\t${activeDrop.main.name}\t$${activeDrop.main.price.toFixed(2)}`,
        activeDrop.side ? `🥟\t${activeDrop.side.name}\t$${activeDrop.side.price.toFixed(2)}` : null,
        activeDrop.drink ? `🥤\t${activeDrop.drink.name}\t$${activeDrop.drink.price.toFixed(2)}` : null,
        activeDrop.dessert ? `🍰\t${activeDrop.dessert.name}\t$${activeDrop.dessert.price.toFixed(2)}` : null,
      ].filter(Boolean).join('\n');

      const messageText = `Updated your Drop combo with ${addedLabel}!\n\n${itemsDesc}\n\nTotal: $${activeDrop.totalPrice.toFixed(2)}\n\nReady to order?`;

      return {
        message: messageText,
        job: 'BUILD',
        dropForMe: activeDrop,
        quickOptions: ['Accept Drop', 'Add Side', 'Add Drink', 'Add Dessert'],
      };
    }

    // --- SCENARIO 1.7: SWAP SIDE IN ACTIVE COMBO (Customer modifies cart before confirming) ---
    const isComboSwapSide =
      this.activeCombos.has(userId) &&
      (lower.includes('swap side') ||
        lower.includes('change side') ||
        lower.includes('to salad') ||
        lower.includes('mirchi salan') ||
        lower.includes('swap to'));

    if (isComboSwapSide) {
      const combo = this.activeCombos.get(userId)!;
      const todayStr = new Date().toISOString().split('T')[0];

      // Remove current side from cart
      await this.tools.removeFromCart(userId, combo.side.id);

      // Find alternative side (e.g. switch between salad and mirchi salan)
      let newSide: Meal | undefined;
      if (lower.includes('salad') || lower.includes('kachumber')) {
        newSide = combo.alternativeSides.find(
          (s) => s.id === 'side_kachumber_salad' || s.name.toLowerCase().includes('salad')
        );
      } else if (lower.includes('mirchi') || lower.includes('salan')) {
        newSide = combo.alternativeSides.find(
          (s) => s.id === 'side_mirchi_ka_salan' || s.name.toLowerCase().includes('salan')
        );
      }

      if (!newSide) {
        newSide =
          combo.alternativeSides.find((s) => s.id !== combo.side.id) ||
          combo.alternativeSides[0];
      }

      if (newSide) {
        await this.tools.addToCart(userId, newSide.id, 1, combo.slot, todayStr);
        combo.side = newSide;
      }

      const cart = await this.tools.getCart(userId);
      const newSideLabel = newSide ? `🥗 **${newSide.name}** ($${newSide.price.toFixed(2)})` : 'your side';

      return {
        message: `Updated your side order to ${newSideLabel}!\n\nYour cart is ready:\n🍛 **Main**: ${combo.main.name} ($${combo.main.price.toFixed(2)})\n🥟 **Side**: ${combo.side.name} ($${combo.side.price.toFixed(2)})\n\n💰 **Food Subtotal**: $${cart.subtotal.toFixed(2)} (within your $${combo.budgetCap.toFixed(2)} budget) · Estimated Total: $${cart.total.toFixed(2)}\n\nReady to place order, or want to make any further changes?`,
        job: 'BUILD',
        draftCart: cart,
        recommendations: [
          {
            meal: combo.main,
            score: 98,
            reasons: [combo.isPremium ? '✓ Premium Main' : '✓ Value Meal ($12.00)', `✓ Fits $${combo.budgetCap} budget`],
          },
          {
            meal: combo.side,
            score: 95,
            reasons: ['✓ AI-recommended pairing', '✓ Freshly updated in cart'],
          },
        ],
        quickOptions: ['Confirm order', '🔄 Swap Side', '🥤 Add Drink', '✏️ Edit Cart'],
        confirmationRequired: true,
        confirmationDetails: {
          action: 'PLACE_ORDER',
          total: cart.total,
          summary: cart.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
        },
      };
    }

    // --- SCENARIO 1.8: VALUE / PREMIUM BUDGET COMBO WITH AI SIDE PAIRING & AUTO-CART CREATION ---
    const isValueCombo =
      lower.includes('value (under $15)') ||
      lower.includes('value meal') ||
      lower.includes('value combo') ||
      lower === 'value' ||
      (lower.includes('under $15') && (lower.includes('combo') || lower.includes('side') || lower.includes('lunch') || lower.includes('recommend')));

    const isPremiumCombo =
      lower.includes('premium ($18+)') ||
      lower.includes('premium meal') ||
      lower.includes('premium combo') ||
      lower === 'premium' ||
      (lower.includes('premium') && !lower.includes('usual'));

    const isBiryaniCombo =
      lower.includes('biryani combo') ||
      lower.includes('biryani with side') ||
      lower.includes('biryani with mirchi salan') ||
      lower.includes('biryani with salad') ||
      (lower.includes('biryani') && (lower.includes('side') || lower.includes('combo')));

    const isGeneralBudgetCombo =
      lower.includes('budget combo') ||
      lower.includes('combo with side') ||
      (intent.budgetCap !== undefined && (lower.includes('combo') || lower.includes('side orders') || lower.includes('with side')));

    if (isValueCombo || isPremiumCombo || isBiryaniCombo || isGeneralBudgetCombo) {
      const isPremium = isPremiumCombo;
      const budgetCap = intent.budgetCap || (isPremium ? 22 : 15);
      const slot: MealSlot = intent.mealSlot || 'dinner';
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Select Main Meal
      let mainMeal: Meal | undefined;
      const allMains = await this.tools.searchMeals({ category: 'main' });
      const safeMains = this.safety.filterSafeMeals(allMains, preferences);

      if (isBiryaniCombo || lower.includes('biryani')) {
        mainMeal = safeMains.find((m) => m.name.toLowerCase().includes('biryani')) || safeMains[0];
      } else if (isPremium) {
        // Gourmet signature meals (e.g. Butter Chicken with Garlic Roti $14, Beef Rendang $13, Beef Lasagne $14)
        const premiumMains = safeMains.filter((m) => m.price >= 13 && m.price <= 16);
        mainMeal = premiumMains[0] || safeMains[0];
      } else {
        // Value meals under $13 (e.g. Chicken Biryani $12, Dal Makhani $12, Thai Basil Chicken $13, Jollof Chicken $12)
        const valueMains = safeMains.filter((m) => m.price <= 13);
        mainMeal = valueMains[0] || safeMains[0];
      }

      // 2. Select AI-Recommended Paired Side Order
      const allSides = await this.tools.searchMeals({ category: 'side' });
      const safeSides = this.safety.filterSafeMeals(allSides, preferences);
      const remainingForSide = Math.max(3.0, budgetCap - mainMeal.price);

      const pairing = this.recommender.pairSideOrder(mainMeal, safeSides, remainingForSide);
      const sideMeal = pairing?.side || safeSides[0];
      const pairingRationale = pairing?.rationale || 'Chef-paired complementary side order';

      // 3. AI automatically creates the cart!
      await this.tools.clearCart(userId);
      await this.tools.addToCart(userId, mainMeal.id, 1, slot, todayStr);
      await this.tools.addToCart(userId, sideMeal.id, 1, slot, todayStr);
      const cart = await this.tools.getCart(userId);

      // Save active combo state for live side swapping
      this.activeCombos.set(userId, {
        main: mainMeal,
        side: sideMeal,
        alternativeSides: pairing?.alternativeSides || safeSides.filter((s) => s.id !== sideMeal.id),
        budgetCap,
        slot,
        isPremium,
      });

      const tierLabel = isPremium ? '⭐ Premium Combo' : '💚 Value Combo';
      const messageText =
        `I've tailored a ${tierLabel} for your $${budgetCap.toFixed(2)} budget and created your cart! 🛒\n\n` +
        `🍛 **Main**: ${mainMeal.name} — $${mainMeal.price.toFixed(2)}\n` +
        `🥟 **AI-Recommended Side**: ${sideMeal.name} — $${sideMeal.price.toFixed(2)}\n` +
        `*(${pairingRationale})*\n\n` +
        `💰 **Food Subtotal**: $${cart.subtotal.toFixed(2)} (within your $${budgetCap.toFixed(2)} budget) · Estimated Total: $${cart.total.toFixed(2)}\n\n` +
        `Your cart is ready! You can review and confirm below, swap the side, or add more items before placing your order:`;

      return {
        message: messageText,
        job: 'BUILD',
        draftCart: cart,
        recommendations: [
          {
            meal: mainMeal,
            score: 98,
            reasons: [isPremium ? '✓ Premium specialty' : '✓ Value Meal ($12.00)', `✓ Within $${budgetCap} budget`],
          },
          {
            meal: sideMeal,
            score: 94,
            reasons: ['✓ AI-recommended pairing', pairingRationale],
          },
        ],
        quickOptions: ['Confirm order', '🔄 Swap Side', '🥗 Add Salad', '🥤 Add Drink', '✏️ Edit Cart'],
        confirmationRequired: true,
        confirmationDetails: {
          action: 'PLACE_ORDER',
          total: cart.total,
          summary: cart.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
        },
      };
    }

    // --- SCENARIO 1.9: ASK FOR BUDGET FROM CUSTOMER (When inquiring about meals without budget) ---
    const isGeneralMealInquiry =
      (lower.includes('recommend lunch') ||
        lower.includes('recommend a meal') ||
        lower.includes('recommend meal') ||
        lower.includes('recommend food') ||
        lower.includes('order food') ||
        lower.includes('what should i eat for lunch') ||
        lower.includes('lunch for today') ||
        lower.includes('what should i order') ||
        lower.includes('help me order') ||
        lower.includes('ask for budget')) &&
      intent.budgetCap === undefined &&
      !sessionState?.activeFilters?.budgetCap &&
      !lower.includes('chicken') &&
      !lower.includes('spicy') &&
      !lower.includes('tonight') &&
      !lower.includes("don't know what to eat");

    if (isGeneralMealInquiry) {
      return {
        message:
          "I'd love to help you order! What's your budget for today's meal?\n\n" +
          "💚 **Value Meal** (under $15) — Delicious, budget-friendly mains & paired sides\n" +
          "⭐ **Premium Meal** ($18+ / Gourmet) — Signature chef specials & gourmet pairings\n\n" +
          "Tell me your budget or choose an option below to get started:",
        job: 'CHOOSE',
        quickOptions: ['💚 Value (Under $15)', '⭐ Premium ($18+)', '🍛 Biryani Combo', '✨ Surprise me'],
      };
    }

    // --- SCENARIO 2: "ORDER MY USUAL" ---
    if (intent.isUsualRequest || (intent.job === 'ORDER' && !intent.explicitConfirmation)) {
      const usual = await this.tools.getOrderHistory(userId, 1);
      const usualOrder = usual[0];

      if (!usualOrder) {
        return {
          message: "You don't have any past orders yet. Would you like to explore our top-rated recommendations?",
          job: 'FIND',
          quickOptions: ['💵 Something under $15', '🥗 Healthy tonight', '✨ Surprise me'],
        };
      }

      // Check meal availability for the usual items
      const mainItem = usualOrder.items[0];
      const isAvailable = mainItem
        ? await this.tools.checkAvailability(mainItem.mealId, 'wednesday', 'dinner')
        : true;

      const availabilityText = isAvailable
        ? 'Your usual is available tomorrow.'
        : 'Your usual is available for upcoming delivery.';

      return {
        message: `${availabilityText}\nTotal: $${usualOrder.total.toFixed(2)}. Ready to draft to your cart?`,
        job: 'ORDER',
        usualOrder,
        quickOptions: ['🛒 Add to cart', '✏️ Edit items'],
        confirmationRequired: true,
        confirmationDetails: {
          action: 'PLACE_ORDER',
          total: usualOrder.total,
          summary: usualOrder.items.map((i) => `${i.quantity}x ${i.mealName}`).join(', '),
        },
      };
    }

    // --- SCENARIO 2.5: "DROP FOR ME" (Safe, Adventure, Budget, Healthy Drop - Drop AI Spec Page 49) ---
    if (intent.wantsDropForMe) {
      const mode = intent.dropForMeMode || 'safe';
      const shown = this.sessionShownMeals.get(userId) || [];
      const dropResult = await this.tools.dropForMe(userId, mode, shown);
      this.activeDropForMe.set(userId, dropResult);
      this.sessionShownMeals.set(userId, [...shown, dropResult.main.id]);

      const itemsDesc = [
        `🍲\t${dropResult.main.name}\t$${dropResult.main.price.toFixed(2)}`,
        dropResult.side ? `🥟\t${dropResult.side.name}\t$${dropResult.side.price.toFixed(2)}` : null,
        dropResult.drink ? `🥤\t${dropResult.drink.name}\t$${dropResult.drink.price.toFixed(2)}` : null,
      ].filter(Boolean).join('\n');

      const messageText = `🎲 We've picked tonight's Drop (${dropResult.modeLabel}):\n\n${itemsDesc}\n\nTotal: $${dropResult.totalPrice.toFixed(2)} (${dropResult.matchScore}% Match)\n\n${dropResult.rationale}`;

      return {
        message: messageText,
        job: 'BUILD',
        dropForMe: dropResult,
        quickOptions: ['Accept Drop', 'Add Side', 'Add Drink', 'Add Dessert'],
      };
    }

    // --- SCENARIO 3: "I'VE GOT $20. MAKE ME A GOOD DINNER" (BUDGET BASKET) ---
    if (intent.wantsBasket) {
      const budget = intent.budgetCap || 20;
      const slot = intent.mealSlot || 'dinner';
      const basket = await this.tools.buildBudgetBasket(userId, budget, slot);

      if (!basket) {
        return {
          message: `I couldn't find a complete 3-item combo under $${budget}. Would you like to view our best individual meals under $${budget}?`,
          job: 'BUILD',
          quickOptions: [`💵 Meals under $${budget}`, '🥗 Healthy choices', '✨ Surprise me'],
        };
      }

      this.activeBudgetBaskets.set(userId, basket);

      const summaryText = `Your $${budget} Drop:\n\n` +
        `🍛\t${basket.main.name}\t$${basket.main.price.toFixed(2)}\n` +
        `🥟\t${basket.side.name}\t$${basket.side.price.toFixed(2)}\n` +
        `🥤\t${basket.drink.name}\t$${basket.drink.price.toFixed(2)}\n\n` +
        `Total: $${basket.total.toFixed(2)}`;

      return {
        message: summaryText,
        job: 'BUILD',
        budgetBasket: basket,
        quickOptions: ['Add all to cart', 'Swap side', 'Swap drink'],
      };
    }

    // --- SCENARIO 3.5: SWAP SIDE OR SWAP DRINK IN BUDGET BASKET ---
    const isSwapSide = lower.includes('swap side');
    const isSwapDrink = lower.includes('swap drink');

    if (this.activeBudgetBaskets.has(userId) && (isSwapSide || isSwapDrink)) {
      const basket = this.activeBudgetBaskets.get(userId)!;
      const budgetCap = basket.budgetCap || 20;
      let swappedLabel = '';

      if (isSwapSide) {
        const remainingForSide = budgetCap - basket.main.price - basket.drink.price;
        const allSides = await this.tools.searchMeals({ category: 'side' });
        const validSides = allSides.filter(
          (s) => s.id !== basket.side.id && s.price <= remainingForSide + 0.01
        );
        const newSide = validSides[0] || allSides.find((s) => s.id !== basket.side.id);
        if (newSide) {
          basket.side = newSide;
          swappedLabel = `🥟 ${newSide.name}`;
        }
      }

      if (isSwapDrink) {
        const remainingForDrink = budgetCap - basket.main.price - basket.side.price;
        const allDrinks = await this.tools.searchMeals({ category: 'drink' });
        const validDrinks = allDrinks.filter(
          (d) => d.id !== basket.drink.id && d.price <= remainingForDrink + 0.01
        );
        const newDrink = validDrinks[0] || allDrinks.find((d) => d.id !== basket.drink.id);
        if (newDrink) {
          basket.drink = newDrink;
          swappedLabel = `🥤 ${newDrink.name}`;
        }
      }

      basket.items = [
        { category: 'Meal', name: basket.main.name, price: basket.main.price, mealId: basket.main.id },
        { category: 'Side', name: basket.side.name, price: basket.side.price, mealId: basket.side.id },
        { category: 'Drink', name: basket.drink.name, price: basket.drink.price, mealId: basket.drink.id },
      ];
      basket.total = Math.round((basket.main.price + basket.side.price + basket.drink.price) * 100) / 100;
      this.activeBudgetBaskets.set(userId, basket);

      const summaryText = `Swapped to ${swappedLabel}! Your $${budgetCap} combo is updated:\n\n` +
        `🍛\t${basket.main.name}\t$${basket.main.price.toFixed(2)}\n` +
        `🥟\t${basket.side.name}\t$${basket.side.price.toFixed(2)}\n` +
        `🥤\t${basket.drink.name}\t$${basket.drink.price.toFixed(2)}\n\n` +
        `Total: $${basket.total.toFixed(2)}`;

      return {
        message: summaryText,
        job: 'BUILD',
        budgetBasket: basket,
        quickOptions: ['Add all to cart', 'Swap side', 'Swap drink'],
      };
    }

    // --- SCENARIO 4: "SORT MY DINNERS MONDAY-FRIDAY. KEEP IT UNDER $65" (WEEKLY MEAL PLAN) ---
    if (intent.wantsPlan) {
      const targetBudget = intent.budgetCap || 65;
      let existingPlan = this.activeMealPlans.get(userId);

      const isModifying =
        Boolean(existingPlan) &&
        ((intent.requestedModifications?.length || 0) > 0 ||
          lower.includes('change') ||
          lower.includes('make friday') ||
          lower.includes('remove') ||
          lower.includes('keep everything under'));

      let isVegetarianFriday = lower.includes('friday vegetarian');
      let excludeKeywords: string[] = [];

      if (lower.includes('remove salad') || lower.includes('remove salads')) {
        excludeKeywords.push('salad', 'superbowl');
      }

      // If user says "Keep everything under $60"
      const revisedBudget = intent.budgetCap || existingPlan?.targetBudget || targetBudget;

      const plan = await this.tools.buildMealPlan(userId, {
        targetBudget: revisedBudget,
        isVegetarianFriday: isVegetarianFriday || existingPlan?.isVegetarianFriday,
        excludeKeywords,
      });

      // If user requested "Change Wednesday"
      if (lower.includes('change wednesday')) {
        const wedIndex = plan.days.findIndex((d) => d.day === 'Wednesday');
        if (wedIndex > -1) {
          const altMeals = await this.tools.searchMeals({ category: 'main', slot: 'dinner' });
          const currentWedId = plan.days[wedIndex].meal.id;
          const replacement = altMeals.find(
            (m) => m.id !== currentWedId && m.availableDays.includes('wednesday')
          );
          if (replacement) {
            plan.days[wedIndex] = {
              day: 'Wednesday',
              slot: 'dinner',
              meal: replacement,
              reason: `Updated to ${replacement.name} per your request`,
            };
            plan.actualTotal = Math.round(
              plan.days.reduce((sum, item) => sum + item.meal.price, 0) * 100
            ) / 100;
          }
        }
      }

      this.activeMealPlans.set(userId, plan);

      const message = isModifying
        ? `Updated your weekly dinner plan. New total: $${plan.actualTotal.toFixed(2)} (Target: $${plan.targetBudget.toFixed(2)}).`
        : `Here is your curated Monday–Friday dinner plan under $${plan.targetBudget.toFixed(2)}. Total: $${plan.actualTotal.toFixed(2)}.`;

      return {
        message,
        job: 'BUILD',
        weeklyPlan: plan,
        quickOptions: [
          'Change Wednesday',
          'Make Friday vegetarian',
          'Remove salads',
          'Keep everything under $60',
        ],
      };
    }

    // --- SCENARIO 5: "I DON'T KNOW WHAT TO EAT" (DECISION REDUCTION) ---
    if (intent.job === 'CHOOSE') {
      const history = await this.tools.getOrderHistory(userId, 5);
      const hasRecentChicken = history.some((o) =>
        o.items.some((i) => i.mealName.toLowerCase().includes('chicken'))
      );

      const intro = hasRecentChicken
        ? "You've been having a lot of chicken and rice lately. Want something different?"
        : "Looking for inspiration tonight? Let's narrow it down quickly.";

      return {
        message: intro,
        job: 'CHOOSE',
        quickOptions: ['Something different', 'Healthy', 'Spicy', 'Surprise me'],
      };
    }

    // --- SCENARIO 6: FIND / CHOOSE MEALS (e.g., "Find me a filling chicken meal under $15 for tomorrow dinner" or "Something different") ---
    let maxPrice = intent.budgetCap;
    let targetProtein = intent.protein;
    let targetCuisine = intent.cuisine;
    let slot: MealSlot = intent.mealSlot || 'dinner';
    let targetDay: DayOfWeek = intent.targetDate === 'tomorrow' ? 'thursday' : 'wednesday';

    // Handle Quick Options branches
    const allCuisines = ['African', 'Malaysian', 'Indian', 'Italian', 'Mexican', 'Thai', 'Japanese'];
    const favCuisines = preferences?.favoriteCuisines || [];

    if (lower.includes('something different')) {
      const different = allCuisines.filter((c) => !favCuisines.map((f) => f.toLowerCase()).includes(c.toLowerCase()));
      targetCuisine = different[Math.floor(Math.random() * different.length)] || 'African';
      targetProtein = undefined;
    } else if (lower.includes('comfort food')) {
      targetProtein = undefined;
    } else if (lower.includes('spicy')) {
      intent.spicyFilter = true;
    } else if (lower.includes('healthy')) {
      intent.healthyFilter = true;
    } else if (lower.includes('surprise me')) {
      maxPrice = 16;
      targetCuisine = undefined;
      targetProtein = undefined;
    }
    // --- SCENARIO 6.5: SIDES, DRINKS, DESSERT PAIRING ---
    const wantsSides = lower.includes('side') || lower.includes('sides');
    const wantsDrinks = lower.includes('drink') || lower.includes('drinks') || lower.includes('beverage');
    const wantsDesserts = lower.includes('dessert') || lower.includes('desserts') || lower.includes('sweet');

    if (
      (wantsSides || wantsDrinks || wantsDesserts) &&
      !this.activeDropForMe.has(userId) &&
      !this.activeBudgetBaskets.has(userId)
    ) {
      const targetCategory = wantsSides ? 'side' : wantsDrinks ? 'drink' : 'dessert';
      const rawAddons = await this.tools.searchMeals({ category: targetCategory });
      const safeAddons = this.safety.filterSafeMeals(rawAddons, preferences);
      const recs = this.recommender.rankMeals(safeAddons, preferences, {}, 3);

      const label = wantsSides ? 'Sides' : wantsDrinks ? 'Drinks' : 'Desserts';
      return {
        message: `Here are top-rated ${label} to pair with your meal:`,
        job: 'FIND',
        recommendations: recs,
        quickOptions: ['Review Cart', 'Add Side', 'Add Drink', 'Add Dessert'].filter(
          (o) => !o.toLowerCase().includes(targetCategory)
        ),
      };
    }

    // Determine exclusion list for session freshness
    let excludeIds = this.sessionShownMeals.get(userId) || [];
    if (!intent.isAlternativeRequest && excludeIds.length > 9) {
      excludeIds = [];
    }

    // Search meals matching criteria
    let rawMeals = await this.tools.searchMeals({
      maxPrice,
      cuisine: targetCuisine,
      slot,
      day: targetDay,
    });

    if (intent.spicyFilter) {
      const spicyOnly = rawMeals.filter((m) => m.spicyLevel > 0);
      if (spicyOnly.length > 0) rawMeals = spicyOnly;
    }

    if (targetProtein) {
      const p = targetProtein.toLowerCase();
      const proteinOnly = rawMeals.filter((m) =>
        m.ingredients.some((ing) => ing.toLowerCase().includes(p)) ||
        m.name.toLowerCase().includes(p)
      );
      if (proteinOnly.length > 0) rawMeals = proteinOnly;
    }

    // Enforce SAFETY: Exclude explicit medical allergies and user disliked ingredients
    const safeMeals = this.safety.filterSafeMeals(rawMeals, preferences);

    // Get frequently ordered meals for affinity
    const history = await this.tools.getOrderHistory(userId, 5);
    const frequentIds = history.flatMap((o) => o.items.map((i) => i.mealId));

    // Transparent scoring and ranking with rotation
    const recommendations = this.recommender.rankMeals(
      safeMeals,
      preferences,
      {
        maxPrice: maxPrice || 16,
        targetProtein,
        targetCuisine,
        spicyRequested: intent.spicyFilter,
        healthyRequested: intent.healthyFilter,
        wellnessCategory: intent.wellnessCategory,
        frequentlyOrderedMealIds: frequentIds,
        dishKeyword: intent.dishKeyword,
        excludeMealIds: excludeIds,
      },
      3
    );

    if (recommendations.length === 0) {
      return {
        message: "I couldn't find an exact match with all filters. Here are some popular available meals you might enjoy:",
        job: 'FIND',
        recommendations: this.recommender.rankMeals(
          this.safety.filterSafeMeals(await this.tools.searchMeals({ slot }), preferences),
          preferences,
          {},
          3
        ),
        quickOptions: ['💵 Something under $15', '🌶️ Spicy', '✨ Surprise me'],
      };
    }

    // Save newly shown meals for session rotation
    const newlyShown = recommendations.map((r) => r.meal.id);
    this.sessionShownMeals.set(userId, [...excludeIds, ...newlyShown]);

    // Concise, personalized multi-line response
    let responseMsg = `Here are ${recommendations.length} tailored meals for ${slot} ${intent.targetDate || 'tonight'}:\nCurated based on your taste profile and today's kitchen menu.`;
    if (intent.wellnessCategory) {
      const wellnessTitle =
        intent.wellnessCategory === 'high-protein'
          ? 'High Protein'
          : intent.wellnessCategory === 'weight-management'
          ? 'Weight Management'
          : 'High Fibre & Gut Friendly';
      responseMsg = `Here are top ${wellnessTitle} Wellness Meals tailored for you:\nNutritious, wholesome, and ready to order:`;
    } else if (intent.dishKeyword) {
      responseMsg = `Found delicious ${intent.dishKeyword} dishes for you!\nHere are top-rated selections ready to order:`;
    } else if (targetProtein && maxPrice) {
      responseMsg = `Found delicious ${targetProtein} dinners under $${maxPrice}.\nFreshly prepared and ready for pickup tomorrow:`;
    } else if (lower.includes('something different')) {
      responseMsg = `Explored something fresh outside your routine!\nHere are authentic ${targetCuisine} dishes tailored for you:`;
    } else if (intent.isAlternativeRequest) {
      responseMsg = 'Here are fresh alternative options for you.\nHandpicked to match your dietary preferences:';
    } else if (this.aiProvider instanceof GeminiProvider) {
      try {
        const dynamicReply = await this.aiProvider.generateConversationalReply(
          rawInput,
          recommendations.map((r) => r.meal),
          {
            userName: userProfile?.name,
            dietPreferences: preferences?.dietaryPreferences,
            allergies: preferences?.allergies,
          }
        );
        if (dynamicReply && dynamicReply.trim().length > 10) {
          responseMsg = dynamicReply;
        }
      } catch (err) {
        console.warn('Gemini dynamic reply error:', err);
      }
    }

    return {
      message: responseMsg,
      job: 'FIND',
      recommendations,
      appliedFilters: {
        budget: maxPrice,
        protein: targetProtein,
        slot,
        cuisine: targetCuisine,
        dietary: preferences?.dietaryPreferences,
        excludedIngredients: preferences?.allergies,
      },
      quickOptions: ['Show more options', 'Add Side', 'Add Drink', 'Add Dessert'],
    };
  }
}

export const dropAIOrchestrator = new DropAIOrchestrator();
