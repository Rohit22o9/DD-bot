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

interface MobileThisOrThatWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

export interface QuestionOption {
  label: string;
  icon: string;
  key: string;
  desc?: string;
}

export interface QuestionRound {
  title: string;
  shortTitle: string;
  options: QuestionOption[];
}

export interface ChoiceHistoryItem {
  roundTitle: string;
  label: string;
  icon: string;
  key: string;
}

const ROUNDS: QuestionRound[] = [
  {
    title: 'Round 1: Spice Level',
    shortTitle: 'Spice',
    options: [
      { label: 'Mild', icon: '🙂', key: 'mild', desc: 'Gentle & light' },
      { label: 'Medium', icon: '⚖️', key: 'medium', desc: 'Balanced kick' },
      { label: 'Spicy', icon: '🌶️', key: 'spicy', desc: 'Bold heat' },
      { label: 'Extra Spicy', icon: '🔥', key: 'extra_spicy', desc: 'Fiery punch' },
    ],
  },
  {
    title: 'Round 2: Cuisine Craving',
    shortTitle: 'Cuisine',
    options: [
      { label: 'Italian', icon: '🇮🇹', key: 'italian', desc: 'Pasta, Risotto & Bread' },
      { label: 'Indian', icon: '🇮🇳', key: 'indian', desc: 'Biryani, Curry & Tikka' },
      { label: 'Indo-Chinese / Asian', icon: '🥢', key: 'asian', desc: 'Noodles & Wok Stir-fry' },
      { label: 'Japanese & Global', icon: '🍱', key: 'japanese', desc: 'Ramen, Bowls & Teriyaki' },
    ],
  },
  {
    title: 'Round 3: Protein Choice',
    shortTitle: 'Protein',
    options: [
      { label: 'Chicken', icon: '🍗', key: 'chicken', desc: 'Tender poultry' },
      { label: 'Beef & Lamb', icon: '🥩', key: 'beef', desc: 'Hearty meat' },
      { label: 'Seafood', icon: '🦐', key: 'seafood', desc: 'Prawns & fish' },
      { label: 'Veg & Paneer', icon: '🌱', key: 'veg', desc: 'Plant & tofu' },
    ],
  },
  {
    title: 'Round 4: Preferred Base',
    shortTitle: 'Base',
    options: [
      { label: 'Rice & Biryani', icon: '🍚', key: 'rice', desc: 'Fragrant grains' },
      { label: 'Noodles & Pasta', icon: '🍜', key: 'noodles', desc: 'Wok tossed' },
      { label: 'Roti & Bread', icon: '🫓', key: 'bread', desc: 'Freshly baked' },
      { label: 'Salad & Greens', icon: '🥗', key: 'salad', desc: 'Crisp & light' },
    ],
  },
  {
    title: 'Round 5: Mood & Vibe',
    shortTitle: 'Vibe',
    options: [
      { label: 'Healthy & Light', icon: '🥗', key: 'healthy', desc: 'Clean & fresh' },
      { label: 'Rich Comfort', icon: '🍛', key: 'comfort', desc: 'Warm & hearty' },
      { label: 'Crispy & Savory', icon: '🥟', key: 'crispy', desc: 'Crunchy delight' },
      { label: 'Chef Special', icon: '⭐', key: 'special', desc: 'Signature drop' },
    ],
  },
];

export const MobileThisOrThatWidget: React.FC<MobileThisOrThatWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<ChoiceHistoryItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [matchedMeal, setMatchedMeal] = useState<Meal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSelectChoice = (option: QuestionOption) => {
    const nextChoices = [...choices, option.key];
    const nextHistory: ChoiceHistoryItem[] = [
      ...selectedHistory,
      {
        roundTitle: ROUNDS[currentRoundIndex].title,
        label: option.label,
        icon: option.icon,
        key: option.key,
      },
    ];

    setChoices(nextChoices);
    setSelectedHistory(nextHistory);

    if (currentRoundIndex + 1 >= ROUNDS.length) {
      // Calculate match dynamically from real 136 meals
      const isExtraSpicy = nextChoices.includes('extra_spicy');
      const isSpicy = nextChoices.includes('spicy') || isExtraSpicy;
      const isMedium = nextChoices.includes('medium');
      const isMild = nextChoices.includes('mild');

      const wantsChicken = nextChoices.includes('chicken');
      const wantsBeef = nextChoices.includes('beef');
      const wantsSeafood = nextChoices.includes('seafood');
      const wantsVeg = nextChoices.includes('veg');

      const wantsRice = nextChoices.includes('rice');
      const wantsNoodles = nextChoices.includes('noodles');
      const wantsBread = nextChoices.includes('bread');
      const wantsSalad = nextChoices.includes('salad');

      let candidates = REAL_DAILY_DROP_MEALS.filter((m) => m.category === 'main');

      // 1. Cuisine filtering
      const wantsItalian = nextChoices.includes('italian');
      const wantsIndian = nextChoices.includes('indian');
      const wantsAsian = nextChoices.includes('asian');
      const wantsJapanese = nextChoices.includes('japanese');

      if (wantsItalian) {
        const pool = candidates.filter((m) => m.cuisine.toLowerCase() === 'italian' || /pasta|risotto|napoletana|lasagna|rigatoni/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsIndian) {
        const pool = candidates.filter((m) => /indian|punjabi/i.test(m.cuisine) || /biryani|curry|tikka|paneer|dal/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsAsian) {
        const pool = candidates.filter((m) => /indo-chinese|chinese|thai/i.test(m.cuisine) || /hakka|manchurian|noodles|wok/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsJapanese) {
        const pool = candidates.filter((m) => /japanese|korean/i.test(m.cuisine) || /ramen|teriyaki|miso|donburi/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      }

      // 2. Protein filtering
      if (wantsChicken) {
        const pool = candidates.filter((m) => /chicken/i.test(m.name) || /chicken/i.test(m.description));
        if (pool.length > 0) candidates = pool;
      } else if (wantsBeef) {
        const pool = candidates.filter((m) => /beef|lamb|steak/i.test(m.name) || /beef|lamb/i.test(m.description));
        if (pool.length > 0) candidates = pool;
      } else if (wantsSeafood) {
        const pool = candidates.filter((m) => /fish|salmon|prawn|shrimp|seafood/i.test(m.name) || /fish|salmon|prawn/i.test(m.description));
        if (pool.length > 0) candidates = pool;
      } else if (wantsVeg) {
        const pool = candidates.filter((m) => /veg|paneer|tofu|dal|lentil|egg/i.test(m.name) || m.dietaryTags.some((t) => /veg/i.test(t)));
        if (pool.length > 0) candidates = pool;
      }

      // 2. Spice filtering
      if (isExtraSpicy) {
        const pool = candidates.filter((m) => m.spicyLevel >= 2 || /spicy|chilli|mala|fiery|schezwan/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (isSpicy) {
        const pool = candidates.filter((m) => m.spicyLevel >= 1 || /spicy|chilli|pepper|curry/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (isMedium) {
        const pool = candidates.filter((m) => m.spicyLevel <= 1);
        if (pool.length > 0) candidates = pool;
      } else if (isMild) {
        const pool = candidates.filter((m) => m.spicyLevel === 0 && !/spicy|chilli|mala/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      }

      // 3. Base filtering
      if (wantsRice) {
        const pool = candidates.filter((m) => /rice|biryani/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsNoodles) {
        const pool = candidates.filter((m) => /noodle|ramen|pasta|spaghetti/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsBread) {
        const pool = candidates.filter((m) => /roti|naan|bread|wrap|taco|burger/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      } else if (wantsSalad) {
        const pool = candidates.filter((m) => /salad|bowl|greens/i.test(m.name));
        if (pool.length > 0) candidates = pool;
      }

      const match = candidates[Math.floor(Math.random() * candidates.length)] || REAL_DAILY_DROP_MEALS[0];
      setMatchedMeal(match);
      setIsFinished(true);
      setShowCelebration(true);
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setChoices([]);
    setSelectedHistory([]);
    setIsFinished(false);
    setMatchedMeal(null);
    setShowCelebration(false);
    onPlayAgain?.();
  };

  if (isFinished && matchedMeal) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeEmoji}>🎯</Text>
          <Text style={styles.resultBadgeTitle}>Got it! Your match tonight is...</Text>
        </View>

        <View style={styles.matchScoreBar}>
          <Text style={styles.matchScoreText}>✨ 92% Match for your choices</Text>
        </View>

        {/* Selected Preferences Summary (Upper side of the card) */}
        {selectedHistory.length > 0 && (
          <View style={styles.resultPrefContainer}>
            <Text style={styles.resultPrefHeader}>Your chosen preferences:</Text>
            <View style={styles.resultPrefRow}>
              {selectedHistory.map((item, idx) => (
                <View key={idx} style={styles.resultPrefBadge}>
                  <Text style={styles.resultPrefIcon}>{item.icon}</Text>
                  <Text style={styles.resultPrefText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Matched Meal Card */}
        <View style={styles.matchCard}>
          <MobileMealImage
            uri={matchedMeal.imageUrl}
            style={styles.matchImage}
            dishName={matchedMeal.name}
          />
          <View style={styles.matchBody}>
            <View style={styles.matchRow}>
              <Text style={styles.matchTitle}>{matchedMeal.name}</Text>
              <Text style={styles.matchPrice}>${matchedMeal.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.matchRest}>
              {matchedMeal.restaurantName} · {matchedMeal.cuisine}
            </Text>
            <Text style={styles.matchDesc} numberOfLines={2}>
              {matchedMeal.description}
            </Text>

            <TouchableOpacity
              style={styles.addCartBtn}
              activeOpacity={0.8}
              onPress={() => onAddToCart(matchedMeal.id)}
            >
              <Text style={styles.addCartText}>
                🛒 Add to cart — ${matchedMeal.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.restartBtn} onPress={handleRestart}>
          <Text style={styles.restartText}>🤔 Try different choices</Text>
        </TouchableOpacity>

        {/* Celebratory Pop-up with Falling Confetti Bars */}
        <MobileCelebrationModal
          visible={showCelebration}
          meal={matchedMeal}
          initialStep="reveal"
          onClose={() => setShowCelebration(false)}
          onAddToCart={(mealId) => {
            setShowCelebration(false);
            onAddToCart(mealId);
          }}
          title="DINNER PINPOINTED! 🎯"
          subtitle="92% match based on your preferences!"
          selectedPreferences={selectedHistory.map((h) => ({
            icon: h.icon,
            label: h.label,
          }))}
        />
      </View>
    );
  }

  const currentRound = ROUNDS[currentRoundIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🤔</Text>
          <Text style={styles.headerTitle}>This or That</Text>
        </View>
        <Text style={styles.stepCounter}>
          {currentRoundIndex + 1} of {ROUNDS.length}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Quick game. I'll find your perfect dinner in 5 questions.
      </Text>

      {/* Stepper with Previous Choice Icons so user remembers choices */}
      <View style={styles.stepperContainer}>
        {ROUNDS.map((round, i) => {
          const isDone = i < currentRoundIndex;
          const isActive = i === currentRoundIndex;
          const pastChoice = selectedHistory[i];

          return (
            <React.Fragment key={i}>
              <View style={styles.stepCol}>
                <View
                  style={[
                    styles.stepCircle,
                    isDone && styles.stepCircleDone,
                    isActive && styles.stepCircleActive,
                  ]}
                >
                  {isDone && pastChoice ? (
                    <Text style={styles.stepEmoji}>{pastChoice.icon}</Text>
                  ) : (
                    <Text
                      style={[
                        styles.stepNum,
                        isActive && styles.stepNumActive,
                        isDone && styles.stepNumDone,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isDone && styles.stepLabelDone,
                  ]}
                  numberOfLines={1}
                >
                  {isDone && pastChoice ? pastChoice.label : round.shortTitle}
                </Text>
              </View>

              {/* Connecting progress line */}
              {i < ROUNDS.length - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    i < currentRoundIndex && styles.stepConnectorDone,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <Text style={styles.questionTitle}>{currentRound.title}</Text>

      {/* 4 Square-Friendly Choice Cards (2x2 Grid) */}
      <View style={styles.grid2x2}>
        {currentRound.options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={styles.gridCard}
            activeOpacity={0.8}
            onPress={() => handleSelectChoice(opt)}
          >
            <Text style={styles.gridIcon}>{opt.icon}</Text>
            <Text style={styles.gridLabel}>{opt.label}</Text>
            {opt.desc ? <Text style={styles.gridDesc}>{opt.desc}</Text> : null}
            <View style={styles.chooseTap}>
              <Text style={styles.chooseTapText}>Pick this</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  stepCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
  },
  subtitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 20,
    marginBottom: 14,
  },

  // Stepper with Previous Choice Icons
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  stepCol: {
    alignItems: 'center',
    minWidth: 46,
    flexShrink: 0,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#0D7844',
    borderWidth: 2,
  },
  stepCircleDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  stepEmoji: {
    fontSize: 16,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  stepNumActive: {
    color: '#0D7844',
    fontWeight: '900',
  },
  stepNumDone: {
    color: '#065F46',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#0D7844',
    fontWeight: '800',
  },
  stepLabelDone: {
    color: '#374151',
    fontWeight: '700',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  stepConnectorDone: {
    backgroundColor: '#10B981',
  },

  questionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 10,
  },

  // 2x2 Grid Choices
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  gridCard: {
    width: '48.5%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    minHeight: 126,
  },
  gridIcon: {
    fontSize: 30,
    marginBottom: 2,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  chooseTap: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  chooseTapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },

  // Results
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  resultBadgeEmoji: {
    fontSize: 18,
  },
  resultBadgeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  matchScoreBar: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  matchScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },

  resultPrefContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultPrefHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultPrefRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  resultPrefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  resultPrefIcon: {
    fontSize: 12,
  },
  resultPrefText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },

  matchCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  matchImage: {
    width: '100%',
    height: 140,
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
  matchTitle: {
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
    alignItems: 'center',
    paddingVertical: 4,
  },
  restartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
