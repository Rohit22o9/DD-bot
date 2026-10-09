import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

interface MobileBuildMealWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
  onPreferencesDiscovered?: (signals: {
    likedCuisines: string[];
    spicyLoved: boolean;
    proteinPref: string;
  }) => void;
}

interface StepOption {
  label: string;
  emoji: string;
  key: string;
  subtext?: string;
  badge?: string;
}

const TOTAL_STEPS = 4;

// 1. Proteins with accurate protein grams & tags
const PROTEINS: StepOption[] = [
  { label: 'Chicken', emoji: '🍗', key: 'chicken', subtext: '~32g Protein', badge: 'Lean & High' },
  { label: 'Beef & Steak', emoji: '🥩', key: 'beef', subtext: '~35g Protein', badge: 'Hearty' },
  { label: 'Salmon & Fish', emoji: '🐟', key: 'salmon', subtext: '~28g Protein', badge: 'Omega-3' },
  { label: 'Shrimp / Seafood', emoji: '🍤', key: 'seafood', subtext: '~25g Protein', badge: 'Light & Crisp' },
  { label: 'Veg & Paneer', emoji: '🌱', key: 'veg', subtext: '~20g Protein', badge: 'Plant-Fuel' },
  { label: 'Tofu / Egg Bowl', emoji: '🍳', key: 'tofu_egg', subtext: '~22g Protein', badge: 'Balanced' },
];

// 2. Calorie & Macro Target Goals
const CALORIE_GOALS: StepOption[] = [
  { label: 'Under 500 kcal', emoji: '🥗', key: 'under_500', subtext: 'Light & Lean Cut', badge: 'Low Cal' },
  { label: '500 – 700 kcal', emoji: '⚖️', key: '500_700', subtext: 'Balanced Daily Fuel', badge: 'Balanced' },
  { label: '700+ kcal', emoji: '💪', key: 'over_700', subtext: 'High Energy & Bulking', badge: 'Power Up' },
  { label: 'High Protein (35g+)', emoji: '⚡', key: 'max_protein', subtext: 'Muscle Recovery Priority', badge: 'Protein Max' },
];

// 3. Flavour Personality & Spice
const PERSONALITIES: StepOption[] = [
  { label: 'Fiery Spice', emoji: '🌶️', key: 'fiery', subtext: 'Bold chilies & punch', badge: 'Spicy' },
  { label: 'Fresh Citrus', emoji: '🍋', key: 'fresh', subtext: 'Zesty herbs & lemon', badge: 'Zesty' },
  { label: 'Rich Curry', emoji: '🍛', key: 'rich', subtext: 'Aromatic coconut & masala', badge: 'Warm' },
  { label: 'Herb & Garlic', emoji: '🧄', key: 'herb_garlic', subtext: 'Savory butter & aromatics', badge: 'Savory' },
];

// 4. Bases & Carbs
const BASES: StepOption[] = [
  { label: 'Jasmine Rice', emoji: '🍚', key: 'rice', subtext: 'Fluffy fragrant grains', badge: 'Classic' },
  { label: 'Wok Noodles', emoji: '🍜', key: 'noodles', subtext: 'Hearty noodles & pasta', badge: 'Slurp' },
  { label: 'Quinoa Greens', emoji: '🥗', key: 'quinoa', subtext: 'Nutrient salad & grains', badge: 'Superfood' },
  { label: 'Low-Carb / Keto', emoji: '🥑', key: 'low_carb', subtext: 'Grain-free veggies & greens', badge: 'Keto' },
];

export const MobileBuildMealWidget: React.FC<MobileBuildMealWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
  onPreferencesDiscovered,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedProtein, setSelectedProtein] = useState<StepOption | null>(null);
  const [selectedCalories, setSelectedCalories] = useState<StepOption | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<StepOption | null>(null);
  const [selectedBase, setSelectedBase] = useState<StepOption | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelectProtein = (opt: StepOption) => {
    setSelectedProtein(opt);
    setStep(2);
  };

  const handleSelectCalories = (opt: StepOption) => {
    setSelectedCalories(opt);
    setStep(3);
  };

  const handleSelectPersonality = (opt: StepOption) => {
    setSelectedPersonality(opt);
    setStep(4);
  };

  const handleSelectBase = (opt: StepOption) => {
    setSelectedBase(opt);
    setStep(5);
    setShowCelebration(true);

    if (onPreferencesDiscovered) {
      onPreferencesDiscovered({
        likedCuisines: [],
        spicyLoved: opt.key === 'fiery',
        proteinPref: selectedProtein?.label || 'Chicken',
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedProtein(null);
    setSelectedCalories(null);
    setSelectedPersonality(null);
    setSelectedBase(null);
    setShowCelebration(false);
    onPlayAgain?.();
  };

  // Determine closest available match from real 136 meals
  let candidates: Meal[] = REAL_DAILY_DROP_MEALS.filter((m: Meal) => m.category === 'main');

  // Filter 1: Protein Match
  if (selectedProtein?.key === 'veg') {
    const vegPool = candidates.filter(
      (m: Meal) =>
        m.healthFlags?.vegetarian ||
        m.dietaryTags.some((t: string) => /veg|plant|paneer|tofu/i.test(t)) ||
        /paneer|veg|tofu|dal/i.test(m.name)
    );
    if (vegPool.length > 0) candidates = vegPool;
  } else if (selectedProtein?.key === 'chicken') {
    const chickenPool = candidates.filter((m: Meal) =>
      /chicken/i.test(m.name + ' ' + m.description)
    );
    if (chickenPool.length > 0) candidates = chickenPool;
  } else if (selectedProtein?.key === 'beef') {
    const beefPool = candidates.filter((m: Meal) =>
      /beef|steak|lamb|goat|pork|meat/i.test(m.name + ' ' + m.description)
    );
    if (beefPool.length > 0) candidates = beefPool;
  } else if (selectedProtein?.key === 'salmon') {
    const salmonPool = candidates.filter((m: Meal) =>
      /salmon|fish|tuna|trout/i.test(m.name + ' ' + m.description)
    );
    if (salmonPool.length > 0) candidates = salmonPool;
  } else if (selectedProtein?.key === 'seafood') {
    const seafoodPool = candidates.filter((m: Meal) =>
      /shrimp|prawn|squid|calamari|seafood/i.test(m.name + ' ' + m.description)
    );
    if (seafoodPool.length > 0) candidates = seafoodPool;
  } else if (selectedProtein?.key === 'tofu_egg') {
    const tofuPool = candidates.filter((m: Meal) =>
      /tofu|egg|omelette|mushroom/i.test(m.name + ' ' + m.description)
    );
    if (tofuPool.length > 0) candidates = tofuPool;
  }

  // Filter 2: Calories & Macro Match
  if (selectedCalories?.key === 'under_500') {
    const lowPool = candidates.filter((m: Meal) => m.calories && m.calories <= 530);
    if (lowPool.length > 0) candidates = lowPool;
  } else if (selectedCalories?.key === '500_700') {
    const balPool = candidates.filter(
      (m: Meal) => m.calories && m.calories >= 480 && m.calories <= 720
    );
    if (balPool.length > 0) candidates = balPool;
  } else if (selectedCalories?.key === 'over_700') {
    const highPool = candidates.filter((m: Meal) => m.calories && m.calories >= 680);
    if (highPool.length > 0) candidates = highPool;
  } else if (selectedCalories?.key === 'max_protein') {
    const protPool = candidates.filter(
      (m: Meal) => (m.proteinGrams && m.proteinGrams >= 28) || m.healthFlags?.highProtein
    );
    if (protPool.length > 0) candidates = protPool;
  }

  // Filter 3: Flavour Personality Match
  if (selectedPersonality?.key === 'fiery') {
    const fieryPool = candidates.filter(
      (m: Meal) =>
        m.spicyLevel > 0 || /spicy|chili|hot|fiery|jalapeno/i.test(m.name + ' ' + m.description)
    );
    if (fieryPool.length > 0) candidates = fieryPool;
  } else if (selectedPersonality?.key === 'fresh') {
    const freshPool = candidates.filter((m: Meal) =>
      /fresh|citrus|lemon|lime|mint|herb|salad/i.test(m.name + ' ' + m.description)
    );
    if (freshPool.length > 0) candidates = freshPool;
  } else if (selectedPersonality?.key === 'rich') {
    const richPool = candidates.filter((m: Meal) =>
      /curry|masala|tikka|gravy|coconut|butter/i.test(m.name + ' ' + m.description)
    );
    if (richPool.length > 0) candidates = richPool;
  } else if (selectedPersonality?.key === 'herb_garlic') {
    const garlicPool = candidates.filter((m: Meal) =>
      /garlic|herb|rosemary|thyme|butter|parmesan/i.test(m.name + ' ' + m.description)
    );
    if (garlicPool.length > 0) candidates = garlicPool;
  }

  // Filter 4: Base Match
  if (selectedBase?.key === 'rice') {
    const ricePool = candidates.filter((m: Meal) =>
      /rice|biryani|bowl/i.test(m.name + ' ' + m.description)
    );
    if (ricePool.length > 0) candidates = ricePool;
  } else if (selectedBase?.key === 'noodles') {
    const noodlePool = candidates.filter((m: Meal) =>
      /noodle|ramen|pasta|spaghetti|udon|chow/i.test(m.name + ' ' + m.description)
    );
    if (noodlePool.length > 0) candidates = noodlePool;
  } else if (selectedBase?.key === 'quinoa') {
    const quinoaPool = candidates.filter((m: Meal) =>
      /quinoa|salad|greens|bowl/i.test(m.name + ' ' + m.description)
    );
    if (quinoaPool.length > 0) candidates = quinoaPool;
  } else if (selectedBase?.key === 'low_carb') {
    const ketoPool = candidates.filter(
      (m: Meal) =>
        m.healthFlags?.lowCarb ||
        (m.nutrition?.carbsGrams && m.nutrition.carbsGrams < 35) ||
        /keto|greens|salad|lean/i.test(m.name + ' ' + m.description)
    );
    if (ketoPool.length > 0) candidates = ketoPool;
  }

  const matchedMeal: Meal = candidates[0] || REAL_DAILY_DROP_MEALS[0];

  return (
    <View style={styles.container}>
      {/* Header with Title & Bug-free Step Badge */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🧑‍🍳</Text>
          <Text style={styles.headerTitle}>Build My Meal</Text>
        </View>
        <Text style={[styles.stepBadge, step === 5 && styles.stepBadgeDone]}>
          {step === 5 ? 'Matched! 🎯' : `Step ${step} of ${TOTAL_STEPS}`}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Craft your custom flavour formula and Drop AI finds the perfect match!
      </Text>

      {/* Interactive Progress Tracker with Selected Icons */}
      <View style={styles.progressTracker}>
        {[
          { num: 1, label: 'Protein', sel: selectedProtein },
          { num: 2, label: 'Calories', sel: selectedCalories },
          { num: 3, label: 'Flavour', sel: selectedPersonality },
          { num: 4, label: 'Base', sel: selectedBase },
        ].map((s) => (
          <TouchableOpacity
            key={s.num}
            activeOpacity={0.7}
            disabled={step < s.num}
            onPress={() => setStep(s.num as any)}
            style={[
              styles.trackerPill,
              step === s.num && styles.trackerPillActive,
              step > s.num && styles.trackerPillDone,
            ]}
          >
            <Text style={styles.trackerEmoji}>
              {s.sel ? s.sel.emoji : `${s.num}`}
            </Text>
            <Text
              style={[
                styles.trackerText,
                step === s.num && styles.trackerTextActive,
                step > s.num && styles.trackerTextDone,
              ]}
              numberOfLines={1}
            >
              {s.sel ? s.sel.label.split(' ')[0] : s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* STEP 1: PROTEIN */}
      {step === 1 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>1. Choose your protein:</Text>
          <View style={styles.optionsGrid}>
            {PROTEINS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.optionBtn,
                  selectedProtein?.key === p.key && styles.optionBtnSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectProtein(p)}
              >
                <Text style={styles.optionEmoji}>{p.emoji}</Text>
                <Text style={styles.optionLabel}>{p.label}</Text>
                {p.subtext && <Text style={styles.optionSubtext}>{p.subtext}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 2: CALORIES & MACRO TARGET */}
      {step === 2 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>2. Choose your calories & nutrition goal:</Text>
          <View style={styles.optionsGrid}>
            {CALORIE_GOALS.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[
                  styles.optionBtn,
                  selectedCalories?.key === c.key && styles.optionBtnSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectCalories(c)}
              >
                <Text style={styles.optionEmoji}>{c.emoji}</Text>
                <Text style={styles.optionLabel}>{c.label}</Text>
                {c.subtext && <Text style={styles.optionSubtext}>{c.subtext}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 3: FLAVOUR PERSONALITY */}
      {step === 3 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>3. Choose your flavour personality:</Text>
          <View style={styles.optionsGrid}>
            {PERSONALITIES.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.optionBtn,
                  selectedPersonality?.key === p.key && styles.optionBtnSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectPersonality(p)}
              >
                <Text style={styles.optionEmoji}>{p.emoji}</Text>
                <Text style={styles.optionLabel}>{p.label}</Text>
                {p.subtext && <Text style={styles.optionSubtext}>{p.subtext}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 4: BASE */}
      {step === 4 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>4. Choose your base:</Text>
          <View style={styles.optionsGrid}>
            {BASES.map((b) => (
              <TouchableOpacity
                key={b.key}
                style={[
                  styles.optionBtn,
                  selectedBase?.key === b.key && styles.optionBtnSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => handleSelectBase(b)}
              >
                <Text style={styles.optionEmoji}>{b.emoji}</Text>
                <Text style={styles.optionLabel}>{b.label}</Text>
                {b.subtext && <Text style={styles.optionSubtext}>{b.subtext}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 5: REVEAL MATCH */}
      {step === 5 && (
        <View style={styles.revealBox}>
          {/* Formula Pill displaying all chosen ingredients */}
          <View style={styles.formulaPill}>
            <Text style={styles.formulaText}>
              You built: {selectedProtein?.emoji} {selectedProtein?.label} +{' '}
              {selectedCalories?.emoji} {selectedCalories?.label} +{' '}
              {selectedPersonality?.emoji} {selectedPersonality?.label} +{' '}
              {selectedBase?.emoji} {selectedBase?.label}
            </Text>
          </View>

          {/* Winning Dish Card */}
          <View style={styles.matchCard}>
            <MobileMealImage
              key={matchedMeal.id}
              uri={matchedMeal.imageUrl}
              style={styles.matchImage}
              dishName={matchedMeal.name}
            />

            {/* Nutrition Ribbon on matched dish */}
            <View style={styles.nutritionRibbon}>
              <Text style={styles.nutritionRibbonText}>
                🔥 {matchedMeal.calories} kcal · 💪 {matchedMeal.proteinGrams || 26}g protein · 🥗 {matchedMeal.cuisine}
              </Text>
            </View>

            <View style={styles.matchBody}>
              <View style={styles.matchRow}>
                <Text style={styles.matchName}>{matchedMeal.name}</Text>
                <Text style={styles.matchPrice}>${matchedMeal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.matchRest}>
                {matchedMeal.restaurantName} · <Text style={styles.cuisineText}>{matchedMeal.cuisine}</Text>
              </Text>
              <Text style={styles.matchDesc} numberOfLines={2}>
                {matchedMeal.description}
              </Text>

              <TouchableOpacity
                style={styles.addCartBtn}
                activeOpacity={0.85}
                onPress={() => onAddToCart(matchedMeal.id)}
              >
                <Text style={styles.addCartText}>
                  🛒 Add to cart — ${matchedMeal.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.restartBtn}
            activeOpacity={0.7}
            onPress={handleReset}
          >
            <Text style={styles.restartText}>🧑‍🍳 Rebuild a new combo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Celebratory Pop-up with Falling Confetti Bars */}
      <MobileCelebrationModal
        visible={showCelebration}
        meal={matchedMeal}
        onClose={() => setShowCelebration(false)}
        onAddToCart={(mealId) => {
          setShowCelebration(false);
          onAddToCart(mealId);
        }}
        title="CUSTOM MEAL BUILT! 🧑‍🍳"
        subtitle="Drop AI matched your recipe with today's hot kitchen drop!"
        selectedPreferences={
          matchedMeal
            ? [
                { icon: selectedProtein?.emoji || '🍗', label: selectedProtein?.label || 'Protein' },
                { icon: selectedCalories?.emoji || '🥗', label: selectedCalories?.label || 'Calories' },
                { icon: selectedPersonality?.emoji || '🌶️', label: selectedPersonality?.label || 'Flavour' },
                { icon: selectedBase?.emoji || '🍚', label: selectedBase?.label || 'Base' },
              ]
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepBadgeDone: {
    color: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },

  // Interactive Progress Tracker
  progressTracker: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  trackerPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trackerPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  trackerPillDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  trackerEmoji: {
    fontSize: 12,
  },
  trackerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  trackerTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  trackerTextDone: {
    color: '#15803D',
    fontWeight: '700',
  },

  stepBox: {
    marginTop: 2,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    width: '48.5%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  optionBtnSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  optionEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  optionSubtext: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },

  // Reveal match state
  revealBox: {
    marginTop: 4,
  },
  formulaPill: {
    backgroundColor: '#ECFDF5',
    padding: 9,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  formulaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    textAlign: 'center',
    lineHeight: 16,
  },
  matchCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  matchImage: {
    width: '100%',
    height: 140,
  },
  nutritionRibbon: {
    backgroundColor: '#1E293B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  nutritionRibbonText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  matchBody: {
    padding: 12,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  matchName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  matchPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  matchRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  cuisineText: {
    color: '#059669',
    fontWeight: '700',
  },
  matchDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 10,
  },
  addCartBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addCartText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  restartBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  restartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
