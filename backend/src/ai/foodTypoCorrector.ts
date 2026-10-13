/**
 * Food Typo Corrector & Intent Normalizer for Drop AI Backend
 */

export interface TypoCorrectionResult {
  hasCorrection: boolean;
  originalText: string;
  correctedText: string;
  correctedTerms: { from: string; to: string }[];
  friendlyNotice?: string;
}

const FOOD_TYPO_MAP: Record<string, string> = {
  aoupa: 'soup',
  aoup: 'soup',
  soupa: 'soup',
  sop: 'soup',
  suop: 'soup',
  soupe: 'soup',
  shoup: 'soup',
  soups: 'soup',

  vegegerian: 'vegetarian',
  vegitarian: 'vegetarian',
  vegtarian: 'vegetarian',
  vegiterian: 'vegetarian',
  vegitaran: 'vegetarian',
  vegeterian: 'vegetarian',
  veggan: 'vegan',

  optioms: 'options',
  optins: 'options',
  optios: 'options',
  optons: 'options',

  chiken: 'chicken',
  chikin: 'chicken',
  chickn: 'chicken',
  chikn: 'chicken',
  biryanii: 'biryani',
  biriyani: 'biryani',
  birani: 'biryani',
  nodles: 'noodles',
  noodels: 'noodles',
  piza: 'pizza',
  burgr: 'burger',
  helthy: 'healthy',
  spciy: 'spicy',
  diner: 'dinner',
  indain: 'indian',
  idnian: 'indian',
  itailan: 'italian',
  chinise: 'chinese',
  jpanese: 'japanese',
  kroan: 'korean',
  mexian: 'mexican',
  saladd: 'salad',
  curri: 'curry',
  protien: 'protein',
  desrt: 'dessert',
  drnk: 'drinks',
  indochinese: 'indo-chinese',
  indochines: 'indo-chinese',
  indianchinese: 'indo-chinese',
  manchuriann: 'manchurian',
  haka: 'hakka',
  schezwan: 'schezwan',
  hllal: 'halal',
  halaal: 'halal',
  planing: 'plan',
  usuel: 'usual',
  ususal: 'usual',
};

const CANONICAL_FOOD_WORDS = [
  'soup',
  'vegetarian',
  'options',
  'chicken',
  'biryani',
  'noodles',
  'pizza',
  'burger',
  'healthy',
  'spicy',
  'dinner',
  'lunch',
  'indian',
  'italian',
  'chinese',
  'japanese',
  'korean',
  'mexican',
  'thai',
  'salad',
  'curry',
  'protein',
  'salmon',
  'beef',
  'steak',
  'paneer',
  'dessert',
  'drinks',
];

// Whitelist of valid English words, food items, groceries, and actions that must NEVER be fuzzy altered
const VALID_WORDS_WHITELIST = new Set([
  'butter', 'cheese', 'bread', 'milk', 'eggs', 'egg', 'rice', 'meat', 'pork', 'fish',
  'apple', 'apples', 'banana', 'bananas', 'tomato', 'tomatoes', 'potato', 'potatoes',
  'onion', 'onions', 'garlic', 'spinach', 'lemon', 'lemons', 'lime', 'limes', 'curd',
  'yogurt', 'yoghurt', 'cream', 'berry', 'berries', 'grape', 'grapes', 'fruit', 'fruits',
  'water', 'juice', 'coffee', 'tea', 'soda', 'cake', 'cookie', 'cookies', 'fries',
  'chip', 'chips', 'roll', 'rolls', 'wrap', 'wraps', 'sandwich', 'pasta', 'sauce',
  'oil', 'sugar', 'salt', 'pepper', 'spice', 'spices', 'honey', 'oats', 'cereal',
  'flour', 'bean', 'beans', 'lentil', 'lentils', 'pea', 'peas', 'corn', 'tofu',
  'chicken', 'beef', 'lamb', 'mutton', 'seafood', 'shrimp', 'prawn', 'salmon',
  'tuna', 'trout', 'bacon', 'ham', 'turkey', 'duck', 'burger', 'pizza', 'noodle',
  'noodles', 'biryani', 'curry', 'taco', 'tacos', 'burrito', 'bowl', 'salad',
  'soup', 'dessert', 'drinks', 'drink', 'dinner', 'lunch', 'breakfast', 'brunch',
  'snack', 'snacks', 'grocery', 'groceries', 'order', 'buy', 'cart', 'need', 'want',
  'some', 'more', 'less', 'mild', 'spicy', 'hot', 'cold', 'warm', 'fresh', 'healthy',
  'organic', 'pure', 'plain', 'sweet', 'sour', 'crispy', 'fried', 'baked', 'roasted',
  'grilled', 'steamed', 'boiled', 'vegan', 'vegetarian', 'halal', 'kosher', 'gluten',
  'dairy', 'protein', 'calorie', 'calories', 'carb', 'carbs', 'fat', 'fats', 'fiber'
]);

function getEditDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1] + 1, prev + 1, row[j] + 1);
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

export function correctFoodTypos(rawText: string): TypoCorrectionResult {
  if (!rawText || !rawText.trim()) {
    return {
      hasCorrection: false,
      originalText: rawText,
      correctedText: rawText,
      correctedTerms: [],
    };
  }

  const words = rawText.split(/\s+/);
  const correctedTerms: { from: string; to: string }[] = [];
  const newWords = words.map((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanWord || cleanWord.length < 3) return word;

    if (FOOD_TYPO_MAP[cleanWord]) {
      const fixed = FOOD_TYPO_MAP[cleanWord];
      if (fixed !== cleanWord) {
        correctedTerms.push({ from: word, to: fixed });
        return fixed;
      }
    }

    // Never modify a recognized valid food or grocery word
    if (VALID_WORDS_WHITELIST.has(cleanWord)) {
      return word;
    }

    if (cleanWord.length >= 4) {
      let bestMatch: string | null = null;
      let minDistance = Infinity;

      for (const target of CANONICAL_FOOD_WORDS) {
        const maxAllowed = target.length >= 7 && cleanWord.length >= 6 ? 2 : 1;
        const dist = getEditDistance(cleanWord, target);
        if (dist <= maxAllowed && dist < minDistance) {
          minDistance = dist;
          bestMatch = target;
        }
      }

      if (bestMatch && bestMatch !== cleanWord && !VALID_WORDS_WHITELIST.has(cleanWord)) {
        correctedTerms.push({ from: word, to: bestMatch });
        return bestMatch;
      }
    }

    return word;
  });

  const correctedText = newWords.join(' ');
  const hasCorrection = correctedTerms.length > 0 && correctedText.toLowerCase() !== rawText.toLowerCase();

  let friendlyNotice: string | undefined;
  if (hasCorrection) {
    const termsStr = correctedTerms.map((t) => `"${t.to}"`).join(' & ');
    friendlyNotice = `Recognized ${termsStr} ✨`;
  }

  return {
    hasCorrection,
    originalText: rawText,
    correctedText,
    correctedTerms,
    friendlyNotice,
  };
}
