import { Meal, UserPreferences, Order, Cart } from '../../types';

export class SafetyValidator {
  /**
   * Strictly filters meals based on explicit medical allergies and dislikes.
   * Enforces the rule: NEVER infer medical allergies; only filter on explicitly declared values.
   */
  public filterSafeMeals(
    meals: Meal[],
    preferences?: UserPreferences | null,
    extraExclusions?: string[]
  ): Meal[] {
    const explicitAllergies = preferences?.allergies || [];
    const explicitDislikes = preferences?.dislikedFoods || [];
    const combinedExclusions = [
      ...explicitAllergies.map((a) => a.toLowerCase().trim()),
      ...explicitDislikes.map((d) => d.toLowerCase().trim()),
      ...(extraExclusions || []).map((e) => e.toLowerCase().trim()),
    ].filter(Boolean);

    const isVegetarianUser = preferences?.dietaryPreferences?.some(
      (dp) => dp.toLowerCase() === 'vegetarian'
    );
    const isVeganUser = preferences?.dietaryPreferences?.some(
      (dp) => dp.toLowerCase() === 'vegan'
    );

    return meals.filter((meal) => {
      // Vegetarian check
      if (isVegetarianUser) {
        const isVeg = meal.dietaryTags.some(
          (t) => t.toLowerCase() === 'vegetarian' || t.toLowerCase() === 'vegan'
        );
        if (!isVeg) return false;
      }

      // Vegan check
      if (isVeganUser) {
        const isVegan = meal.dietaryTags.some((t) => t.toLowerCase() === 'vegan');
        if (!isVegan) return false;
      }

      if (combinedExclusions.length === 0) return true;

      // Check ingredients
      const hasExcludedIngredient = meal.ingredients.some((ing) =>
        combinedExclusions.some((exc) => ing.toLowerCase().includes(exc))
      );

      // Check meal name and description as safety fallback
      const nameOrDescExcluded = combinedExclusions.some(
        (exc) =>
          meal.name.toLowerCase().includes(exc) ||
          meal.description.toLowerCase().includes(exc)
      );

      return !hasExcludedIngredient && !nameOrDescExcluded;
    });
  }

  /**
   * Verifies if an order action can be safely executed.
   * If explicit confirmation has not been provided, blocks automatic execution.
   */
  public canPlaceOrder(params: {
    isExplicitlyConfirmed: boolean;
    cart: Cart;
    userConsentTimestamp?: string;
  }): { allowed: boolean; reason?: string } {
    if (!params.isExplicitlyConfirmed) {
      return {
        allowed: false,
        reason: 'Explicit user confirmation is required before placing the final order.',
      };
    }

    if (!params.cart || params.cart.items.length === 0) {
      return {
        allowed: false,
        reason: 'Cannot place order: Cart is empty.',
      };
    }

    return { allowed: true };
  }
}

export const safetyValidator = new SafetyValidator();
