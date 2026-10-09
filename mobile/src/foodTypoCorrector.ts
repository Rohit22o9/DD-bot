/**
 * Food Typo Corrector & Intent Normalizer for Drop AI
 * Recognizes spelling mistakes, typos, and phonetic variations in food queries.
 */

export interface TypoCorrectionResult {
  hasCorrection: boolean;
  originalText: string;
  correctedText: string;
  correctedTerms: { from: string; to: string }[];
  friendlyNotice?: string;
}

// Comprehensive dictionary of common misspellings for food terms, cuisines, and diets
const FOOD_TYPO_MAP: Record<string, string> = {
  // Soups
  aoupa: 'soup',
  aoup: 'soup',
  soupa: 'soup',
  sop: 'soup',
  suop: 'soup',
  soupe: 'soup',
  shoup: 'soup',
  soups: 'soup',

  // Vegetarian & Vegan
  vegegerian: 'vegetarian',
  vegitarian: 'vegetarian',
  vegtarian: 'vegetarian',
  vegiterian: 'vegetarian',
  vegitaran: 'vegetarian',
  vegeterian: 'vegetarian',
  vegiteran: 'vegetarian',
  vegitarean: 'vegetarian',
  vegaterian: 'vegetarian',
  veggan: 'vegan',
  vagan: 'vegan',

  // Options & Query terms
  optioms: 'options',
  optins: 'options',
  optios: 'options',
  optons: 'options',
  opton: 'option',
  optin: 'option',

  // Proteins
  chiken: 'chicken',
  chikin: 'chicken',
  chickn: 'chicken',
  chikn: 'chicken',
  chickin: 'chicken',
  chikken: 'chicken',
  samon: 'salmon',
  slamon: 'salmon',
  salmn: 'salmon',
  stak: 'steak',
  staek: 'steak',
  beaf: 'beef',
  beeff: 'beef',
  proten: 'protein',
  protien: 'protein',
  protiens: 'proteins',
  paner: 'paneer',
  panner: 'paneer',
  paneere: 'paneer',
  seafod: 'seafood',
  seeafood: 'seafood',
  prawn: 'prawns',
  shrimp: 'shrimp',
  shrip: 'shrimp',

  // Dishes
  biryanii: 'biryani',
  biriyani: 'biryani',
  birani: 'biryani',
  briyani: 'biryani',
  biryany: 'biryani',
  nodles: 'noodles',
  noodels: 'noodles',
  noodls: 'noodles',
  nodle: 'noodles',
  nudles: 'noodles',
  piza: 'pizza',
  pizzza: 'pizza',
  pizaa: 'pizza',
  pziza: 'pizza',
  burgr: 'burger',
  bergur: 'burger',
  borger: 'burger',
  burgur: 'burger',
  curri: 'curry',
  cury: 'curry',
  currie: 'curry',
  saladd: 'salad',
  slaad: 'salad',
  salat: 'salad',
  pastaa: 'pasta',
  pastta: 'pasta',
  passta: 'pasta',
  taco: 'tacos',
  takos: 'tacos',
  burito: 'burrito',
  burritto: 'burrito',
  qunoa: 'quinoa',
  quinua: 'quinoa',
  lassii: 'lassi',
  lasi: 'lassi',

  // Cuisines
  indain: 'indian',
  idnian: 'indian',
  indin: 'indian',
  india: 'indian',
  itailan: 'italian',
  italien: 'italian',
  itlian: 'italian',
  italiano: 'italian',
  chinise: 'chinese',
  chineese: 'chinese',
  chines: 'chinese',
  jpanese: 'japanese',
  japnese: 'japanese',
  japaneese: 'japanese',
  kroan: 'korean',
  koren: 'korean',
  koreen: 'korean',
  mexian: 'mexican',
  mexicn: 'mexican',
  thaii: 'thai',
  tia: 'thai',
  mediteranean: 'mediterranean',
  mediteranian: 'mediterranean',
  vietnamise: 'vietnamese',

  // Descriptors & Attributes
  helthy: 'healthy',
  helth: 'healthy',
  healhy: 'healthy',
  heathly: 'healthy',
  spciy: 'spicy',
  spcey: 'spicy',
  spisy: 'spicy',
  spise: 'spicy',
  spiccy: 'spicy',
  diner: 'dinner',
  dinnr: 'dinner',
  denner: 'dinner',
  luch: 'lunch',
  lonch: 'lunch',
  desrt: 'dessert',
  dessrt: 'dessert',
  deserts: 'dessert',
  drnk: 'drinks',
  drniks: 'drinks',
  bevrages: 'beverages',
  cheep: 'cheap',
  budjet: 'budget',
  familly: 'family',
};

// Target keywords for fuzzy Levenshtein comparison
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
  'quinoa',
  'burrito',
  'tacos',
];

/**
 * Compute simple Levenshtein edit distance
 */
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

/**
 * Correct spelling mistakes in user input
 */
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

    // 1. Exact map check
    if (FOOD_TYPO_MAP[cleanWord]) {
      const fixed = FOOD_TYPO_MAP[cleanWord];
      if (fixed !== cleanWord) {
        correctedTerms.push({ from: word, to: fixed });
        return fixed;
      }
    }

    // 2. Fuzzy Levenshtein check for words of length >= 4
    if (cleanWord.length >= 4) {
      let bestMatch: string | null = null;
      let minDistance = Infinity;

      for (const target of CANONICAL_FOOD_WORDS) {
        // Distance tolerance: 1 for short words, 2 for longer words
        const maxAllowed = target.length > 5 ? 2 : 1;
        const dist = getEditDistance(cleanWord, target);

        if (dist <= maxAllowed && dist < minDistance) {
          minDistance = dist;
          bestMatch = target;
        }
      }

      if (bestMatch && bestMatch !== cleanWord) {
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
