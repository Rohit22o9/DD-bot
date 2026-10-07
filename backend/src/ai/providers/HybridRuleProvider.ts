import { AIProvider, AICompletionMessage } from './AIProvider';
import { ParsedIntent, PrimaryJob, MealSlot } from '../../types';

export class HybridRuleProvider implements AIProvider {
  public name = 'HybridRuleProvider';

  isAvailable(): boolean {
    return true; // Always available offline or in test environments
  }

  async generateText(messages: AICompletionMessage[]): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content || '';
    return `Drop AI: Understood. Tailoring your meal selection based on "${lastMessage}".`;
  }

  async parseIntent(userInput: string, sessionContext?: any): Promise<ParsedIntent> {
    const text = userInput.trim();
    const lower = text.toLowerCase();

    let job: PrimaryJob = 'FIND';
    let protein: string | undefined;
    let cuisine: string | undefined;
    let budgetCap: number | undefined;
    let mealSlot: MealSlot | undefined;
    let targetDate: string | undefined;
    let spicyFilter: boolean | undefined;
    let healthyFilter: boolean | undefined;
    let isUsualRequest = false;
    let wantsBasket = false;
    let wantsPlan = false;
    let wantsDropForMe = false;
    let dropForMeMode: any = undefined;
    let explicitConfirmation = false;
    const requestedModifications: string[] = [];

    // 1. Explicit confirmation patterns
    if (
      lower.includes('confirm order') ||
      lower.includes('place this order') ||
      lower.includes('yes, place order') ||
      lower.includes('yes, confirm') ||
      lower === 'confirm' ||
      lower === 'place order'
    ) {
      job = 'ORDER';
      explicitConfirmation = true;
    }
    // 2. "Order my usual" patterns
    else if (
      lower.includes('order my usual') ||
      lower.includes('my usual') ||
      lower.includes('the usual') ||
      lower.includes('reorder previous')
    ) {
      job = 'ORDER';
      isUsualRequest = true;
    }
    // 2.5 "Drop For Me" mode (Section 1 & 5 of Drop AI spec: Safe, Adventure, Budget, Healthy Drop)
    else if (
      lower.includes('drop for me') ||
      lower.includes('safe drop') ||
      lower.includes('adventure drop') ||
      lower.includes('budget drop') ||
      lower.includes('healthy drop') ||
      lower === 'pick for me' ||
      lower === 'choose for me'
    ) {
      job = 'BUILD';
      wantsDropForMe = true;
      dropForMeMode = 'safe';
      if (lower.includes('adventure')) dropForMeMode = 'adventure';
      else if (lower.includes('budget')) dropForMeMode = 'budget';
      else if (lower.includes('healthy')) dropForMeMode = 'healthy';
    }
    // 3. Basket building ("I've got $20. Make me a good dinner")
    else if (
      (lower.includes('make me a') || lower.includes('basket') || lower.includes('combo') || lower.includes("i've got")) &&
      (lower.includes('dinner') || lower.includes('lunch') || lower.includes('$'))
    ) {
      job = 'BUILD';
      wantsBasket = true;
    }
    // 4. Meal planning ("Sort my dinners Monday-Friday", "Weekly meal plan")
    else if (
      lower.includes('monday-friday') ||
      lower.includes('monday to friday') ||
      lower.includes('weekly') ||
      lower.includes('meal plan') ||
      lower.includes('sort my dinner') ||
      lower.includes('change wednesday') ||
      lower.includes('friday vegetarian') ||
      lower.includes('remove salad') ||
      lower.includes('keep everything under')
    ) {
      job = 'BUILD';
      wantsPlan = true;
    }
    // 5. "I don't know what to eat" / decision reduction
    else if (
      lower.includes("don't know what to eat") ||
      lower.includes('dont know what to eat') ||
      lower.includes('not sure what to eat') ||
      lower.includes('what should i eat') ||
      lower.includes('recommend something') ||
      lower.includes('help me choose')
    ) {
      job = 'CHOOSE';
    }
    // 6. Quick branch triggers
    else if (
      lower === 'something different' ||
      lower === 'surprise me' ||
      lower === 'spicy' ||
      lower === 'healthy' ||
      lower === 'comfort food' ||
      lower === 'cheap' ||
      lower.includes('show more') ||
      lower.includes('show me another') ||
      lower.includes('what else') ||
      lower.includes('something else')
    ) {
      job = 'FIND';
    }

    // Extract isAlternativeRequest
    const isAlternativeRequest =
      lower.includes('show more') ||
      lower.includes('show me another') ||
      lower.includes('what else') ||
      lower.includes('something else') ||
      lower === 'next' ||
      lower.includes('another one') ||
      lower.includes('another option') ||
      lower === 'something different';

    // Extract Budget: e.g. "$15", "under $20", "under 15", "$65", "under $60", "cheap"
    const budgetMatch = lower.match(/(?:under|<|got|budget of|keep it under)\s*\$?(\d+(?:\.\d+)?)/i) ||
                        lower.match(/\$(\d+(?:\.\d+)?)/);
    if (budgetMatch) {
      budgetCap = parseFloat(budgetMatch[1]);
    } else if (lower.includes('cheap')) {
      budgetCap = 12.0;
    }

    // Extract Slot
    if (lower.includes('dinner') || lower.includes('tonight')) {
      mealSlot = 'dinner';
    } else if (lower.includes('lunch') || lower.includes('noon')) {
      mealSlot = 'lunch';
    }

    // Extract Date
    if (lower.includes('tomorrow')) {
      targetDate = 'tomorrow';
    } else if (lower.includes('tonight') || lower.includes('today')) {
      targetDate = 'today';
    }

    // Extract Dish Keyword
    let dishKeyword: string | undefined;
    const dishes = [
      'biryani',
      'jollof',
      'lasagne',
      'rendang',
      'pasta',
      'curry',
      'samosa',
      'tacos',
      'pad thai',
      'katsu',
      'mee goreng',
      'salad',
      'bowl',
      'burger',
    ];
    for (const d of dishes) {
      if (lower.includes(d)) {
        dishKeyword = d;
        break;
      }
    }

    // Extract Protein
    const proteins = ['chicken', 'salmon', 'beef', 'tofu', 'pork', 'falafel', 'tuna', 'halloumi'];
    for (const p of proteins) {
      if (lower.includes(p)) {
        protein = p;
        break;
      }
    }

    // Extract Cuisine (All cuisines from Drop AI specification)
    const cuisines = [
      'thai',
      'japanese',
      'mexican',
      'italian',
      'mediterranean',
      'korean',
      'indian',
      'african',
      'malaysian',
      'chinese',
      'vietnamese',
    ];
    for (const c of cuisines) {
      if (lower.includes(c)) {
        cuisine = c.charAt(0).toUpperCase() + c.slice(1);
        break;
      }
    }

    // Extract Spicy / Healthy / Comfort / Wellness Meals
    let wellnessCategory: 'high-protein' | 'weight-management' | 'high-fibre' | undefined;
    if (lower.includes('high protein') || lower.includes('high-protein')) {
      wellnessCategory = 'high-protein';
      healthyFilter = true;
    } else if (lower.includes('weight management') || lower.includes('weight-management') || lower.includes('weight loss')) {
      wellnessCategory = 'weight-management';
      healthyFilter = true;
    } else if (
      lower.includes('high fibre') ||
      lower.includes('high-fibre') ||
      lower.includes('high fiber') ||
      lower.includes('high-fiber') ||
      lower.includes('gut friendly') ||
      lower.includes('gut-friendly')
    ) {
      wellnessCategory = 'high-fibre';
      healthyFilter = true;
    }

    if (lower.includes('spicy') || lower.includes('hot') || lower.includes('fire')) {
      spicyFilter = true;
    }
    if (lower.includes('healthy') || lower.includes('clean') || lower.includes('diet') || lower.includes('light') || lower.includes('wellness')) {
      healthyFilter = true;
    }

    // Extract modifications (e.g. for meal plan)
    if (lower.includes('change wednesday')) {
      requestedModifications.push('CHANGE_WEDNESDAY');
    }
    if (lower.includes('friday vegetarian') || lower.includes('make friday vegetarian')) {
      requestedModifications.push('FRIDAY_VEGETARIAN');
    }
    if (lower.includes('remove salads') || lower.includes('remove salad') || lower.includes('no salads')) {
      requestedModifications.push('REMOVE_SALADS');
    }

    return {
      job,
      query: text,
      protein,
      cuisine,
      budgetCap,
      mealSlot,
      targetDate,
      spicyFilter,
      healthyFilter,
      wellnessCategory,
      isUsualRequest,
      wantsBasket,
      wantsPlan,
      wantsDropForMe,
      dropForMeMode,
      isAlternativeRequest,
      dishKeyword,
      requestedModifications,
      explicitConfirmation,
    };
  }
}

export const hybridRuleProvider = new HybridRuleProvider();
