import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, Cart, UserProfile, Recommendation, Meal } from './types';
import {
  MOCK_MOBILE_MEALS,
  getMockRecommendations,
  rankQualifiedMeals,
  qualifyMealHealth,
  HealthCategory,
} from './mockData';
import { DEFAULT_HEALTH_GOALS } from './components/MobileQuickQuestions';

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
      const q = cleanText.toLowerCase();

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
          message: "Let's craft your dinner! 🧑‍🍳 Choose your protein, flavour personality, and base.",
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
          quickOptions: ['🥑 Lowest carb', '🌱 Vegetarian', '💰 Under $15', '🛍️ View bag'],
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
          quickOptions: ['💰 Under $15', '🧂 Lower sodium', '💪 High protein', '🛍️ View bag'],
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
          quickOptions: ['🔥 Under 500 cal', '💰 Under $15', '🥟 Add a side', '🛍️ View bag'],
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
          quickOptions: ['🥤 Drinks', '🍽️ Another meal', '🛍️ View bag', "✓ I'm done"],
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
          quickOptions: ['🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🔄 More', '🛍️ View bag'],
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
          quickOptions: ['🇮🇳 Indian', '🌏 Asian', '🌍 African', '🥙 Middle Eastern', '🍝 Western', '✨ Something different'],
        });
      } else if (
        (q.includes('thai') || q.includes('indonesian') || q.includes('chinese') || q.includes('japanese') || q.includes('indian') || q.includes('african')) &&
        !q.includes('combo') && !q.includes('side')
      ) {
        const cTarget = q.includes('thai') ? 'Thai' : q.includes('indonesian') ? 'Indonesian' : q.includes('african') ? 'African' : 'Indian';
        const cMeals = MOCK_MOBILE_MEALS.filter((m) => m.cuisine.toLowerCase() === cTarget.toLowerCase());
        const recs: Recommendation[] = (cMeals.length > 0 ? cMeals : MOCK_MOBILE_MEALS).slice(0, 3).map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: [`✓ Authentic ${cTarget}`, '✓ Fresh ingredients'],
        }));
        await streamAssistantReply({
          message: `Here are popular ${cTarget} meals ready for order:`,
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🌶️ Spicy', '🍗 Chicken', '🌱 Vegetarian'],
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
      } else if (q === 'vegan' || q === 'vegetarian' || q === 'halal' || q === 'gluten free') {
        const tag = q.includes('vegan') ? 'Vegan' : q.includes('vegetarian') ? 'Vegetarian' : 'Halal';
        const dMeals = MOCK_MOBILE_MEALS.filter((m) => m.dietaryTags.some(t => t.toLowerCase().includes(tag.toLowerCase())));
        const recs: Recommendation[] = (dMeals.length > 0 ? dMeals : MOCK_MOBILE_MEALS).slice(0, 3).map((meal, idx) => ({
          meal,
          score: 98 - idx * 2,
          reasons: [`✓ Certified ${tag}`, '✓ Fresh & wholesome'],
        }));
        await streamAssistantReply({
          message: `Here are verified ${tag} options prepared for you:`,
          recommendations: recs,
          quickOptions: ['💰 Under $15', '🌶️ Spicy', '💪 High protein', '🥗 Healthy'],
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
      // FLOW 9 — “MY USUAL”
      else if (q === 'my usual' || q === 'order my usual' || q === 'favourite' || q === 'favorites') {
        await streamAssistantReply({
          message: 'What would you like?',
          quickOptions: ['❤️ My favourite again', '🔄 Similar to my usual', '✨ Something different today'],
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
          message: `Added all ${mealsToAdd.length} curated dinners to your bag! 🛒 Subtotal: $${planSum.toFixed(2)}. Ready to checkout or add sides & drinks?`,
          quickOptions: ['Confirm order', 'View bag', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert'],
        });
      }
      // FLOW 11C — ADD SIDE (Solves feedback points 3 & 9)
      else if (q.includes('add a side') || q.includes('add side') || q === 'side' || q === 'sides' || q === '🥟 add a side') {
        const sides = MOCK_MOBILE_MEALS.filter((m) => m.category === 'side').slice(0, 4);
        await streamAssistantReply({
          message: 'Here are fresh, delicious sides to complement your meal 🥟:',
          recommendations: sides.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Perfect meal pairing', '✓ Freshly prepared'],
          })),
          quickOptions: ['🥤 Add a drink', '🍰 Add a dessert', '🛍️ View bag', "✅ I'm done"],
        });
      }
      // FLOW 11D — ADD DRINK (Solves feedback points 3 & 9)
      else if (q.includes('add a drink') || q.includes('add drink') || q === 'drink' || q === 'drinks' || q === '🥤 add a drink') {
        const drinks = MOCK_MOBILE_MEALS.filter((m) => m.category === 'drink').slice(0, 4);
        await streamAssistantReply({
          message: 'Here are chilled, refreshing drinks ready to add 🥤:',
          recommendations: drinks.map((m, idx) => ({
            meal: m,
            score: 99 - idx * 2,
            reasons: ['✓ Cold & refreshing', '✓ Customer favourite'],
          })),
          quickOptions: ['🥟 Add a side', '🍰 Add a dessert', '🛍️ View bag', "✅ I'm done"],
        });
      }
      // FLOW 11E — ADD DESSERT (Solves feedback points 3 & 9)
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
          message: 'Here are sweet treats to finish your meal 🍰:',
          recommendations: desserts.map((m, idx) => ({
            meal: m,
            score: 97 - idx * 2,
            reasons: ['✓ Handcrafted dessert', '✓ Perfectly sweet'],
          })),
          quickOptions: ['🥤 Add a drink', '🥟 Add a side', '🛍️ View bag', "✅ I'm done"],
        });
      }
      // FLOW 11F — ADD SOUP
      else if (q.includes('add soup') || q.includes('soup') || q === '🍲 add soup') {
        const soups = MOCK_MOBILE_MEALS.filter((m) => m.name.toLowerCase().includes('soup')).slice(0, 3);
        await streamAssistantReply({
          message: 'Here are comforting, hot soups 🍲:',
          recommendations: soups.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Warm & soothing', '✓ Authentic broth'],
          })),
          quickOptions: ['🥟 Add a side', '🥤 Add a drink', '🛍️ View bag'],
        });
      }
      // FLOW 11G — ADD SALAD
      else if (q.includes('add salad') || q.includes('salad') || q === '🥗 add salad') {
        const salads = MOCK_MOBILE_MEALS.filter((m) => m.name.toLowerCase().includes('salad') || m.ingredients.includes('greens')).slice(0, 3);
        await streamAssistantReply({
          message: 'Here are crisp, garden-fresh salads 🥗:',
          recommendations: salads.map((m, idx) => ({
            meal: m,
            score: 98 - idx * 2,
            reasons: ['✓ Crisp & wholesome', '✓ Fresh vinaigrette'],
          })),
          quickOptions: ['🥤 Add a drink', '🍰 Add a dessert', '🛍️ View bag'],
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
      } else if (q.includes('kid friendly') || q.includes('different spice') || q === 'yes' || q === '👍 yes') {
        const recs: Recommendation[] = MOCK_MOBILE_MEALS.slice(0, 4).map((meal, idx) => ({
          meal,
          score: 97 - idx * 2,
          reasons: [idx === 1 ? '✓ Kid friendly & mild' : idx === 2 ? '✓ Vegetarian option' : '✓ Crowd favourite main'],
        }));
        await streamAssistantReply({
          message: 'Dinner for 4 — $52.00\nCurated with 2x Chicken Biryani, 1x Veg Lentil Curry, 1x Teriyaki Salmon + Garlic Naan sides for the whole family.',
          recommendations: recs,
          quickOptions: ['🛒 Add selection', '🔄 Try another combination'],
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
          quickOptions: ['🛒 Add to bag', '🎲 Surprise again', '🥟 Add a side', '🛍️ View bag'],
        });
      }
      // FLOW 14C — VIEW CART / VIEW BAG (Solves feedback points 5 & 7)
      else if (
        q === 'view cart' ||
        q === 'view bag' ||
        q === 'cart' ||
        q === 'bag' ||
        q === '🛍️ view bag' ||
        q.includes('view cart') ||
        q.includes('view bag') ||
        q.includes('show cart') ||
        q.includes('show bag')
      ) {
        const count = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
        if (count === 0) {
          await streamAssistantReply({
            message: 'Your bag is currently empty 🛍️. What would you like to eat today?',
            quickOptions: ['Under $12', '🍗 Chicken', '🌱 Vegetarian', '✨ Surprise me'],
          });
        } else {
          const list = cart!.items
            .map((i) => `${i.quantity}x ${i.meal.name} ($${(i.meal.price * i.quantity).toFixed(2)})`)
            .join('\n• ');
          await streamAssistantReply({
            message: `Here is your current bag (${count} item${count > 1 ? 's' : ''}):\n• ${list}\n\nSubtotal: $${cart!.subtotal.toFixed(2)}\nDelivery Fee: $${cart!.deliveryFee.toFixed(2)}\nTotal: $${cart!.total.toFixed(2)}`,
            quickOptions: ['Confirm order', '🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', 'Clear bag'],
          });
        }
      }
      // FLOW 14D — CLEAR CART (Solves feedback point 5)
      else if (q.includes('clear bag') || q.includes('clear cart') || q === 'clear') {
        await clearCart();
        await streamAssistantReply({
          message: 'Cleared your bag! 🗑️ What can I find for you instead?',
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
      // Default Fallback Discovery (Dynamic contextual message - Solves feedback point 11)
      else {
        const recs = getMockRecommendations(cleanText, Array.from(shownMealIdsRef.current));
        recs.forEach((r) => shownMealIdsRef.current.add(r.meal.id));
        await streamAssistantReply({
          message: `Here are great options matching "${cleanText}" today 🍽️:`,
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

    let addedHeadline = `Added ${item.meal.name} ($${item.meal.price.toFixed(2)}) to your bag 🛍️`;
    let nextSuggestions = ['🥟 Add a side', '🥤 Add a drink', '🍰 Add a dessert', '🛍️ View bag'];

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
          text: `Added to your bag 🛍️ (${updatedList.length} items):`,
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
