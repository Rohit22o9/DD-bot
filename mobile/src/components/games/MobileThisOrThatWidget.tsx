import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Meal } from '../../types';
import { MOCK_MOBILE_MEALS } from '../../mockData';
import { MobileMealImage } from '../MobileMealImage';

interface MobileThisOrThatWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

interface QuestionRound {
  title: string;
  optionA: { label: string; icon: string; key: string };
  optionB: { label: string; icon: string; key: string };
}

const ROUNDS: QuestionRound[] = [
  {
    title: 'Round 1: Spice Level',
    optionA: { label: 'Spicy', icon: '🌶️', key: 'spicy' },
    optionB: { label: 'Mild', icon: '🙂', key: 'mild' },
  },
  {
    title: 'Round 2: Protein Choice',
    optionA: { label: 'Chicken', icon: '🍗', key: 'chicken' },
    optionB: { label: 'Beef / Seafood', icon: '🥩', key: 'beef_seafood' },
  },
  {
    title: 'Round 3: Preferred Base',
    optionA: { label: 'Rice', icon: '🍚', key: 'rice' },
    optionB: { label: 'Bread / Quinoa', icon: '🫓', key: 'bread_quinoa' },
  },
  {
    title: 'Round 4: Mood & Vibe',
    optionA: { label: 'Healthy & Fresh', icon: '🥗', key: 'healthy' },
    optionB: { label: 'Rich Comfort', icon: '🍛', key: 'comfort' },
  },
];

export const MobileThisOrThatWidget: React.FC<MobileThisOrThatWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [matchedMeal, setMatchedMeal] = useState<Meal | null>(null);

  const handleSelectChoice = (choiceKey: string) => {
    const nextChoices = [...choices, choiceKey];
    setChoices(nextChoices);

    if (currentRoundIndex + 1 >= ROUNDS.length) {
      // Calculate match
      const isSpicy = nextChoices.includes('spicy');
      const wantsChicken = nextChoices.includes('chicken');
      const wantsHealthy = nextChoices.includes('healthy');

      let match: Meal | undefined;
      if (wantsHealthy && !isSpicy) {
        match = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_quinoa_bowl') || MOCK_MOBILE_MEALS[1];
      } else if (isSpicy && wantsChicken) {
        match = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_thai_basil') || MOCK_MOBILE_MEALS[0];
      } else if (!isSpicy && !wantsChicken) {
        match = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_salmon_bowl') || MOCK_MOBILE_MEALS[2];
      } else if (isSpicy && !wantsChicken) {
        match = MOCK_MOBILE_MEALS.find((m) => m.id === 'meal_beef_rendang') || MOCK_MOBILE_MEALS[5];
      } else {
        match = MOCK_MOBILE_MEALS[0];
      }

      setMatchedMeal(match || MOCK_MOBILE_MEALS[0]);
      setIsFinished(true);
    } else {
      setCurrentRoundIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentRoundIndex(0);
    setChoices([]);
    setIsFinished(false);
    setMatchedMeal(null);
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
        Quick game. I'll find your perfect dinner in 4 questions.
      </Text>

      {/* Progress Dots */}
      <View style={styles.dotsRow}>
        {ROUNDS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentRoundIndex && styles.dotDone,
              i === currentRoundIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <Text style={styles.questionTitle}>{currentRound.title}</Text>

      {/* 2 Big Choice Cards */}
      <View style={styles.choicesRow}>
        <TouchableOpacity
          style={styles.choiceCard}
          activeOpacity={0.8}
          onPress={() => handleSelectChoice(currentRound.optionA.key)}
        >
          <Text style={styles.choiceIcon}>{currentRound.optionA.icon}</Text>
          <Text style={styles.choiceLabel}>{currentRound.optionA.label}</Text>
          <View style={styles.chooseTap}>
            <Text style={styles.chooseTapText}>Pick this</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.orDivider}>
          <Text style={styles.orText}>OR</Text>
        </View>

        <TouchableOpacity
          style={styles.choiceCard}
          activeOpacity={0.8}
          onPress={() => handleSelectChoice(currentRound.optionB.key)}
        >
          <Text style={styles.choiceIcon}>{currentRound.optionB.icon}</Text>
          <Text style={styles.choiceLabel}>{currentRound.optionB.label}</Text>
          <View style={styles.chooseTap}>
            <Text style={styles.chooseTapText}>Pick this</Text>
          </View>
        </TouchableOpacity>
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
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  dot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  dotDone: {
    backgroundColor: '#0D7844',
  },
  dotActive: {
    backgroundColor: '#10B981',
  },
  questionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 10,
  },
  choicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  choiceIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  choiceLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  chooseTap: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  chooseTapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },
  orDivider: {
    paddingHorizontal: 2,
  },
  orText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
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
    marginBottom: 12,
  },
  matchScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
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
