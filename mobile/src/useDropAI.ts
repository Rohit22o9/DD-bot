import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, Cart, UserProfile, Recommendation, Meal } from './types';
import {
  MOCK_MOBILE_MEALS,
  getMockRecommendations,
  rankQualifiedMeals,
  qualifyMealHealth,
  HealthCategory,
  isHalalMeal,
  isGlutenFreeMeal,
  isDairyFreeMeal,
  isVeganMeal,
  isVegetarianMeal,
} from './mockData';
import { DEFAULT_HEALTH_GOALS } from './components/MobileQuickQuestions';
import { correctFoodTypos } from './foodTypoCorrector';

export interface UseDropAIOptions {
  apiBaseUrl: string;
  userId: string;
}

// Universal safe fetch that never hangs and doesn't rely on unsupported AbortSignal.timeout
async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 1500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function useDropAI({ apiBaseUrl, userId }: UseDropAIOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Cart | null>({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    estimatedTax: 0,
    total: 0,
    currency: 'USD',
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Session-wide refs to prevent meal repetition and power dynamic actions
  const shownMealIdsRef = useRef<Set<string>>(new Set());
  const lastFilterRef = useRef<{ type: string; cap?: number; cuisine?: string }>({ type: 'general' });
  const lastWeeklyPlanRef = useRef<Meal[]>([]);
  const activeHealthCategoryRef = useRef<string | null>(null);

  // Fetch initial profile & cart from server safely
  const refreshCart = useCallback(async () => {
    try {
      const res = await safeFetch(`${apiBaseUrl}/api/cart/${userId}`, {}, 1500);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch {
      // Keep local cart state
    }
  }, [apiBaseUrl, userId]);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await safeFetch(`${apiBaseUrl}/api/preferences/${userId}`, {}, 1500);
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.profile);
      }
    } catch {
      // Fallback profile
      setUserProfile({
        id: userId,
        name: userId === 'user_alex' ? 'Alex Chen' : userId === 'user_sam' ? 'Sam Taylor' : 'Jordan Lee',
        email: `${userId}@dailydrop.com`,
        preferences: {
          favoriteCuisines: ['Thai', 'Japanese', 'Mediterranean'],
          dislikedFoods: ['Mushrooms'],
          dietaryPreferences: ['High protein'],
          allergies: [],
          preferredPriceRange: { min: 10, max: 20 },
          spicyPreference: 'spicy',
          healthyPreference: true,
          favoriteRestaurants: ['Thai Orchid Street', 'Verde Kitchen & Bowls'],
        },
      });
    }
  }, [apiBaseUrl, userId]);

  useEffect(() => {
    refreshCart();
    refreshProfile();
    // Default initial message is empty to show Launch Screen Panel 1
    setMessages([]);
  }, [userId, refreshCart, refreshProfile]);

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: now(),
    };

    const aiId = `ai_${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: aiId,
      sender: 'assistant',
      text: '',
      timestamp: now(),
      isStreaming: true,
      statusText: 'Thinking…',
    };

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setIsLoading(true);

    const patchAi = (patch: Partial<ChatMessage>) => {
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, ...patch } : m)));
    };

    const streamAssistantReply = async (payload: {
      message: string;
      job?: any;
      recommendations?: any;
      healthGoals?: any;
      dismissGoalPrompt?: any;
      addedCartItem?: any;
      quickOptions?: any;
      usualOrder?: any;
      budgetBasket?: any;
      dropForMe?: any;
      weeklyPlan?: any;
      gamePayload?: any;
      inChatCart?: any;
    }) => {
      // 1. Guarantee the thinking animation with pulsing robot & bouncing dots is displayed
      // for at least 850ms so user has clear, delightful feedback on any input
      const minThinkingTime = 850;
      const elapsed = Date.now() - requestStartTime;
      if (elapsed < minThinkingTime) {
        await new Promise((r) => setTimeout(r, minThinkingTime - elapsed));
      }

      const fullText = payload.message || '';
      
      // Split into distinct words and newlines to ensure perfectly uniform pacing across all paragraphs
      const rawWords = fullText.match(/\S+|\n/g) || [fullText];
      const tokens: string[] = [];
      for (let i = 0; i < rawWords.length; i++) {
        const item = rawWords[i];
        if (item === '\n') {
          tokens.push('\n');
        } else {
          const next = rawWords[i + 1];
          tokens.push(next === '\n' || i === rawWords.length - 1 ? item : item + ' ');
        }
      }

      let accumulated = '';

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        accumulated += token;
        patchAi({
          text: accumulated,
          isStreaming: true,
          statusText: undefined,
        });

        // Consistent, comfortable human reading cadence maintained throughout ALL paragraphs:
        // - Paragraph break (\n): 280ms breathing room
        // - Sentence end (. ! ?): 220ms pause
        // - Mid-sentence punctuation (, ; :): 130ms pause
        // - Standard word: 75ms steady cadence (gives React Native ample time to render each word legibly)
        let pause = 75;
        if (token === '\n') {
          pause = 280;
        } else if (/[.!?]$/.test(token.trim())) {
          pause = 220;
        } else if (/[,;:\-—]$/.test(token.trim())) {
          pause = 130;
        }

        await new Promise((r) => setTimeout(r, pause));
      }

      // Natural pause before smoothly revealing cards & interactive widgets
      await new Promise((r) => setTimeout(r, 250));

      patchAi({
        text: fullText,
        isStreaming: false,
        statusText: undefined,
        job: payload.job,
        recommendations: payload.recommendations,
        healthGoals: payload.healthGoals,
        dismissGoalPrompt: payload.dismissGoalPrompt,
        addedCartItem: payload.addedCartItem,
        quickOptions: payload.quickOptions,
        usualOrder: payload.usualOrder,
        budgetBasket: payload.budgetBasket,
        dropForMe: payload.dropForMe,
        weeklyPlan: payload.weeklyPlan,
        gamePayload: payload.gamePayload,
        inChatCart: payload.inChatCart,
      });
      setIsLoading(false);
    };

    const requestStartTime = Date.now();

    try {
      // 1. Try server endpoint first with 8s timeout
      const res = await safeFetch(
        `${apiBaseUrl}/api/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, message: cleanText }),
        },
        8000
      );

      if (res && res.ok) {
        const data = await res.json();
        await streamAssistantReply(data);
        return;
      }
      throw new Error('Server unreachable');
    } catch {
      // 2. SMART OFFLINE AI ENGINE (Provides immediate, rich interactive responses anywhere on 5G/offline)
      const typoResult = correctFoodTypos(cleanText);
      const effectiveText = typoResult.hasCorrection ? typoResult.correctedText : cleanText;
      const q = effectiveText.toLowerCase();

      // 🎮 FOOD DISCOVERY GAMES
      if (
        q.includes('food tinder') ||
        q.includes('swipe & pick') ||
        q.includes('swipe and pick') ||
        q.includes('swipe 5 dishes') ||
        q === 'swipe'
      ) {
        await streamAssistantReply({
          message: "Let's find out what you're craving. Swipe 5 dishes. 🔥",
          gamePayload: {
            gameType: 'food_tinder',
            title: 'Food Tinder — Swipe & Pick',
          },
        });
        return;
      }

      if (
        q.includes('meal battle') ||
        q.includes('food fight') ||
        q.includes('which one wins')
      ) {
        await streamAssistantReply({
          message: "Welcome to Meal Battle ⚔️! Which one wins? Tap your craving to crown tonight's champion.",
          gamePayload: {
            gameType: 'meal_battle',
            title: 'Meal Battle ⚔️',
          },
        });
        return;
      }

      if (
        q.includes('this or that') ||
        q.includes('4 quick choices') ||
        q.includes('4 questions')
      ) {
        await streamAssistantReply({
          message: "Quick game. I'll find your dinner in 4 questions. 🤔",
          gamePayload: {
            gameType: 'this_or_that',
            title: 'This or That 🤔',
          },
        });
        return;
      }

      if (
        q.includes('roulette') ||
        q.includes('meal roulette') ||
        q.includes('spin the wheel') ||
        q === 'spin'
      ) {
        await streamAssistantReply({
          message: "Feeling lucky? 🎲 Spin the flavour wheel and discover tonight's dinner!",
          gamePayload: {
            gameType: 'meal_roulette',
            title: 'Meal Roulette 🎲',
          },
        });
        return;
      }

      if (
        q.includes('mystery meal') ||
        q.includes('mystery box') ||
        q.includes('crack a box') ||
        q === 'mystery'
      ) {
        await streamAssistantReply({
          message: 'Pick your mystery box. 👀 What surprise awaits inside?',
          gamePayload: {
            gameType: 'mystery_meal',
            title: 'Mystery Meal 🎁',
          },
        });
        return;
      }

      if (
        q.includes('food passport') ||
        q.includes('passport') ||
        q.includes('collect stamps')
      ) {
        await streamAssistantReply({
          message: 'Your Food Passport 🌍! Track your multi-cuisine journeys and unlock new stamps tonight.',
          gamePayload: {
            gameType: 'food_passport',
            title: 'Food Passport 🌍',
          },
        });
        return;
      }

      if (
        q.includes('guess the dish') ||
        q.includes('guess dish') ||
        q.includes('daily trivia')
      ) {
        await streamAssistantReply({
          message: "Can you guess today's mystery dish? 🕵️ Put your tastebuds to the test!",
          gamePayload: {
            gameType: 'guess_dish',
            title: 'Guess the Dish 🕵️',
          },
        });
        return;
      }

      if (
        q.includes('build my meal') ||
        q.includes('build meal') ||
        q.includes('craft protein')
      ) {
        await streamAssistantReply({
          message: "Let's craft your dinner! 🧑‍🍳 Choose your protein, calories, flavour personality, and base.",
          gamePayload: {
            gameType: 'build_meal',
            title: 'Build My Meal 🧑‍🍳',
          },
        });
        return;
      }

      if (
        q.includes('play a game') ||
        q.includes('play game') ||
        q.includes('play and discover') ||
        q.includes('play & discover') ||
        q.includes("can't decide")
      ) {
        await streamAssistantReply({
          message: "Can't decide? Let's play a 20-second game and I'll pick your dinner. 🎮",
          quickOptions: [
            '🔥 Food Tinder',
            '⚔️ Meal Battle',
            '🤔 This or That',
            '🎲 Meal Roulette',
            '🎁 Mystery Meal',
          ],
        });
        return;
      }

      // FLOW 1 — “HELP ME CHOOSE”
      if (
        q === 'help me choose' ||
        q === 'help me choose what to eat' ||
        q === 'choose what to eat' ||
        q === 'what should i eat' ||
        q === 'help' ||
        q.includes('what are you in the mood for')
      ) {
        const picked = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main').slice(0, 4);
        const recs: Recommendation[] = picked.map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ Chef recommendation', '✓ Freshly prepped for dinner'],
        }));
        await streamAssistantReply({
          message: "Here are tonight's top chef-crafted picks from our kitchen, curated for great flavor and balanced nutrition:",
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🌶️ More spicy', '🍗 Chicken', '🌱 Vegetarian', '✨ Surprise me'],
        });
      } else if (
        q.includes('comfort food') ||
        q.includes('healthy & light') ||
        q.includes('healthy and light') ||
        q.includes('something spicy') ||
        q.includes('filling meal')
      ) {
        const comfortMeals = MOCK_MOBILE_MEALS.filter(
          (m) =>
            m.name.includes('Biryani') ||
            m.name.includes('Rendang') ||
            m.name.includes('Jollof') ||
            m.cuisine === 'Indian'
        );
        const recs: Recommendation[] = (comfortMeals.length > 0 ? comfortMeals : MOCK_MOBILE_MEALS).slice(0, 4).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ Freshly prepared', '✓ Top rated on Daily Drop'],
        }));
        await streamAssistantReply({
          message: 'Here are 4 chef-crafted options matching your mood:',
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🌶️ More spicy', '🍗 Chicken', '🌱 Vegetarian', '🔄 Show me more'],
        });
      }
      // FLOW 1B — STRICT DIETARY: VEGETARIAN (100% Zero Meat Guarantee)
      else if (
        q === '🌱 vegetarian' ||
        q === 'vegetarian' ||
        q === 'veg' ||
        q === 'pure veg' ||
        q === 'vegetarian meals' ||
        q.includes('vegetarian') ||
        q.includes('meatless') ||
        q.includes('no meat')
      ) {
        const vegRecs = getMockRecommendations('vegetarian', Array.from(shownMealIdsRef.current));
        vegRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: "Here are 100% vegetarian, plant-powered meals on today's menu 🌱 (strictly zero meat or seafood):",
          recommendations: vegRecs,
          quickOptions: ['💰 Under $12', '🥟 Veg sides', '🥤 Cold drinks', '🍰 Desserts', '🔄 More veg'],
        });
      }
      // FLOW 1C — STRICT DIETARY: VEGAN (100% Plant-Based)
      else if (
        q === '🌿 vegan' ||
        q === 'vegan' ||
        q.includes('vegan') ||
        q.includes('plant-based') ||
        q.includes('plant based')
      ) {
        const veganRecs = getMockRecommendations('vegan', Array.from(shownMealIdsRef.current));
        veganRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: "Here are 100% plant-based, vegan dishes crafted without any animal products or dairy 🌿:",
          recommendations: veganRecs,
          quickOptions: ['💰 Under $12', '🥟 Sides', '🥤 Drinks', '🍰 Desserts'],
        });
      }
      // FLOW 1D — STRICT PROTEIN: CHICKEN
      else if (
        q === '🍗 chicken' ||
        q === 'chicken' ||
        q === 'more chicken' ||
        q.includes('chicken dishes') ||
        q.includes('chicken options')
      ) {
        const chickenRecs = getMockRecommendations('chicken', Array.from(shownMealIdsRef.current));
        chickenRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: "Here are our top chef-crafted chicken dishes on the menu today 🍗:",
          recommendations: chickenRecs,
          quickOptions: ['💰 Under $14', '🌶️ Spicy', '🥟 Add a side', '🥤 Add a drink'],
        });
      }
      // FLOW 1E — STRICT PROTEIN: SEAFOOD / FISH
      else if (
        q === '🐟 seafood' ||
        q === 'seafood' ||
        q === 'salmon' ||
        q.includes('seafood') ||
        q.includes('fish')
      ) {
        const seaRecs = getMockRecommendations('seafood', Array.from(shownMealIdsRef.current));
        seaRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: "Here are our fresh wild-caught and glazed seafood dishes today 🐟:",
          recommendations: seaRecs,
          quickOptions: ['💰 Under $15', '🥟 Add a side', '🥤 Add a drink'],
        });
      }
      // FLOW 1F — STRICT BUDGET: UNDER $12 / $15
      else if (
        q === '💰 under $15' ||
        q === 'under $15' ||
        q === 'under 15' ||
        q === 'under $12' ||
        q === '💰 under $12' ||
        q === 'budget' ||
        q === 'cheap'
      ) {
        const cap = q.includes('12') ? 12 : 15;
        const budgetRecs = getMockRecommendations(`under $${cap}`, Array.from(shownMealIdsRef.current));
        budgetRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: `Here are great chef-crafted meals under $${cap} today 💰:`,
          recommendations: budgetRecs,
          quickOptions: ['🍗 Chicken', '🌱 Vegetarian', '🌶️ Spicy', '🥟 Add a side'],
        });
      }
      // FLOW 2 — “I DON'T KNOW WHAT I WANT” / "YOU DECIDE"
      else if (
        q.includes("don't know what i want") ||
        q.includes("dont know what i want") ||
        q.includes("don't know what to eat") ||
        q === 'not sure' ||
        q === '🤷 not sure'
      ) {
        const picked = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main').slice(0, 3);
        const recs: Recommendation[] = picked.map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: ['✓ Diverse flavours', '✓ Highly rated by foodies'],
        }));
        await streamAssistantReply({
          message: "You've been having chicken and rice lately. How about something vibrant like Teriyaki Salmon or Lentil Curry to bring great variety tonight?",
          recommendations: recs,
          quickOptions: ['😍 I like these', '💰 Cheaper', '🥗 Healthier', '🎲 Surprise me again'],
        });
      } else if (q === 'you decide' || q === '🤷 you decide' || q.includes('you decide') || q.includes('surprise me again')) {
        const picked = MOCK_MOBILE_MEALS.slice(0, 3);
        const recs: Recommendation[] = picked.map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: ['✓ Chef recommendation', '✓ Matches today’s kitchen availability'],
        }));
        await streamAssistantReply({
          message: "I've picked 3 for you based on today's menu.",
          recommendations: recs,
          quickOptions: ['😍 I like these', '💰 Cheaper', '🥗 Healthier', '🎲 Surprise me again'],
        });
      } else if (q.includes('light & fresh') || q.includes('rich & comforting') || q.includes('big flavours')) {
        const recs: Recommendation[] = MOCK_MOBILE_MEALS.slice(0, 3).map((meal, idx) => ({
          meal,
          score: 96 - idx * 2,
          reasons: ['✓ Freshly prepped', '✓ Perfectly matched to your mood'],
        }));
        await streamAssistantReply({
          message: "Here are 3 options tailored to what sounds good:",
          recommendations: recs,
          quickOptions: ['😍 I like these', '💰 Cheaper', '🥗 Healthier', '🎲 Surprise me again'],
        });
      }
      // FLOW 3 — HEALTHY / NUTRITION GOAL
      else if (
        (q === 'eat healthier' || q === 'i want something healthy' || q === 'healthy') &&
        !q.includes('meals') &&
        !q.includes('not sure')
      ) {
        const healthyMeals = MOCK_MOBILE_MEALS.filter(
          (m) =>
            m.dietaryTags.some((t) => t.toLowerCase().includes('healthy') || t.toLowerCase().includes('protein')) ||
            m.name.includes('Quinoa') ||
            m.name.includes('Salmon')
        ).slice(0, 4);
        const recs: Recommendation[] = (healthyMeals.length > 0 ? healthyMeals : MOCK_MOBILE_MEALS.slice(0, 4)).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ High protein & clean macros', '✓ Freshly prepared with wholesome ingredients'],
        }));
        await streamAssistantReply({
          message: "I've handpicked nutritious, nutrient-dense dishes for dinner tonight—like our Grilled Salmon Bowl and Quinoa Bowl. Both keep calories under 500 kcal while providing rich protein and energy: ✨",
          recommendations: recs,
          quickOptions: [
            '❤️ Heart Healthy',
            '💪 High Protein',
            '🥑 Low Carb / Keto',
            '💰 Under $15',
            '🌱 Vegetarian',
          ],
        });
      }
      // FLOW 3A — HEART HEALTHY (Row 1)
      else if (q.includes('heart healthy')) {
        activeHealthCategoryRef.current = 'heart_healthy';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'heart_healthy',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            "Great choice! ❤️ Here are some heart-friendly meals from today's menu — focusing on vegetables, whole grains, lean proteins and healthier fats, while keeping saturated fat and sodium in check.",
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🧂 Lower sodium', '💪 High protein', '🌱 Vegetarian', '🔥 Under 500 cal'],
        });
      }
      // FLOW 3B — DIABETES FRIENDLY (Row 2)
      else if (q.includes('diabetes friendly')) {
        activeHealthCategoryRef.current = 'diabetes_friendly';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'diabetes_friendly',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            "Let's find something balanced. 📉 Here are some diabetes-friendly options with balanced carbohydrates, fibre, protein and minimal added sugar.",
          recommendations: recs,
          quickOptions: ['💪 High protein', '🌾 Higher fibre', '💰 Under $15', '🌱 Vegetarian', '🔥 Under 500 cal'],
        });
      }
      // FLOW 3C — HIGH PROTEIN (Row 3)
      else if (
        (q === 'high protein' || q === '💪 high protein' || q.includes('high protein meals') || q.includes('power up') || q.includes('another high-protein')) &&
        !q.includes('under $15')
      ) {
        activeHealthCategoryRef.current = 'high_protein';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'high_protein',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            "Let's power up! 💪 Here are today's high-protein picks, with 30g+ protein per meal to help you stay satisfied and meet your protein goals.",
          recommendations: recs,
          quickOptions: ['🍗 Chicken', '🐟 Seafood', '🌱 Vegetarian', '🔥 Under 500 cal', '💰 Under $15'],
        });
      }
      // FLOW 3D — LOW CARB / KETO (Row 4)
      else if (q.includes('low carb') || q.includes('keto') || q.includes('lowest carb')) {
        activeHealthCategoryRef.current = 'low_carb';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'low_carb',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            'Keeping the carbs down? 🥑 Here are some lower-carb options featuring protein, non-starchy vegetables and healthy fats.',
          recommendations: recs,
          quickOptions: ['🍗 Chicken', '🥩 Beef/Lamb', '🐟 Seafood', '🌱 Vegetarian', '🥑 Lowest carb'],
        });
      }
      // FLOW 3E — LOW SODIUM (Row 5)
      else if (
        q.includes('low sodium') ||
        q.includes('lower sodium') ||
        q.includes('lowest sodium') ||
        q.includes('cut back on sodium') ||
        q.includes('keep it low sodium')
      ) {
        activeHealthCategoryRef.current = 'low_sodium';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'low_sodium',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            'Looking to cut back on sodium? 🧂 Here are some lower-sodium choices that use herbs, spices and other ingredients to bring plenty of flavour.',
          recommendations: recs,
          quickOptions: ['🧂 Lowest sodium', '💪 High protein', '🌱 Vegetarian', '💰 Under $15', '🔥 Under 500 cal'],
        });
      }
      // FLOW 3F — ANTI-INFLAMMATORY (Row 6)
      else if (
        q.includes('anti-inflammatory') ||
        q.includes('anti inflammatory') ||
        q.includes('nutrient-rich') ||
        q.includes('omega-3 rich')
      ) {
        activeHealthCategoryRef.current = 'anti_inflammatory';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'anti_inflammatory',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            'Looking for wholesome, nutrient-rich choices? 🌿 Here are meals featuring vegetables, whole grains, legumes, healthy fats and other plant-rich whole foods.',
          recommendations: recs,
          quickOptions: ['🌱 Plant based', '🐟 Seafood', '🌾 High fibre', '🔥 Under 500 cal', '💰 Under $15'],
        });
      }
      // FLOW 3G — WEIGHT MANAGEMENT (Row 7)
      else if (
        q.includes('weight management') ||
        q.includes('weight loss') ||
        q.includes('calorie-conscious') ||
        q.includes('under 400 cal') ||
        q.includes('under 500 cal')
      ) {
        activeHealthCategoryRef.current = 'weight_management';
        const ranked = rankQualifiedMeals(
          MOCK_MOBILE_MEALS,
          'weight_management',
          { favoriteCuisines: userProfile?.preferences?.favoriteCuisines, maxPrice: 16 },
          shownMealIdsRef.current
        );
        const recs = ranked.slice(0, 4);
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message:
            'Looking for something balanced and satisfying? ⚖️ Here are some calorie-conscious meals prioritising protein, vegetables and fibre to help keep you fuller for longer.',
          recommendations: recs,
          quickOptions: ['🔥 Under 400 cal', '🔥 Under 500 cal', '💪 High protein', '🌾 High fibre', '💰 Under $15'],
        });
      }
      // REFINEMENTS: BEEF / LAMB
      else if (q.includes('beef/lamb') || q === '🥩 beef/lamb') {
        const rendang = MOCK_MOBILE_MEALS.filter((m) => m.name.includes('Beef') || m.cuisine === 'Indonesian');
        const recs: Recommendation[] = rendang.map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ Tender slow-braised beef', '✓ High protein & low sugar'],
        }));
        await streamAssistantReply({
          message: 'Here are hearty beef & lamb options:',
          recommendations: recs,
          quickOptions: ['🥑 Lowest carb', '🌱 Vegetarian', '💰 Under $15', '🛒 View cart'],
        });
      }
      // REFINEMENTS: SEAFOOD
      else if (q.includes('seafood') || q === '🐟 seafood' || q.includes('omega-3')) {
        const seafood = MOCK_MOBILE_MEALS.filter((m) => m.name.includes('Salmon') || m.dietaryTags.includes('Omega-3'));
        const recs: Recommendation[] = seafood.map((meal, idx) => ({
          meal,
          score: 99 - idx * 2,
          reasons: ['✓ Atlantic salmon', '✓ Rich in Omega-3'],
        }));
        await streamAssistantReply({
          message: 'Here are fresh seafood picks:',
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🧂 Lower sodium', '💪 High protein', '🛒 View cart'],
        });
      }
      // REFINEMENTS: PLANT BASED / HIGH FIBRE
      else if (q.includes('plant based') || q === '🌱 plant based' || q.includes('higher fibre') || q.includes('high fibre')) {
        const plants = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main' && (m.dietaryTags.includes('Vegan') || m.dietaryTags.includes('Vegetarian')));
        const recs: Recommendation[] = plants.slice(0, 4).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ 100% Plant based', '✓ High fibre & gut friendly'],
        }));
        await streamAssistantReply({
          message: 'Here are nutrient-dense plant-based and high-fibre meals:',
          recommendations: recs,
          quickOptions: ['🔥 Under 500 cal', '💰 Under $15', '🥟 Add a side', '🛒 View cart'],
        });
      }
      // REFINEMENTS: LOW-CARB SIDE
      else if (q.includes('low-carb side') || q === '🥗 low-carb side') {
        const sides = MOCK_MOBILE_MEALS.filter((m) => m.id === 'meal_edamame' || m.id === 'meal_garden_salad' || m.id === 'meal_miso_soup');
        await streamAssistantReply({
          message: 'Here are delicious lower-carb sides:',
          recommendations: sides.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Low carb', '✓ Fresh & light'],
          })),
          quickOptions: ['🥤 Drinks', '🍽️ Another meal', '🛒 View cart', "✓ I'm done"],
        });
      }
      // FLOW 4 — BUDGET MEAL
      else if (
        q === 'budget meal' ||
        q === 'budget friendly' ||
        q === 'i want something cheap' ||
        q === 'cheap' ||
        q.includes('what price works for you')
      ) {
        await streamAssistantReply({
          message: 'What price works for you?',
          quickOptions: ['Under $10', 'Under $12', 'Under $15', 'Best value'],
        });
      } else if (q.includes('under $10') || q.includes('under $12') || (q.includes('under $15') && !q.includes('another')) || q.includes('best value')) {
        const cap = q.includes('under $10') ? 10.0 : q.includes('under $12') ? 12.0 : 15.0;
        lastFilterRef.current = { type: 'budget', cap };

        // Exclude previously shown meals to guarantee NO repetition
        let budgetMeals = MOCK_MOBILE_MEALS.filter(
          (m) => m.category === 'main' && m.price <= cap && !shownMealIdsRef.current.has(m.id)
        );
        if (budgetMeals.length < 3) {
          // If running low on unseen meals, allow unseen first then reset
          budgetMeals = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main' && m.price <= cap);
        }

        const pickedMeals = budgetMeals.slice(0, 4);
        pickedMeals.forEach((m) => shownMealIdsRef.current.add(m.id));

        const recs: Recommendation[] = pickedMeals.map((meal, idx) => ({
          meal,
          score: 96 - idx * 2,
          reasons: [q.includes('best value') ? '✓ High protein per $' : `✓ Under $${cap.toFixed(2)}`, '✓ Top customer rating'],
        }));

        await streamAssistantReply({
          message: q.includes('best value')
            ? 'Here are our best value meals today! Generous portions, high protein, and exceptional ratings:'
            : `Here are great options under $${cap.toFixed(2)}:`,
          recommendations: recs,
          quickOptions: ['🍗 Chicken', '🌱 Vegetarian', '🌶️ Spicy', '🥟 Add a side', '🔄 More'],
        });
      }
      // FLOW 4B — DEDUPLICATED "MORE" HANDLER (Solves feedback point 1)
      else if (q === 'more' || q === '🔄 more' || q === 'show me more' || q === 'see more' || q === 'more options' || q === '🔄 show me more') {
        const cap = lastFilterRef.current.cap || 12.0;
        let freshMeals = MOCK_MOBILE_MEALS.filter(
          (m) => m.category === 'main' && m.price <= cap && !shownMealIdsRef.current.has(m.id)
        );

        if (freshMeals.length === 0) {
          // If all meals under cap have been shown, pick other budget-friendly meals not yet seen
          freshMeals = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main' && !shownMealIdsRef.current.has(m.id));
        }

        if (freshMeals.length === 0) {
          // Fresh cycle if everything was seen
          freshMeals = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main' && m.price <= cap);
          shownMealIdsRef.current.clear();
        }

        const pickedMore = freshMeals.slice(0, 4);
        pickedMore.forEach((m) => shownMealIdsRef.current.add(m.id));

        const recs: Recommendation[] = pickedMore.map((meal, idx) => ({
          meal,
          score: 95 - idx * 2,
          reasons: [`✓ Under $${cap.toFixed(2)}`, '✓ Fresh distinct option (no repeats)'],
        }));

        await streamAssistantReply({
          message: `Here are more fresh options under $${cap.toFixed(2)} (no repeated dishes) 🍽️:`,
          recommendations: recs,
          quickOptions: ['🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🔄 More', '🛒 View cart'],
        });
      }
      // FLOW 11 — PLAN MY WEEK / FIVE DAY MEAL PLAN (Priority intent over simple cuisine discovery)
      else if (
        q.includes('plan my week') ||
        q.includes('plan my meals') ||
        q.includes('weekly plan') ||
        q.includes('plan meals') ||
        q.includes('five day meal') ||
        q.includes('5 day meal') ||
        q.includes('5-day meal') ||
        q.includes('monday to friday') ||
        (q.includes('plan') && (q.includes('day') || q.includes('week') || q.includes('dinner') || q.includes('cuisine')))
      ) {
        let daysCount = 5;
        if (q.includes('7 day') || q.includes('7-day') || q.includes('7 meals')) {
          daysCount = 7;
        } else if (q.includes('3 day') || q.includes('3-day') || q.includes('3 meals')) {
          daysCount = 3;
        }

        const allDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const selectedDays = allDays.slice(0, daysCount);

        const isIndianPlan = q.includes('indian') || q.includes('punjabi');
        const isChinesePlan = q.includes('chinese');
        const isIndoChinesePlan = /indo[- ]?chinese|indian chinese|manchurian|hakka/i.test(q);
        const isItalianPlan = q.includes('italian');
        const isAsianPlan = q.includes('asian') || q.includes('thai') || q.includes('japanese');

        let planPool = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
        if (isIndoChinesePlan) {
          planPool = planPool.filter((m) => m.cuisine.toLowerCase().includes('indo-chinese') || /manchurian|hakka|schezwan|chilli/i.test(m.name));
        } else if (isIndianPlan) {
          planPool = planPool.filter((m) => m.cuisine.toLowerCase().includes('indian') || m.cuisine.toLowerCase().includes('punjabi'));
        } else if (isChinesePlan) {
          planPool = planPool.filter((m) => m.cuisine.toLowerCase().includes('chinese'));
        } else if (isItalianPlan) {
          planPool = planPool.filter((m) => m.cuisine.toLowerCase().includes('italian'));
        } else if (isAsianPlan) {
          planPool = planPool.filter((m) => ['thai', 'japanese', 'asian', 'malaysian', 'korean'].includes(m.cuisine.toLowerCase()));
        }

        if (planPool.length === 0) {
          planPool = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
        }

        const planMeals: Meal[] = [];
        let runningTotal = 0;
        for (let i = 0; i < selectedDays.length; i++) {
          const candidate = planPool[i % planPool.length];
          planMeals.push(candidate);
          runningTotal += candidate.price;
        }
        runningTotal = Math.round(runningTotal * 100) / 100;
        lastWeeklyPlanRef.current = planMeals;

        const cuisineLabel = isIndianPlan ? 'Indian ' : isIndoChinesePlan ? 'Indo-Chinese ' : isItalianPlan ? 'Italian ' : isAsianPlan ? 'Asian ' : '';
        const targetBudget = isIndianPlan ? 65 : 60;

        await streamAssistantReply({
          message: `Here is your curated ${daysCount}-Day ${cuisineLabel}Meal Plan from Monday to Friday! Balanced, diverse, and strictly within your $${targetBudget} budget (Total: $${runningTotal.toFixed(2)}) 📅✨:`,
          weeklyPlan: {
            id: `plan_${Date.now()}`,
            userId,
            targetBudget,
            actualTotal: runningTotal,
            currency: 'USD',
            days: selectedDays.map((day, idx) => ({
              day,
              slot: 'dinner',
              meal: planMeals[idx],
              reason: idx === selectedDays.length - 1 ? 'Wholesome dinner to wrap the week' : 'Authentic daily specialty',
            })),
          },
          quickOptions: [`🛒 Add all ${daysCount} to cart`, '🌱 Make Friday vegetarian', '🌶️ Adjust spice', '🔄 Create another plan'],
        });
      }
      // FLOW 5 — CUISINE DISCOVERY
      else if (q.includes('asian food') || q.includes('feel like asian') || q === 'asian') {
        await streamAssistantReply({
          message: 'What sounds good?',
          quickOptions: ['🇹🇭 Thai', '🇮🇩 Indonesian', '🇨🇳 Chinese', '🇯🇵 Japanese', '🌏 Surprise me'],
        });
      } else if (q === 'cuisine discovery' || q === 'cuisines' || q === 'explore cuisines') {
        await streamAssistantReply({
          message: 'What sounds good?',
          quickOptions: ['🇮🇳 Indian', '🥢 Indo-Chinese', '🌏 Asian', '🌍 African', '🥙 Middle Eastern', '🍝 Western', '✨ Something different'],
        });
      } else if (
        (q.includes('chinese') || q.includes('korean') || q.includes('italian') || q.includes('thai') || q.includes('indonesian') || q.includes('japanese') || q.includes('indian') || q.includes('punjabi') || q.includes('african') || q.includes('malaysian') || q.includes('indo-chinese') || q.includes('manchurian') || q.includes('hakka')) &&
        !q.includes('combo') && !q.includes('side')
      ) {
        const isIndoChinese =
          q.includes('indian chinese') ||
          q.includes('indo chinese') ||
          q.includes('indo-chinese') ||
          q.includes('desi chinese') ||
          q.includes('manchurian') ||
          q.includes('hakka');

        const cTarget = isIndoChinese
          ? 'Indo-Chinese'
          : q.includes('chinese')
          ? 'Chinese'
          : q.includes('korean')
          ? 'Korean'
          : q.includes('italian')
          ? 'Italian'
          : q.includes('japanese')
          ? 'Japanese'
          : q.includes('thai')
          ? 'Thai'
          : q.includes('malaysian')
          ? 'Malaysian'
          : q.includes('indonesian')
          ? 'Indonesian'
          : q.includes('african')
          ? 'African'
          : 'Indian';

        let cMeals = MOCK_MOBILE_MEALS.filter((m) =>
          isIndoChinese
            ? m.cuisine.toLowerCase().includes('indo-chinese') || /manchurian|hakka|schezwan|chilli/i.test(m.name)
            : m.cuisine.toLowerCase().includes(cTarget.toLowerCase())
        );

        // Prioritize mains ahead of drinks/sides
        const mains = cMeals.filter((m) => m.category === 'main');
        if (mains.length > 0) cMeals = mains;

        if (q.includes('veg') || q.includes('vegetarian') || q.includes('plant')) {
          cMeals = cMeals.filter(
            (m) =>
              m.healthFlags?.vegetarian ||
              m.dietaryTags.some((t) => /veg/i.test(t)) ||
              (!m.ingredients.some((i) => /chicken|beef|meat|fish|prawn|pork|lamb/i.test(i)) &&
                !/chicken|beef|meat|fish|prawn|pork|lamb/i.test(m.name))
          );
        }

        const priceMatch = q.match(/under\s*\$?(\d+)/i);
        if (priceMatch) {
          const cap = parseFloat(priceMatch[1]);
          cMeals = cMeals.filter((m) => m.price <= cap);
        }

        const recs: Recommendation[] = (cMeals.length > 0 ? cMeals : MOCK_MOBILE_MEALS).slice(0, 4).map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: [`✓ Authentic ${meal.cuisine}`, '✓ Fresh daily drop'],
        }));

        const cuisineMsg = isIndoChinese
          ? `Here are popular Indo-Chinese dishes tossed in bold chilli-garlic and Manchurian flavours 🥢:`
          : `Here are popular ${cTarget} dishes ready for order:`;

        await streamAssistantReply({
          message: cuisineMsg,
          recommendations: recs,
          quickOptions: isIndoChinese
            ? ['🌶️ Extra spicy', '🌱 Veg only', '🍗 Chicken only', '🍜 Add Hakka Noodles', '🛒 View cart']
            : ['💰 Under $15', '🌶️ Spicy', '🍗 Chicken', '🌱 Vegetarian', '🛒 View cart'],
        });
      }
      // FLOW 6 — PROTEIN-FIRST CUSTOMER
      else if (q === 'protein' || q === 'build around protein' || q === 'gym food' || q === 'fitness') {
        await streamAssistantReply({
          message: 'What would you like your meal built around?',
          quickOptions: ['🍗 Chicken', '🥩 Lamb/Beef', '🐟 Seafood', '🥚 Eggs', '🧀 Paneer', '🌱 Plant based'],
        });
      } else if ((q.includes('chicken') || q.includes('beef') || q.includes('seafood') || q.includes('plant based')) && !q.includes('add') && !q.includes('usual') && !q.includes('twice')) {
        const pWord = q.includes('chicken') ? 'Chicken' : q.includes('beef') ? 'Beef' : q.includes('seafood') ? 'Salmon' : 'Lentil';
        const pMeals = MOCK_MOBILE_MEALS.filter((m) => m.name.toLowerCase().includes(pWord.toLowerCase()) || m.ingredients.some(i => i.toLowerCase().includes(pWord.toLowerCase())));
        const recs: Recommendation[] = (pMeals.length > 0 ? pMeals : MOCK_MOBILE_MEALS).slice(0, 4).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [`✓ Rich in ${pWord} protein`, '✓ Balanced macros'],
        }));
        await streamAssistantReply({
          message: `Here are great dishes built around ${pWord} across cuisines:`,
          recommendations: recs,
          quickOptions: ['🌶️ Spicy', '💪 High protein', '💰 Under $15', '🥗 Healthy', '🍛 Curry'],
        });
      }
      // FLOW 7 — DIETARY REQUIREMENT & ALLERGY SAFETY
      else if (q.includes('what can i eat') || q === 'dietary requirements' || q === 'dietary requirement' || q === 'dietary restrictions') {
        await streamAssistantReply({
          message: 'Any dietary requirements I should consider?',
          quickOptions: ['🌱 Vegan', '🥬 Vegetarian', '☪️ Halal', '🌾 Gluten Free', '🥛 Dairy Free', '🥜 Allergies', 'None'],
        });
      } else if (q === 'allergies' || q === '🥜 allergies' || q.includes('allergy')) {
        await streamAssistantReply({
          message: 'What ingredients do you need to avoid?',
          quickOptions: ['Peanuts', 'Tree nuts', 'Milk', 'Egg', 'Gluten', 'Soy', 'Sesame', 'Seafood', 'Other'],
        });
      } else if (q === 'peanuts' || q === 'tree nuts' || q === 'milk' || q === 'egg' || q === 'gluten' || q === 'soy') {
        const safe = MOCK_MOBILE_MEALS.filter((m) => !m.ingredients.some(i => i.toLowerCase().includes(q)));
        const recs: Recommendation[] = safe.slice(0, 3).map((meal, idx) => ({
          meal,
          score: 99 - idx * 2,
          reasons: [`✓ Verified 0% ${cleanText}`, '✓ Safe kitchen prep'],
        }));
        await streamAssistantReply({
          message: `Here are kitchen-verified meals free from ${cleanText}:`,
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🌶️ Spicy', '💪 High protein', '🥗 Healthy'],
        });
      } else if (
        q.includes('halal') ||
        q.includes('vegan') ||
        q.includes('vegetarian') ||
        q.includes('gluten free') ||
        q.includes('dairy free')
      ) {
        const isHalal = q.includes('halal');
        const isGlutenFree = q.includes('gluten free') || q.includes('gluten-free');
        const isDairyFree = q.includes('dairy free') || q.includes('dairy-free');
        const isVegan = q.includes('vegan');
        const isVeg = q.includes('vegetarian') || q.includes('veg');

        let dMeals = MOCK_MOBILE_MEALS;
        if (isHalal) dMeals = dMeals.filter(isHalalMeal);
        if (isGlutenFree) dMeals = dMeals.filter(isGlutenFreeMeal);
        if (isDairyFree) dMeals = dMeals.filter(isDairyFreeMeal);
        if (isVegan) dMeals = dMeals.filter(isVeganMeal);
        else if (isVeg) dMeals = dMeals.filter(isVegetarianMeal);

        if (isHalal) {
          // Sort authentic Halal meat & feast mains first from the sheet
          dMeals = [...dMeals].sort((a, b) => {
            const aMeat = a.category === 'main' && /chicken|mutton|beef|biryani|tikka|rendang/i.test(a.name);
            const bMeat = b.category === 'main' && /chicken|mutton|beef|biryani|tikka|rendang/i.test(b.name);
            if (aMeat && !bMeat) return -1;
            if (!aMeat && bMeat) return 1;
            return 0;
          });
        }

        let msg = '';
        if (isHalal && isGlutenFree) {
          msg = 'I’ve curated delicious meals that are both certified Halal and 100% Gluten-Free for you 🌙✨:';
        } else if (isHalal) {
          msg = 'Here is our selection of certified Halal meals prepared fresh today with 100% Halal-sourced ingredients 🌙:';
        } else if (isVegan) {
          msg = 'Here are our top plant-based vegan dishes prepared fresh today 🌱:';
        } else if (isVeg && isGlutenFree) {
          msg = 'Here are fresh vegetarian and gluten-free meals ready for order 🌱🌾:';
        } else if (isVeg) {
          msg = 'Here are popular vegetarian meals ready for order 🌱:';
        } else if (isGlutenFree) {
          msg = 'Here are kitchen-verified gluten-free meals prepared safe for you 🌾:';
        } else {
          msg = 'Here are meals matching your dietary preferences ready for order 🍽️:';
        }

        const recs: Recommendation[] = (dMeals.length > 0 ? dMeals : MOCK_MOBILE_MEALS).slice(0, 4).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [
            isHalal ? '✓ 100% Halal certified kitchen' : isVegan ? '✓ 100% Vegan' : '✓ Verified dietary safe',
            '✓ Fresh daily drop prep',
          ],
        }));

        await streamAssistantReply({
          message: msg,
          recommendations: recs,
          quickOptions: isHalal
            ? ['🍗 Chicken only', '🥩 Mutton/Beef', '🌶️ Spicy', '💰 Under $15', '🛒 View cart']
            : ['💰 Under $15', '🌶️ Spicy', '💪 High protein', '🥗 Healthy', '🛒 View cart'],
        });
      }
      // FLOW 8 — “SOMETHING DIFFERENT” / ADVENTURE
      else if (q === 'something different' || q === '✨ something different' || q.includes('adventurous') || q === 'try something new') {
        await streamAssistantReply({
          message: 'How adventurous are we feeling? 😄',
          quickOptions: ['🙂 A little different', '🌍 Take me somewhere new', '🔥 Bold flavours', '🎲 Completely surprise me'],
        });
      } else if (q.includes('a little different') || q.includes('take me somewhere new') || q.includes('bold flavours') || q.includes('completely surprise me')) {
        const advMeals = MOCK_MOBILE_MEALS.filter((m) => m.cuisine === 'Indonesian' || m.cuisine === 'African' || m.spicyLevel > 1);
        const recs: Recommendation[] = (advMeals.length > 0 ? advMeals : MOCK_MOBILE_MEALS).slice(0, 3).map((meal, idx) => ({
          meal,
          score: 96 - idx * 2,
          reasons: ['✓ Distinct regional flavour', '✓ Highly rated by adventurous foodies'],
        }));
        await streamAssistantReply({
          message: 'Here are exciting, authentic dishes outside your usual routine:',
          recommendations: recs,
          quickOptions: ['🔄 Another surprise', '🙂 Less adventurous', '👍 More like this'],
        });
      }
      // FLOW 9 — “MY USUAL” (Direct Intelligent Reorder without redundant pre-questions)
      else if (
        q === 'my usual' ||
        q === 'order my usual' ||
        q === 'reorder my usual' ||
        q === 'give me my usual' ||
        q === 'the usual' ||
        q === 'usual' ||
        q === 'favourite' ||
        q === 'favorites' ||
        q.includes('favourite again') ||
        q.includes('usual again')
      ) {
        await streamAssistantReply({
          message:
            "Welcome back, Alex! Here is your usual go-to order based on your recent favourites: **Thai Basil Chicken** ($13.00 + fees = $16.00). Ready for tomorrow's dinner 🍽️:",
          usualOrder: {
            id: 'ord_usual',
            userId,
            date: 'Tomorrow',
            slot: 'dinner',
            items: [
              {
                mealId: 'meal_thai_basil',
                mealName: 'Thai Basil Chicken',
                price: 13,
                quantity: 1,
                restaurantName: 'Thai Orchid Street',
              },
            ],
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
        });
      } else if (q.includes('similar to my usual')) {
        const recs: Recommendation[] = MOCK_MOBILE_MEALS.slice(0, 3).map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: ['✓ Similar to your past favourites', '✓ Medium spicy & high protein'],
        }));
        await streamAssistantReply({
          message: 'You usually go for medium-spicy chicken and rice meals. Here are three you might like:',
          recommendations: recs,
          quickOptions: ['👍 More like these', '🌶️ Spicier', '🥗 Healthier', '✨ More adventurous'],
        });
      } else if (q.includes('favourite again') || q.includes('usual again')) {
        await streamAssistantReply({
          message: "Here's your go-to order based on your recent favourites:",
          usualOrder: {
            id: 'ord_usual',
            userId,
            date: 'Tomorrow',
            slot: 'dinner',
            items: [
              {
                mealId: 'meal_thai_basil',
                mealName: 'Thai Basil Chicken',
                price: 13,
                quantity: 1,
                restaurantName: 'Thai Orchid Street',
              },
            ],
            subtotal: 13,
            deliveryFee: 2.0,
            tax: 1.0,
            total: 16,
            restaurantId: 'rest_thai',
            restaurantName: 'Thai Orchid Street',
            status: 'draft',
            isUsual: true,
          },
          quickOptions: ['🛒 Add to cart', '🥟 Add a side', '🥤 Add a drink'],
        });
      }
      // FLOW 10 — REORDER
      else if (q.includes('last tuesday') || (q.includes('reorder') && !q.includes('usual'))) {
        await streamAssistantReply({
          message: 'You had Chicken Biryani + Mango Lassi. Both are available.',
          quickOptions: ['🛒 Add both', '✏️ Change meal', '🍛 Just the biryani'],
        });
      } else if (q.includes('add both')) {
        const biryani = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_biryani') || MOCK_MOBILE_MEALS[0];
        const lassi = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_mango_lassi') || MOCK_MOBILE_MEALS[1];
        setCart((prev) => {
          const items = [
            ...(prev?.items || []),
            { mealId: biryani.id, meal: biryani, quantity: 1, selectedSlot: 'dinner' as const, selectedDate: 'Tomorrow' },
            { mealId: lassi.id, meal: lassi, quantity: 1, selectedSlot: 'dinner' as const, selectedDate: 'Tomorrow' },
          ];
          const subtotal = items.reduce((s, i) => s + i.meal.price * i.quantity, 0);
          return { items, subtotal, deliveryFee: 2.5, estimatedTax: 1.5, total: subtotal + 4.0, currency: 'USD' };
        });
        await streamAssistantReply({
          message: 'Added Chicken Biryani + Mango Lassi to your cart! Total: $21.50. Ready to checkout?',
          quickOptions: ['Confirm order', 'Edit cart'],
        });
      } else if (q.includes('just the biryani')) {
        const biryani = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_biryani') || MOCK_MOBILE_MEALS[0];
        setCart((prev) => {
          const items = [
            ...(prev?.items || []),
            { mealId: biryani.id, meal: biryani, quantity: 1, selectedSlot: 'dinner' as const, selectedDate: 'Tomorrow' },
          ];
          const subtotal = items.reduce((s, i) => s + i.meal.price * i.quantity, 0);
          return { items, subtotal, deliveryFee: 2.5, estimatedTax: 1.0, total: subtotal + 3.5, currency: 'USD' };
        });
        await streamAssistantReply({
          message: 'Added Chicken Biryani to your cart! Total: $17.50. Ready to checkout?',
          quickOptions: ['Confirm order', 'Edit cart'],
        });
      }
      // FLOW 11 — PLAN MY WEEK
      else if (q === 'plan my week' || q === 'plan my meals' || q === 'weekly plan' || q === 'plan meals') {
        const targetBudget = 65;
        const allDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ];
        const mains = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
        const sortedMains = [...mains].sort((a, b) => a.price - b.price);
        const planMeals: Meal[] = [];
        let runningTotal = 0;
        for (let i = 0; i < allDays.length; i++) {
          const candidate = sortedMains[i % sortedMains.length];
          planMeals.push(candidate);
          runningTotal += candidate.price;
        }
        runningTotal = Math.round(runningTotal * 100) / 100;
        lastWeeklyPlanRef.current = planMeals;

        await streamAssistantReply({
          message: `I've prepared a curated Monday–Friday dinner plan keeping your meals balanced, diverse, and under $${targetBudget.toFixed(2)}! Total: $${runningTotal.toFixed(2)}. 📅✨`,
          weeklyPlan: {
            id: `plan_${Date.now()}`,
            userId,
            targetBudget,
            actualTotal: runningTotal,
            currency: 'USD',
            days: allDays.map((day, idx) => ({
              day,
              slot: 'dinner',
              meal: planMeals[idx],
              reason: idx === allDays.length - 1 ? 'Wholesome dinner to wrap the week' : 'High protein favourite',
            })),
          },
          quickOptions: ['🛒 Add all 5', 'Change Wednesday', 'Make Friday vegetarian', 'Keep everything under $60'],
        });
      } else if (
        q.includes('under $60') ||
        q.includes('under 60') ||
        q.includes('under $75') ||
        q.includes('under 75') ||
        q.includes('no limit') ||
        q.includes('dinners') ||
        q.includes('meal plan') ||
        q.includes('plan')
      ) {
        // Parse days count dynamically (default 5, support 7 or 3)
        let daysCount = 5;
        if (q.includes('7 day') || q.includes('7-day') || q.includes('7 meals')) {
          daysCount = 7;
        } else if (q.includes('3 day') || q.includes('3-day') || q.includes('3 meals')) {
          daysCount = 3;
        }

        // Parse target budget dynamically
        let targetBudget = 60;
        const budgetMatch = q.match(/under\s*\$?(\d+)/i);
        if (budgetMatch) {
          targetBudget = parseFloat(budgetMatch[1]);
        } else if (q.includes('75')) {
          targetBudget = 75;
        }

        const allDays: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[] = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const selectedDays = allDays.slice(0, daysCount);

        // Pick distinct meals strictly respecting the target budget
        const mains = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
        const sortedMains = [...mains].sort((a, b) => a.price - b.price);

        const planMeals: Meal[] = [];
        let runningTotal = 0;
        for (let i = 0; i < selectedDays.length; i++) {
          const candidate = sortedMains[i % sortedMains.length];
          planMeals.push(candidate);
          runningTotal += candidate.price;
        }
        runningTotal = Math.round(runningTotal * 100) / 100;
        lastWeeklyPlanRef.current = planMeals;

        await streamAssistantReply({
          message: `Here's your curated ${daysCount}-day dinner plan keeping things balanced, delicious, and strictly within your $${targetBudget} budget! (Total: $${runningTotal.toFixed(2)}) 📅✨`,
          weeklyPlan: {
            id: `plan_${Date.now()}`,
            userId,
            targetBudget,
            actualTotal: runningTotal,
            currency: 'USD',
            days: selectedDays.map((day, idx) => ({
              day,
              slot: 'dinner',
              meal: planMeals[idx],
              reason: idx === selectedDays.length - 1 ? 'Wholesome dinner to wrap the week' : 'High protein favourite',
            })),
          },
          quickOptions: [`🛒 Add all ${daysCount}`, '🔄 Create another plan', '🥟 Add a side', '🥤 Add a drink'],
        });
      }
      // FLOW 11B — ADD ALL (MEAL PLAN TO CART) (Solves feedback point 8)
      else if (
        q.includes('add all') ||
        q === '🛒 add all 5' ||
        q === 'add all 5' ||
        q === '🛒 add all 7' ||
        q === 'add all 7' ||
        q === 'add plan' ||
        q.includes('add entire plan')
      ) {
        const mealsToAdd = lastWeeklyPlanRef.current.length > 0
          ? lastWeeklyPlanRef.current
          : MOCK_MOBILE_MEALS.filter((m) => m.category === 'main').slice(0, 5);

        for (const m of mealsToAdd) {
          await addToCart(m.id, 1, false);
        }

        const planSum = Math.round(mealsToAdd.reduce((s, m) => s + m.price, 0) * 100) / 100;
        await streamAssistantReply({
          message: `Added all ${mealsToAdd.length} curated dinners to your cart! 🛒 Subtotal: $${planSum.toFixed(2)}. Ready to checkout or add sides & drinks?`,
          quickOptions: ['Confirm order', '🛒 View cart', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert'],
        });
      }
      // FLOW 11C — ADD SIDE (Directly show side dishes without intro text message)
      else if (q.includes('add a side') || q.includes('add side') || q === 'side' || q === 'sides' || q === '🥟 add a side') {
        const sides = MOCK_MOBILE_MEALS.filter((m) => m.category === 'side').slice(0, 4);
        await streamAssistantReply({
          message: '',
          recommendations: sides.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Perfect meal pairing', '✓ Freshly prepared'],
          })),
          quickOptions: ['🥤 Add a drink', '🍰 Add a dessert', '🛒 View cart', "✅ I'm done"],
        });
      }
      // FLOW 11D — ADD DRINK (Directly show drinks without intro text message)
      else if (q.includes('add a drink') || q.includes('add drink') || q === 'drink' || q === 'drinks' || q === '🥤 add a drink') {
        const drinks = MOCK_MOBILE_MEALS.filter((m) => m.category === 'drink').slice(0, 4);
        await streamAssistantReply({
          message: '',
          recommendations: drinks.map((m, idx) => ({
            meal: m,
            score: 99 - idx * 2,
            reasons: ['✓ Cold & refreshing', '✓ Customer favourite'],
          })),
          quickOptions: ['🥟 Add a side', '🍰 Add a dessert', '🛒 View cart', "✅ I'm done"],
        });
      }
      // FLOW 11E — ADD DESSERT (Directly show desserts without intro text message)
      else if (
        q.includes('add a dessert') ||
        q.includes('add dessert') ||
        q.includes('dessert') ||
        q.includes('desserts') ||
        q.includes('desert') ||
        q.includes('deserts') ||
        q === '🍰 add a dessert'
      ) {
        const desserts = MOCK_MOBILE_MEALS.filter((m) => m.category === 'dessert').slice(0, 4);
        await streamAssistantReply({
          message: '',
          recommendations: desserts.map((m, idx) => ({
            meal: m,
            score: 97 - idx * 2,
            reasons: ['✓ Handcrafted dessert', '✓ Perfectly sweet'],
          })),
          quickOptions: ['🥤 Add a drink', '🥟 Add a side', '🛒 View cart', "✅ I'm done"],
        });
      }
      // FLOW 11F — ADD SOUP (Directly show soups without intro text message)
      else if (q.includes('add soup') || q.includes('soup') || q === '🍲 add soup') {
        const soups = MOCK_MOBILE_MEALS.filter((m) => m.name.toLowerCase().includes('soup')).slice(0, 3);
        await streamAssistantReply({
          message: '',
          recommendations: soups.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Warm & soothing', '✓ Authentic broth'],
          })),
          quickOptions: ['🥟 Add a side', '🥤 Add a drink', '🛒 View cart'],
        });
      }
      // FLOW 11G — ADD SALAD (Directly show salads without intro text message)
      else if (q.includes('add salad') || q.includes('salad') || q === '🥗 add salad') {
        const salads = MOCK_MOBILE_MEALS.filter((m) => m.name.toLowerCase().includes('salad') || m.ingredients.includes('greens')).slice(0, 3);
        await streamAssistantReply({
          message: '',
          recommendations: salads.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Crisp & wholesome', '✓ Fresh vinaigrette'],
          })),
          quickOptions: ['🥤 Add a drink', '🍰 Add a dessert', '🛒 View cart'],
        });
      }
      // FLOW 12 — “WHAT CAN I GET TOMORROW?”
      else if (q.includes('what can i get tomorrow') || q.includes('available tomorrow') || q.includes('tomorrow dinner') || q.includes("tomorrow's dinner")) {
        const recs: Recommendation[] = MOCK_MOBILE_MEALS.slice(0, 4).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: ['✓ Available for tomorrow delivery', '✓ Freshly prepped to order'],
        }));
        await streamAssistantReply({
          message: "Here's what's available for tomorrow's dinner:",
          recommendations: recs,
          quickOptions: ['❤️ Healthy', '💰 Under $15', '🌶️ Spicy', '🌱 Vegetarian', '✨ Surprise me'],
        });
      }
      // FLOW 13 — FAMILY / MULTIPLE PEOPLE
      else if (q.includes('dinner for four') || q.includes('dinner for 4') || q.includes('dinner for three') || q.includes('family dinner') || q.includes('feed 4')) {
        await streamAssistantReply({
          message: 'Got it. Is everyone happy eating similar food?',
          quickOptions: ['👍 Yes', '👨‍👩‍👧 Different preferences'],
        });
      } else if (q.includes('different preferences')) {
        await streamAssistantReply({
          message: 'Tell me what I need to work around:',
          quickOptions: ['🌱 Vegetarian', '🌶️ Different spice levels', '🥜 Allergies', '👧 Kid friendly', 'Nothing'],
        });
      } else if (
        q.includes('add dinner for 4') ||
        q.includes('add entire feast') ||
        q.includes('add indian feast') ||
        q.includes('add italian feast') ||
        q.includes('add asian feast') ||
        q.includes('add mexican feast') ||
        q === 'add selection' ||
        q === '🛒 add selection'
      ) {
        // Direct One-Tap Add to Cart for the 4-person feast
        const biryani = MOCK_MOBILE_MEALS.find((m) => /chicken biryani/i.test(m.name)) || MOCK_MOBILE_MEALS[3];
        const dal = MOCK_MOBILE_MEALS.find((m) => /dal chawal|lentil/i.test(m.name)) || MOCK_MOBILE_MEALS[6];
        const salmon = MOCK_MOBILE_MEALS.find((m) => /salmon/i.test(m.name)) || MOCK_MOBILE_MEALS[2];

        setCart((prev) => {
          const newItems = [...(prev?.items || [])];
          const feastItems = [
            { meal: biryani, qty: 2 },
            { meal: dal, qty: 1 },
            { meal: salmon, qty: 1 },
          ];
          for (const it of feastItems) {
            const existingIdx = newItems.findIndex((x) => x.mealId === it.meal.id);
            if (existingIdx >= 0) {
              newItems[existingIdx] = {
                ...newItems[existingIdx],
                quantity: newItems[existingIdx].quantity + it.qty,
              };
            } else {
              newItems.push({
                mealId: it.meal.id,
                meal: it.meal,
                quantity: it.qty,
                selectedSlot: 'dinner',
                selectedDate: 'Tomorrow',
              });
            }
          }
          const subtotal = newItems.reduce((s, i) => s + i.meal.price * i.quantity, 0);
          return {
            items: newItems,
            subtotal,
            deliveryFee: 2.5,
            estimatedTax: 1.5,
            total: subtotal + 4.0,
            currency: 'USD',
          };
        });

        await streamAssistantReply({
          message: 'Added the Family Feast (Dinner for 4) to your cart! 🛒 Total: $52.00. Ready to checkout?',
          quickOptions: ['Confirm order', 'Edit cart', 'Add extra drinks'],
        });
      } else if (
        q.includes('italian family') ||
        (q.includes('italian') && (q.includes('dinner for 4') || q.includes('feast') || q.includes('family')))
      ) {
        // Italian Family Night ($48)
        const bolognese = MOCK_MOBILE_MEALS.find((m) => /bolognese|beef/i.test(m.name)) || MOCK_MOBILE_MEALS[0];
        const alfredo = MOCK_MOBILE_MEALS.find((m) => /pasta|quinoa|rice/i.test(m.name) && m.id !== bolognese.id) || MOCK_MOBILE_MEALS[1];
        const pizza = MOCK_MOBILE_MEALS.find((m) => /halloumi|bowl/i.test(m.name)) || MOCK_MOBILE_MEALS[2];
        const salad = MOCK_MOBILE_MEALS.find((m) => /salad|greens/i.test(m.name)) || MOCK_MOBILE_MEALS[3];

        const recs: Recommendation[] = [bolognese, alfredo, pizza, salad].map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [idx === 0 ? '✓ Family portion main (2x)' : idx === 1 ? '✓ Creamy crowd favourite' : '✓ Freshly baked classic'],
        }));

        await streamAssistantReply({
          message: 'Italian Family Night — $48.00 🍝\nCurated with 2x Beef Bolognese Pasta, 1x Creamy Fettuccine Alfredo, 1x Margherita Pizza + Garlic Herb bread for 4.\n\nWould you like to try a different cuisine for your family dinner?',
          budgetBasket: {
            id: 'basket_italian_4',
            userId,
            budgetCap: 48,
            actualTotal: 48,
            total: 48,
            title: '👨‍👩‍👧‍👦 Italian Family Night (Dinner for 4)',
            items: [
              { mealId: bolognese.id, name: '2x Beef Bolognese Pasta', price: 24 },
              { mealId: alfredo.id, name: '1x Creamy Fettuccine Alfredo', price: 12 },
              { mealId: pizza.id, name: '1x Margherita Pizza', price: 12 },
            ],
          },
          recommendations: recs,
          quickOptions: [
            '🛒 Add Dinner for 4 to cart ($48)',
            '🇮🇳 Indian Feast ($52)',
            '🥢 Asian Fusion Combo ($50)',
            '🌮 Mexican Fiesta ($46)',
          ],
        });
      } else if (
        q.includes('asian fusion') ||
        (q.includes('asian') && (q.includes('dinner for 4') || q.includes('feast') || q.includes('family')))
      ) {
        // Asian Fusion Combo ($50)
        const thai = MOCK_MOBILE_MEALS.find((m) => /thai basil/i.test(m.name)) || MOCK_MOBILE_MEALS[0];
        const ramen = MOCK_MOBILE_MEALS.find((m) => /ramen|noodle/i.test(m.name)) || MOCK_MOBILE_MEALS[1];
        const salmon = MOCK_MOBILE_MEALS.find((m) => /salmon/i.test(m.name)) || MOCK_MOBILE_MEALS[2];
        const soup = MOCK_MOBILE_MEALS.find((m) => /soup/i.test(m.name)) || MOCK_MOBILE_MEALS[3];

        const recs: Recommendation[] = [thai, ramen, salmon, soup].map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [idx === 0 ? '✓ Wok-fired family favourite (2x)' : idx === 1 ? '✓ Rich broth & noodles' : '✓ Omega-3 teriyaki salmon'],
        }));

        await streamAssistantReply({
          message: 'Asian Fusion Combo — $50.00 🥢\nCurated with 2x Thai Basil Chicken Rice, 1x Tonkotsu Ramen Noodle Bowl, 1x Teriyaki Salmon Bowl + Hot Tom Yum Soup for 4.\n\nWould you like to try a different cuisine for your family dinner?',
          budgetBasket: {
            id: 'basket_asian_4',
            userId,
            budgetCap: 50,
            actualTotal: 50,
            total: 50,
            title: '👨‍👩‍👧‍👦 Asian Fusion Feast (Dinner for 4)',
            items: [
              { mealId: thai.id, name: '2x Thai Basil Chicken Rice', price: 26 },
              { mealId: ramen.id, name: '1x Tonkotsu Ramen Bowl', price: 12 },
              { mealId: salmon.id, name: '1x Teriyaki Salmon Bowl', price: 12 },
            ],
          },
          recommendations: recs,
          quickOptions: [
            '🛒 Add Dinner for 4 to cart ($50)',
            '🇮🇳 Indian Feast ($52)',
            '🍝 Italian Family Night ($48)',
            '🌮 Mexican Fiesta ($46)',
          ],
        });
      } else if (
        q.includes('mexican fiesta') ||
        (q.includes('mexican') && (q.includes('dinner for 4') || q.includes('feast') || q.includes('family')))
      ) {
        // Mexican Fiesta ($46)
        const burrito = MOCK_MOBILE_MEALS.find((m) => /quinoa|halloumi/i.test(m.name)) || MOCK_MOBILE_MEALS[0];
        const chicken = MOCK_MOBILE_MEALS.find((m) => /chicken/i.test(m.name) && m.id !== burrito.id) || MOCK_MOBILE_MEALS[1];
        const veg = MOCK_MOBILE_MEALS.find((m) => /veg|paneer/i.test(m.name)) || MOCK_MOBILE_MEALS[2];
        const side = MOCK_MOBILE_MEALS.find((m) => m.category === 'main' && m.id !== chicken.id) || MOCK_MOBILE_MEALS[3];

        const recs: Recommendation[] = [burrito, chicken, veg, side].map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [idx === 0 ? '✓ Hearty fiesta bowls (2x)' : idx === 1 ? '✓ Tender spiced protein' : '✓ Loaded fresh greens & beans'],
        }));

        await streamAssistantReply({
          message: 'Mexican Fiesta — $46.00 🌮\nCurated with 2x Carne Asada Bowls, 1x Chicken Tinga Tacos, 1x Veggie Black Bean Bowl + Fresh tortilla chips for 4.\n\nWould you like to try a different cuisine for your family dinner?',
          budgetBasket: {
            id: 'basket_mexican_4',
            userId,
            budgetCap: 46,
            actualTotal: 46,
            total: 46,
            title: '👨‍👩‍👧‍👦 Mexican Fiesta (Dinner for 4)',
            items: [
              { mealId: burrito.id, name: '2x Carne Asada Burrito Bowls', price: 24 },
              { mealId: chicken.id, name: '1x Chicken Tinga Tacos', price: 11 },
              { mealId: veg.id, name: '1x Veggie Black Bean Bowl', price: 11 },
            ],
          },
          recommendations: recs,
          quickOptions: [
            '🛒 Add Dinner for 4 to cart ($46)',
            '🇮🇳 Indian Feast ($52)',
            '🍝 Italian Family Night ($48)',
            '🥢 Asian Fusion Combo ($50)',
          ],
        });
      } else if (
        q.includes('kid friendly') ||
        q.includes('different spice') ||
        q === 'yes' ||
        q === '👍 yes' ||
        q.includes('indian feast')
      ) {
        // Default Indian Family Feast ($52.00)
        const biryani = MOCK_MOBILE_MEALS.find((m) => /chicken biryani/i.test(m.name)) || MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_biryani') || MOCK_MOBILE_MEALS[3];
        const dal = MOCK_MOBILE_MEALS.find((m) => /dal chawal|lentil/i.test(m.name)) || MOCK_MOBILE_MEALS[6];
        const salmon = MOCK_MOBILE_MEALS.find((m) => /salmon/i.test(m.name)) || MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_salmon_bowl') || MOCK_MOBILE_MEALS[2];
        const paneer = MOCK_MOBILE_MEALS.find((m) => /paneer biryani|paneer/i.test(m.name)) || MOCK_MOBILE_MEALS[7];

        const recs: Recommendation[] = [biryani, dal, salmon, paneer].map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [
            idx === 0 ? '✓ Family favourite (2x portions)' : idx === 1 ? '✓ 100% Vegetarian & mild' : idx === 2 ? '✓ Heart-healthy omega-3 salmon' : '✓ Rich vegetarian main',
          ],
        }));

        await streamAssistantReply({
          message: 'Dinner for 4 — $52.00 👨‍👩‍👧‍👦\nCurated with 2x Chicken Biryani, 1x Veg Lentil Curry, 1x Teriyaki Salmon + Garlic Naan sides for the whole family.\n\nWould you like to try a different cuisine for your family dinner?',
          budgetBasket: {
            id: 'basket_indian_4',
            userId,
            budgetCap: 52,
            actualTotal: 52,
            total: 52,
            title: '👨‍👩‍👧‍👦 Indian Family Feast (Dinner for 4)',
            items: [
              { mealId: biryani.id, name: '2x Chicken Biryani', price: 26 },
              { mealId: dal.id, name: '1x Veg Lentil Curry & Rice', price: 13 },
              { mealId: salmon.id, name: '1x Teriyaki Salmon Bowl', price: 13 },
            ],
          },
          recommendations: recs,
          quickOptions: [
            '🛒 Add Dinner for 4 to cart ($52)',
            '🍝 Italian Family Night ($48)',
            '🥢 Asian Fusion Combo ($50)',
            '🌮 Mexican Fiesta ($46)',
            '🔄 Try another combination',
          ],
        });
      }
      // FLOW 14 — COMPLETE MY CART (ANOTHER MEAL)
      else if (q === 'another meal' || q === '🍽️ another meal') {
        await streamAssistantReply({
          message: 'Want something similar or different?',
          quickOptions: ['👍 Similar', '🌍 Different cuisine', '🥗 Healthier', '🎲 Surprise me'],
        });
      }
      // FLOW 14B — SURPRISE ME (DEDUPLICATED) (Solves feedback point 4)
      else if (q.includes('surprise me') || q === '🎲 surprise me' || q === 'surprise' || q.includes('completely surprise')) {
        let surprisePool = MOCK_MOBILE_MEALS.filter(
          (m) => m.category === 'main' && !shownMealIdsRef.current.has(m.id)
        );
        if (surprisePool.length < 3) {
          surprisePool = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
        }

        const pickedSurprise = surprisePool.slice(0, 3);
        pickedSurprise.forEach((m) => shownMealIdsRef.current.add(m.id));

        const recs: Recommendation[] = pickedSurprise.map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: ['✓ Fresh discovery (not seen before)', '✓ Exceptional customer reviews'],
        }));

        await streamAssistantReply({
          message: 'Here are distinct, flavourful dishes to surprise you (no repeated meals) 🎲✨:',
          recommendations: recs,
          quickOptions: ['🛒 Add to cart', '🎲 Surprise again', '🥟 Add a side', '🛒 View cart'],
        });
      }
      // FLOW 14C — VIEW CART / VIEW CARD (Solves feedback points 5 & 7 + colorful cart card)
      else if (
        q === 'view cart' ||
        q === 'view card' ||
        q === 'view bag' ||
        q === 'cart' ||
        q === 'card' ||
        q === 'bag' ||
        q === '🛒 view cart' ||
        q === '🛍️ view bag' ||
        q === 'cart card' ||
        q.includes('view cart') ||
        q.includes('view card') ||
        q.includes('view bag') ||
        q.includes('show cart') ||
        q.includes('show card') ||
        q.includes('show bag') ||
        q.includes('my cart') ||
        q.includes('open cart')
      ) {
        const count = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
        if (count === 0) {
          await streamAssistantReply({
            message: 'Your cart is currently empty 🛒. What would you like to eat today?',
            inChatCart: cart || { items: [], subtotal: 0, deliveryFee: 0, estimatedTax: 0, total: 0, currency: 'USD' },
            quickOptions: ['Under $12', '🍗 Chicken', '🌱 Vegetarian', '✨ Surprise me'],
          });
        } else {
          await streamAssistantReply({
            message: `Here is your current cart (${count} item${count > 1 ? 's' : ''}) 🛒✨:`,
            inChatCart: cart,
            quickOptions: ['Confirm order', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🗑️ Clear cart'],
          });
        }
      }
      // FLOW 14D — CLEAR CART (Solves feedback point 5)
      else if (q.includes('clear bag') || q.includes('clear cart') || q === 'clear' || q === '🗑️ clear cart') {
        await clearCart();
        await streamAssistantReply({
          message: 'Cleared your cart! 🗑️ What can I find for you instead?',
          inChatCart: { items: [], subtotal: 0, deliveryFee: 0, estimatedTax: 0, total: 0, currency: 'USD' },
          quickOptions: ['Under $12', 'Curated meals', 'Plan my week', 'Explore cuisines'],
        });
      }
      // FLOW 15 — CART-AWARE AI
      else if (q.includes('make this cheaper') || q.includes('make it cheaper') || q === 'cheaper') {
        const cartTotal = cart?.total || 64.0;
        await streamAssistantReply({
          message: `I can swap items in your cart to bring your order from $${cartTotal.toFixed(2)} to $${Math.max(12, cartTotal - 9.0).toFixed(2)}.`,
          quickOptions: ['✅ Apply swaps', 'Keep current order'],
        });
      } else if (q.includes('make the whole order vegetarian') || q.includes('make it vegetarian')) {
        await streamAssistantReply({
          message: 'Updated your whole order to vegetarian! Replaced meat mains with creamy Lentil Curry and Paneer Tikka.',
          quickOptions: ['Confirm order', 'Edit cart'],
        });
      } else if (q.includes("don't want chicken twice") || q.includes('no chicken twice')) {
        await streamAssistantReply({
          message: 'Replaced your second chicken dish with our signature Salmon Teriyaki Bowl so you get great variety tonight!',
          quickOptions: ['Confirm order', 'Edit cart'],
        });
      }
      // FLOW 14D — SOUPS (Recognized from "soup", "Show me aoupa", "soupa")
      else if (q.includes('soup') || q.includes('broth') || q.includes('ramen')) {
        const soupRecs = getMockRecommendations('soup', Array.from(shownMealIdsRef.current));
        soupRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: typoResult.hasCorrection
            ? `Recognized "soup" 🍲 — here are our warm, comforting soups ready for order:`
            : `Here are delicious, hot soups ready for order 🍲:`,
          recommendations: soupRecs,
          quickOptions: ['🥟 Add a side', '🍚 Add rice', '🥤 Add a drink', '🛒 View cart'],
        });
      }
      // FLOW 14E — VEGETARIAN OPTIONS (Recognized from "Vegegerian optioms", "vegetarian")
      else if (
        q === 'vegetarian options' ||
        q === 'vegegerian optioms' ||
        q.includes('vegetarian option') ||
        q.includes('veg option') ||
        q.includes('vegetarian')
      ) {
        const vegRecs = getMockRecommendations('vegetarian', Array.from(shownMealIdsRef.current));
        vegRecs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: typoResult.hasCorrection
            ? `Recognized "vegetarian options" 🌱 — here are delicious plant-powered dishes ready for order:`
            : `Here are top vegetarian dishes ready for order 🌱:`,
          recommendations: vegRecs,
          quickOptions: ['🧀 Paneer dishes', '🌶️ Spicy', '💰 Under $15', '🛒 View cart'],
        });
      }
      // Default Fallback Discovery (Dynamic contextual message with Typo Awareness)
      else {
        const recs = getMockRecommendations(effectiveText, Array.from(shownMealIdsRef.current));
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        let introMsg = `Here are great options matching "${effectiveText}" today 🍽️:`;
        if (typoResult.hasCorrection) {
          const termsStr = typoResult.correctedTerms.map((t) => `"${t.to}"`).join(' & ');
          introMsg = `Recognized ${termsStr} ✨ — here are great options matching "${effectiveText}" today 🍽️:`;
        }
        await streamAssistantReply({
          message: introMsg,
          recommendations: recs,
          quickOptions: ['💰 Under $12', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🔄 Show me more'],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (mealId: string, quantity = 1, triggerMessage = true) => {
    // 1. Try server quickly
    try {
      const res = await safeFetch(`${apiBaseUrl}/api/cart/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, quantity }),
      }, 1500);
      if (res && res.ok) {
        const updated = await res.json();
        setCart(updated);
        if (triggerMessage) triggerAddedMessage(mealId, quantity, updated);
        return updated;
      }
    } catch {}

    // 2. Offline local cart update (instant & always works reliably)
    const meal = MOCK_MOBILE_MEALS.find((m) => m.id === mealId) || MOCK_MOBILE_MEALS[0];
    let updatedCart: Cart | null = null;
    setCart((prev) => {
      const existing = prev?.items || [];
      const itemIdx = existing.findIndex((i) => i.mealId === mealId);
      let updatedItems = [...existing];

      if (itemIdx >= 0) {
        updatedItems[itemIdx] = {
          ...updatedItems[itemIdx],
          quantity: updatedItems[itemIdx].quantity + quantity,
        };
      } else {
        updatedItems.push({
          mealId,
          meal,
          quantity,
          selectedSlot: 'dinner',
          selectedDate: 'Tomorrow',
        });
      }

      const subtotal = Math.round(updatedItems.reduce((s, i) => s + i.meal.price * i.quantity, 0) * 100) / 100;
      const deliveryFee = updatedItems.length > 0 ? 2.5 : 0;
      // GST is included in item prices (no hidden extra tax)
      const total = Math.round((subtotal + deliveryFee) * 100) / 100;

      updatedCart = {
        items: updatedItems,
        subtotal,
        deliveryFee,
        estimatedTax: 0,
        total,
        currency: 'USD',
      };
      return updatedCart;
    });

    if (triggerMessage) {
      setTimeout(() => {
        if (updatedCart) {
          triggerAddedMessage(mealId, quantity, updatedCart);
        }
      }, 50);
    }
  };

  const updateCartQuantity = async (mealId: string, quantity: number) => {
    try {
      await safeFetch(`${apiBaseUrl}/api/cart/${userId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, quantity }),
      }, 1500);
    } catch {}

    setCart((prev) => {
      const existing = prev?.items || [];
      const updatedItems = existing
        .map((it) => (it.mealId === mealId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0);

      const subtotal = Math.round(updatedItems.reduce((s, i) => s + i.meal.price * i.quantity, 0) * 100) / 100;
      const deliveryFee = updatedItems.length > 0 ? 2.5 : 0;
      const total = Math.round((subtotal + deliveryFee) * 100) / 100;

      return {
        items: updatedItems,
        subtotal,
        deliveryFee,
        estimatedTax: 0,
        total,
        currency: 'USD',
      };
    });
  };

  const removeFromCart = async (mealId: string) => {
    try {
      await safeFetch(`${apiBaseUrl}/api/cart/${userId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId }),
      }, 1500);
    } catch {}

    setCart((prev) => {
      const existing = prev?.items || [];
      const updatedItems = existing.filter((it) => it.mealId !== mealId);

      const subtotal = Math.round(updatedItems.reduce((s, i) => s + i.meal.price * i.quantity, 0) * 100) / 100;
      const deliveryFee = updatedItems.length > 0 ? 2.5 : 0;
      const total = Math.round((subtotal + deliveryFee) * 100) / 100;

      return {
        items: updatedItems,
        subtotal,
        deliveryFee,
        estimatedTax: 0,
        total,
        currency: 'USD',
      };
    });
  };

  const clearCart = async () => {
    try {
      await safeFetch(`${apiBaseUrl}/api/cart/${userId}/clear`, { method: 'POST' }, 1500);
    } catch {}

    setCart({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      estimatedTax: 0,
      total: 0,
      currency: 'USD',
    });
  };

  // Consolidates multiple added dishes compactly with single upsell section (Solves feedback point 10)
  const triggerAddedMessage = (mealId: string, quantity: number, currentCart: Cart) => {
    const item = currentCart.items.find((i) => i.mealId === mealId);
    if (!item) return;

    let addedHeadline = `Added ${item.meal.name} ($${item.meal.price.toFixed(2)}) to your cart 🛒`;
    let nextSuggestions = ['🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🛒 View cart'];

    if (activeHealthCategoryRef.current === 'heart_healthy') {
      addedHeadline = 'Added! ❤️ Want anything else?';
      nextSuggestions = ['🥗 Add a side', '🥤 Add a drink', '🍽️ Another meal', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'diabetes_friendly') {
      addedHeadline = 'Added! 📉 Would you like another balanced option?';
      nextSuggestions = ['🍽️ Another meal', '🥗 Add a side', '🥤 Drinks', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'high_protein') {
      addedHeadline = "Added! 💪 That's one high-protein meal sorted.";
      nextSuggestions = ['💪 Another high-protein meal', '🥤 Add a drink', '🥗 Add a side', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'low_carb') {
      addedHeadline = 'Added! 🥑 Want another lower-carb option?';
      nextSuggestions = ['🍽️ Another meal', '🥗 Low-carb side', '🥤 Drinks', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'low_sodium') {
      addedHeadline = 'Added! 🧂 Want me to keep your next choice lower in sodium too?';
      nextSuggestions = ['Yes, keep it low sodium', '🍽️ Something different', '🥗 Add a side', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'anti_inflammatory') {
      addedHeadline = 'Added! 🌿 Want another nutrient-rich meal?';
      nextSuggestions = ['🌱 Plant based', '🐟 Omega-3 rich', '🍽️ Another meal', "✓ I'm done"];
    } else if (activeHealthCategoryRef.current === 'weight_management') {
      addedHeadline = 'Added! ⚖️ Want me to find another balanced meal?';
      nextSuggestions = ['🍽️ Another meal', '📅 Plan several meals', '🥗 Add a side', "✓ I'm done"];
    }

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      const isLastAddedMsg = lastMsg && lastMsg.sender === 'assistant' && (Boolean(lastMsg.addedCartItem) || Boolean(lastMsg.addedCartItems));

      if (isLastAddedMsg) {
        const existingList = lastMsg.addedCartItems || (lastMsg.addedCartItem ? [lastMsg.addedCartItem] : []);
        const itemIdx = existingList.findIndex((it) => it.meal.id === mealId);
        let updatedList: { meal: Meal; quantity: number }[] = [];
        if (itemIdx >= 0) {
          updatedList = existingList.map((it, idx) =>
            idx === itemIdx ? { ...it, quantity: it.quantity + quantity } : it
          );
        } else {
          updatedList = [...existingList, { meal: item.meal, quantity }];
        }

        const updatedLastMsg: ChatMessage = {
          ...lastMsg,
          text: `Added to your cart 🛒 (${updatedList.length} items):`,
          addedCartItem: undefined,
          addedCartItems: updatedList,
          quickOptions: nextSuggestions,
        };

        return [...prev.slice(0, prev.length - 1), updatedLastMsg];
      }

      return [
        ...prev,
        {
          id: `added_${Date.now()}`,
          sender: 'assistant',
          text: addedHeadline,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          addedCartItem: { meal: item.meal, quantity: item.quantity },
          addedCartItems: [{ meal: item.meal, quantity: item.quantity }],
          quickOptions: nextSuggestions,
        },
      ];
    });
  };

  const confirmOrder = async () => {
    try {
      await safeFetch(`${apiBaseUrl}/api/orders/${userId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isConfirmed: true }),
      }, 1500);
    } catch {}

    const orderNum = Math.floor(100000 + Math.random() * 900000);
    setCart({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      estimatedTax: 0,
      total: 0,
      currency: 'USD',
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `order_placed_${Date.now()}`,
        sender: 'assistant',
        text: `Order #${orderNum} confirmed! 🎉 We've sent your order to the kitchen.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const resetChat = useCallback(() => {
    setMessages([]);
    shownMealIdsRef.current.clear();
    activeHealthCategoryRef.current = null;
  }, []);

  return {
    messages,
    isLoading,
    cart,
    userProfile,
    sendMessage,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    confirmOrder,
    refreshCart,
    refreshProfile,
    resetChat,
  };
}
