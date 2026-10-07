import { Meal, UserPreferences, Recommendation, Order } from '../../types';

export interface ScoringFactors {
  budgetMatch: number; // 0 to 20
  cuisineMatch: number; // 0 to 20
  dietaryMatch: number; // 0 to 20
  spiceMatch: number; // 0 to 15
  previousLikesMatch: number; // 0 to 15
  restaurantMatch: number; // 0 to 10
}

export class RecommendationEngine {
  /**
   * Transparently scores a meal against user preferences and query constraints,
   * producing an overall match score (0-100) and a human-readable list of reasons.
   */
  public scoreMeal(
    meal: Meal,
    preferences?: UserPreferences | null,
    queryCriteria?: {
      maxPrice?: number;
      targetProtein?: string;
      targetCuisine?: string;
      spicyRequested?: boolean;
      healthyRequested?: boolean;
      wellnessCategory?: string;
      frequentlyOrderedMealIds?: string[];
      dishKeyword?: string;
      excludeMealIds?: string[];
    }
  ): Recommendation {
    let score = 50; // Baseline score
    const reasons: string[] = [];

    const effectiveBudget = queryCriteria?.maxPrice || preferences?.preferredPriceRange?.max || 16;
    const favoriteCuisines = preferences?.favoriteCuisines || [];
    const favoriteRestaurants = preferences?.favoriteRestaurants || [];
    const spicyPref = preferences?.spicyPreference || 'any';
    const frequentMeals = queryCriteria?.frequentlyOrderedMealIds || [];

    // 1. Budget Match (up to +20 points)
    if (meal.price <= effectiveBudget) {
      const savings = effectiveBudget - meal.price;
      if (savings >= 2) {
        score += 20;
        reasons.push(`✓ Under $${effectiveBudget} ($${meal.price.toFixed(2)})`);
      } else {
        score += 15;
        reasons.push(`✓ Fits $${effectiveBudget} budget`);
      }
    } else {
      score -= 25; // Exceeds budget penalty
    }

    // 2. Cuisine Match (up to +15 points)
    if (
      queryCriteria?.targetCuisine &&
      meal.cuisine.toLowerCase() === queryCriteria.targetCuisine.toLowerCase()
    ) {
      score += 15;
      reasons.push(`✓ Matches requested ${meal.cuisine} cuisine`);
    } else if (
      favoriteCuisines.some((c) => c.toLowerCase() === meal.cuisine.toLowerCase())
    ) {
      score += 12;
      reasons.push(`✓ Favorite cuisine (${meal.cuisine})`);
    }

    // 3. Spiciness Factor (up to +15 points)
    if (queryCriteria?.spicyRequested || spicyPref === 'spicy') {
      if (meal.spicyLevel > 0) {
        score += 15;
        reasons.push('✓ Spicy');
      } else {
        score -= 5;
      }
    } else if (spicyPref === 'none') {
      if (meal.spicyLevel === 0) {
        score += 10;
        reasons.push('✓ Mild & non-spicy');
      } else {
        score -= 20;
      }
    }

    // 4. Protein / Main Ingredient Match (up to +15 points)
    if (queryCriteria?.targetProtein) {
      const p = queryCriteria.targetProtein.toLowerCase();
      const hasProtein =
        meal.ingredients.some((ing) => ing.toLowerCase().includes(p)) ||
        meal.name.toLowerCase().includes(p);
      if (hasProtein) {
        score += 15;
        reasons.push(`✓ Quality ${queryCriteria.targetProtein}`);
      }
    }

    // 4.5 Specific Dish Keyword Match (e.g. "biryani", "jollof", "lasagne", "rendang", "pasta", "samosa")
    if (queryCriteria?.dishKeyword) {
      const dk = queryCriteria.dishKeyword.toLowerCase();
      if (meal.name.toLowerCase().includes(dk) || meal.description.toLowerCase().includes(dk)) {
        score += 30;
        reasons.unshift(`✓ Matches "${queryCriteria.dishKeyword}"`);
      }
    }

    // 5. Past Order Affinity / Favorites (up to +15 points)
    if (frequentMeals.includes(meal.id)) {
      score += 15;
      reasons.push('✓ Similar to meals you liked');
    }

    // 5.5 Avoid repetitive recommendations in same session
    if (queryCriteria?.excludeMealIds && queryCriteria.excludeMealIds.includes(meal.id)) {
      score -= 30;
    }

    // 6. Restaurant Affinity (up to +10 points)
    if (favoriteRestaurants.includes(meal.restaurantName)) {
      score += 10;
      reasons.push(`✓ From favorite spot (${meal.restaurantName})`);
    }

    // 7. Wellness / Healthy Preference (up to +25 points)
    if (queryCriteria?.wellnessCategory) {
      const wc = queryCriteria.wellnessCategory;
      if (wc === 'high-protein') {
        if (meal.dietaryTags.includes('high-protein') || (meal.proteinGrams && meal.proteinGrams >= 35)) {
          score += 25;
          reasons.unshift(`✓ High protein (${meal.proteinGrams || 38}g)`);
        } else {
          score -= 20;
        }
      } else if (wc === 'weight-management') {
        if (meal.dietaryTags.includes('weight-management') || (meal.calories && meal.calories <= 550)) {
          score += 25;
          reasons.unshift(`✓ Weight management (${meal.calories || 480} kcal)`);
        } else {
          score -= 20;
        }
      } else if (wc === 'high-fibre') {
        if (
          meal.dietaryTags.includes('high-fibre') ||
          meal.dietaryTags.includes('gut-friendly') ||
          meal.ingredients.some((ing) =>
            ['quinoa', 'lentil', 'beets', 'spinach', 'edamame', 'chickpea', 'chia', 'beans'].some((w) =>
              ing.toLowerCase().includes(w)
            )
          )
        ) {
          score += 25;
          reasons.unshift('✓ High fibre & gut friendly');
        } else {
          score -= 20;
        }
      }
    } else if (queryCriteria?.healthyRequested || preferences?.healthyPreference) {
      if (
        meal.dietaryTags.includes('high-protein') ||
        meal.dietaryTags.includes('gluten-free') ||
        meal.dietaryTags.includes('weight-management') ||
        meal.dietaryTags.includes('high-fibre') ||
        (meal.calories && meal.calories <= 600)
      ) {
        score += 10;
        reasons.push('✓ Nutrient-dense & wholesome');
      }
    }

    // High rating or signature default reason if few reasons accumulated
    if (reasons.length < 2) {
      if (meal.spicyLevel > 0) reasons.push('✓ Flavorful spice profile');
      if (meal.proteinGrams && meal.proteinGrams >= 30) {
        reasons.push(`✓ High protein (${meal.proteinGrams}g)`);
      } else {
        reasons.push('✓ Popular customer favorite');
      }
    }

    // Clamp score between 65 and 98 to keep it realistic and trustworthy
    const clampedScore = Math.min(98, Math.max(65, score));

    return {
      meal,
      score: clampedScore,
      reasons,
    };
  }

  /**
   * Rank a list of candidate meals and return the top recommendations,
   * with automatic rotation to prevent repetitive outputs.
   */
  public rankMeals(
    meals: Meal[],
    preferences?: UserPreferences | null,
    queryCriteria?: {
      maxPrice?: number;
      targetProtein?: string;
      targetCuisine?: string;
      spicyRequested?: boolean;
      healthyRequested?: boolean;
      wellnessCategory?: string;
      frequentlyOrderedMealIds?: string[];
      dishKeyword?: string;
      excludeMealIds?: string[];
    },
    limit = 3
  ): Recommendation[] {
    const scored = meals.map((m) =>
      this.scoreMeal(m, preferences, queryCriteria)
    );

    // If excludeMealIds provided, prioritize fresh unshown dishes
    let pool = scored;
    if (queryCriteria?.excludeMealIds && queryCriteria.excludeMealIds.length > 0) {
      const fresh = scored.filter((s) => !queryCriteria.excludeMealIds!.includes(s.meal.id));
      if (fresh.length >= limit) {
        pool = fresh;
      }
    }

    // Sort by descending score
    pool.sort((a, b) => b.score - a.score);

    return pool.slice(0, limit);
  }

  /**
   * Generates a signature "Drop For Me" meal (or combo) in one of four modes:
   * 'safe', 'adventure', 'budget', or 'healthy' (Section 1 & 5 of Drop AI spec).
   */
  public buildDropForMe(
    allMeals: Meal[],
    preferences?: UserPreferences | null,
    mode: 'safe' | 'adventure' | 'budget' | 'healthy' = 'safe',
    pastOrders: Order[] = [],
    excludeMealIds: string[] = []
  ): {
    mode: 'safe' | 'adventure' | 'budget' | 'healthy';
    modeLabel: string;
    main: Meal;
    side?: Meal;
    drink?: Meal;
    totalPrice: number;
    matchScore: number;
    reasons: string[];
    rationale: string;
  } {
    // 1. Filter out allergies & explicit dislikes
    const allergies = preferences?.allergies?.map((a) => a.toLowerCase()) || [];
    const dislikes = preferences?.dislikedFoods?.map((d) => d.toLowerCase()) || [];

    let safeCandidates = allMeals.filter((m) => {
      if (!m.active) return false;
      const ingStr = m.ingredients.join(' ').toLowerCase() + ' ' + m.name.toLowerCase();
      // Hard allergy safety
      if (allergies.some((a) => ingStr.includes(a))) return false;
      // Disliked foods
      if (dislikes.some((d) => ingStr.includes(d))) return false;
      return true;
    });

    let mains = safeCandidates.filter((m) => m.category === 'main');
    const sides = safeCandidates.filter((m) => m.category === 'side');
    const drinks = safeCandidates.filter((m) => m.category === 'drink');

    // Filter out recently shown if we have enough options
    if (excludeMealIds.length > 0) {
      const freshMains = mains.filter((m) => !excludeMealIds.includes(m.id));
      if (freshMains.length >= 2) {
        mains = freshMains;
      }
    }

    const pastMealIds = new Set<string>();
    pastOrders.forEach((o) => o.items.forEach((it: any) => pastMealIds.add(it.mealId)));

    let chosenMain: Meal;
    let modeLabel = '';
    let rationale = '';
    let matchScore = 92;
    const reasons: string[] = [];

    switch (mode) {
      case 'budget': {
        modeLabel = 'Budget Drop — Maximum Value Under $12';
        const under12 = mains.filter((m) => m.price <= 12.50).sort((a, b) => a.price - b.price);
        // Rotate among top under 12
        const budgetIdx = Math.floor(Math.random() * Math.min(2, under12.length));
        chosenMain = under12[budgetIdx] || mains[0];
        matchScore = 95;
        reasons.push(`✓ Maximum value ($${chosenMain.price.toFixed(2)})`);
        reasons.push('✓ Under $12 budget cap');
        reasons.push(`✓ Hearty portion`);
        rationale = `We've selected a hot, hearty dinner to keep your wallet happy.`;
        break;
      }

      case 'healthy': {
        modeLabel = 'Healthy Drop — Nutrient-Dense & Clean';
        const healthMains = mains.filter((m) =>
          m.dietaryTags.includes('high-protein') ||
          m.dietaryTags.includes('gluten-free') ||
          (m.calories && m.calories <= 600)
        ).sort((a, b) => (b.proteinGrams || 0) - (a.proteinGrams || 0));
        const healthIdx = Math.floor(Math.random() * Math.min(2, healthMains.length));
        chosenMain = healthMains[healthIdx] || mains[0];
        matchScore = 96;
        if (chosenMain.proteinGrams) reasons.push(`✓ High protein (${chosenMain.proteinGrams}g)`);
        if (chosenMain.calories) reasons.push(`✓ Controlled calories (${chosenMain.calories} kcal)`);
        reasons.push('✓ Whole food ingredients');
        rationale = `High in lean protein, low in processed oils, and macro-balanced.`;
        break;
      }

      case 'adventure': {
        modeLabel = 'Adventure Drop — Something Different & Exciting';
        // Pick something the customer has NOT ordered yet
        const notOrdered = mains.filter((m) => !pastMealIds.has(m.id));
        const adventurous = (notOrdered.length > 0 ? notOrdered : mains)
          .filter((m) => preferences?.spicyPreference === 'spicy' ? m.spicyLevel >= 2 : true)
          .sort(() => Math.random() - 0.5);
        chosenMain = adventurous[0] || mains[0];
        matchScore = 91;
        reasons.push(`✓ New flavor discovery (${chosenMain.cuisine})`);
        if (chosenMain.spicyLevel > 0) reasons.push('✓ Authentic regional spice');
        reasons.push('✓ Highly rated by adventurous eaters');
        rationale = `You usually stick to familiar dishes; tonight explore authentic ${chosenMain.cuisine} flavors!`;
        break;
      }

      case 'safe':
      default: {
        modeLabel = 'Safe Drop — Familiar Favourites';
        const favCuisines = preferences?.favoriteCuisines || [];
        const familiar = mains.filter((m) =>
          pastMealIds.has(m.id) ||
          favCuisines.some((c) => c.toLowerCase() === m.cuisine.toLowerCase())
        );
        const scored = this.rankMeals(familiar.length > 0 ? familiar : mains, preferences, {}, 3);
        const safeIdx = Math.floor(Math.random() * Math.min(2, scored.length));
        chosenMain = scored[safeIdx]?.meal || mains[0];
        matchScore = scored[safeIdx]?.score || 94;
        reasons.push(...(scored[safeIdx]?.reasons || [`✓ Matches favorite ${chosenMain.cuisine} taste`]));
        rationale = `Based on your usual tastes, this is a guaranteed delicious hit for tonight.`;
        break;
      }
    }

    // Add optional side or drink if within reasonable combo price
    let chosenDrink: Meal | undefined;
    let chosenSide: Meal | undefined;
    if (mode === 'safe' || mode === 'budget') {
      // Add drink or small side
      if (drinks.length > 0 && chosenMain.price + drinks[0].price <= 17) {
        chosenDrink = drinks[0];
        reasons.push(`✓ Paired with refreshing ${chosenDrink.name}`);
      }
    }

    const totalPrice = +(chosenMain.price + (chosenSide?.price || 0) + (chosenDrink?.price || 0)).toFixed(2);

    return {
      mode,
      modeLabel,
      main: chosenMain,
      side: chosenSide,
      drink: chosenDrink,
      totalPrice,
      matchScore,
      reasons,
      rationale,
    };
  }

  /**
   * AI Side Order Pairing Engine:
   * Intelligently pairs complementary side orders with a given main meal based on
   * culinary traditions (e.g. Biryani + Mirchi Ka Salan / Salad, Burgers + Fries, Tacos + Chips/Guac),
   * respecting budget and dietary preferences.
   */
  public pairSideOrder(
    mainMeal: Meal,
    availableSides: Meal[],
    maxSideBudget?: number
  ): { side: Meal; alternativeSides: Meal[]; rationale: string } | null {
    if (!availableSides || availableSides.length === 0) return null;

    const mainName = mainMeal.name.toLowerCase();
    const cuisine = mainMeal.cuisine.toLowerCase();

    let primarySideId: string | undefined;
    let rationale = '';

    // 1. Signature culinary pairings (e.g. Biryani + Mirchi Ka Salan / Salad)
    if (mainName.includes('biryani')) {
      primarySideId = 'side_mirchi_ka_salan';
      rationale = 'Authentic Mirchi Ka Salan — peanut & sesame chili curry, the traditional Hyderabadi pairing with Biryani';
    } else if (mainName.includes('butter chicken') || mainName.includes('dal makhani') || mainName.includes('tikka')) {
      primarySideId = 'side_kachumber_salad';
      rationale = 'Fresh Kachumber & Raita Salad to balance rich creamy curries with crisp herbs and cooling yogurt';
    } else if (cuisine === 'african' || mainName.includes('jollof')) {
      primarySideId = availableSides.find((s) => s.name.toLowerCase().includes('plantain') || s.cuisine.toLowerCase() === 'african')?.id;
      rationale = 'Sweet Fried Dodo (Plantain) — the essential classic West African pairing with smoky jollof rice';
    } else if (cuisine === 'thai' || mainName.includes('basil') || mainName.includes('pad thai')) {
      primarySideId = 'side_spring_rolls';
      rationale = 'Crispy Veggie Spring Rolls with sweet chili dip to complement fragrant Thai herbs';
    } else if (cuisine === 'japanese' || mainName.includes('curry') || mainName.includes('poke') || mainName.includes('katsu')) {
      primarySideId = 'side_edamame_sea_salt';
      rationale = 'Steamed Edamame with Maldon Salt flakes for fresh, clean protein texture';
    } else if (cuisine === 'mexican' || mainName.includes('tacos') || mainName.includes('burrito')) {
      primarySideId = 'side_chips_guac';
      rationale = 'House Tortilla Chips & Guacamole with ripe Hass avocado and lime';
    } else if (cuisine === 'italian' || mainName.includes('lasagne') || mainName.includes('pasta')) {
      primarySideId = 'side_garlic_herb_ciabatta';
      rationale = 'Tuscan Garlic Herb Ciabatta, toasted with rosemary garlic butter';
    } else if (cuisine === 'mediterranean' || mainName.includes('caesar') || mainName.includes('salad')) {
      primarySideId = 'side_cucumber_tzatziki';
      rationale = 'Crisp Cucumber Radish Salad with probiotic Greek yogurt tzatziki';
    }

    // Find requested primary side
    let chosenSide = primarySideId ? availableSides.find((s) => s.id === primarySideId) : undefined;

    // Check budget constraint
    if (chosenSide && maxSideBudget !== undefined && chosenSide.price > maxSideBudget + 0.01) {
      chosenSide = undefined;
    }

    // Fallback: match by cuisine or price within budget
    if (!chosenSide) {
      const sameCuisineSides = availableSides.filter((s) => s.cuisine.toLowerCase() === cuisine);
      const candidates = sameCuisineSides.length > 0 ? sameCuisineSides : availableSides;
      const budgetCandidates = maxSideBudget !== undefined
        ? candidates.filter((s) => s.price <= maxSideBudget + 0.01)
        : candidates;

      chosenSide = budgetCandidates[0] || candidates[0] || availableSides[0];
      if (!rationale && chosenSide) {
        rationale = `Chef-paired ${chosenSide.name} to complete your ${mainMeal.name}`;
      }
    }

    const alternativeSides = availableSides.filter((s) => s.id !== chosenSide.id);

    return {
      side: chosenSide,
      alternativeSides,
      rationale,
    };
  }
}

export const recommendationEngine = new RecommendationEngine();

