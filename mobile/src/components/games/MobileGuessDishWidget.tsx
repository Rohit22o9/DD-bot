import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';

interface MobileGuessDishWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

interface TriviaQuestion {
  targetMeal: Meal;
  clues: string[];
  options: string[];
  correctAnswer: string;
}

// Helper to build a dynamic trivia challenge from real meals
function generateTriviaChallenge(excludeId?: string): TriviaQuestion {
  const pool = REAL_DAILY_DROP_MEALS.filter(
    (m) => m.category === 'main' && m.id !== excludeId
  );
  const randomIndex = Math.floor(Math.random() * pool.length);
  const target = pool[randomIndex] || REAL_DAILY_DROP_MEALS[0];

  // Build authentic clues based on real data
  const flagEmoji =
    target.cuisine === 'Chinese'
      ? '🇨🇳'
      : target.cuisine === 'North Indian' || target.cuisine === 'Indian' || target.cuisine === 'Punjabi'
      ? '🇮🇳'
      : target.cuisine === 'Korean'
      ? '🇰🇷'
      : target.cuisine === 'Japanese'
      ? '🇯🇵'
      : target.cuisine === 'Italian'
      ? '🇮🇹'
      : target.cuisine === 'Malaysian'
      ? '🇲🇾'
      : '🍽️';

  const clue1 = `Clue 1: ${flagEmoji} Authentic ${target.cuisine} culinary tradition`;
  const ings = target.ingredients && target.ingredients.length > 0
    ? target.ingredients.slice(0, 3).join(', ')
    : 'Fresh chef-selected pantry essentials';
  const clue2 = `Clue 2: 🥘 Key ingredients include ${ings}`;
  const dietTag = target.dietaryTags && target.dietaryTags[0] ? target.dietaryTags[0] : 'Fresh Drop';
  const clue3 = `Clue 3: ✨ ${dietTag} · ${target.calories} kcal · ${target.spicyLevel > 0 ? '🌶️ Spicy kick' : '🌱 Mild & savory'}`;

  // Select 2 real distractors
  const distractors: string[] = [];
  const otherMeals = REAL_DAILY_DROP_MEALS.filter((m) => m.id !== target.id);
  while (distractors.length < 2 && otherMeals.length > 0) {
    const pick = otherMeals[Math.floor(Math.random() * otherMeals.length)];
    if (!distractors.includes(pick.name) && pick.name !== target.name) {
      distractors.push(pick.name);
    }
  }

  // Shuffle options
  const options = [target.name, ...distractors].sort(() => Math.random() - 0.5);

  return {
    targetMeal: target,
    clues: [clue1, clue2, clue3],
    options,
    correctAnswer: target.name,
  };
}

export const MobileGuessDishWidget: React.FC<MobileGuessDishWidgetProps> = ({
  onAddToCart,
}) => {
  // Generate a trivia challenge dynamically from the real 136 meals
  const [challenge, setChallenge] = useState<TriviaQuestion>(() =>
    generateTriviaChallenge()
  );

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const isCorrect = selectedAnswer === challenge.correctAnswer;
  const meal = challenge.targetMeal;

  // STRICT SINGLE-ATTEMPT LOGIC:
  // Once an option is clicked, the attempt is locked. No re-selecting.
  const handlePickOption = (opt: string) => {
    if (hasAttempted) return; // Prevent any further clicking
    setSelectedAnswer(opt);
    setHasAttempted(true);
    setSessionCompleted(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🕵️</Text>
          <View>
            <Text style={styles.headerTitle}>Guess the Dish</Text>
            <Text style={styles.sessionStatus}>1 ATTEMPT PER CHALLENGE</Text>
          </View>
        </View>
        <View style={styles.challengeBadge}>
          <Text style={styles.challengeBadgeText}>Daily Trivia</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Can you identify today's real Daily Drop mystery dish from the clues?
      </Text>

      {/* Clues Box */}
      <View style={styles.cluesBox}>
        {challenge.clues.map((clue, idx) => (
          <View key={idx} style={styles.clueRow}>
            <Text style={styles.clueBullet}>🔍</Text>
            <Text style={styles.clueText}>{clue}</Text>
          </View>
        ))}
      </View>

      {/* Multiple Choice Options (Only active before guessing) */}
      {!hasAttempted ? (
        <View style={styles.optionsCol}>
          <Text style={styles.promptLabel}>Select your one guess below:</Text>
          {challenge.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionBtn}
              activeOpacity={0.8}
              onPress={() => handlePickOption(opt)}
            >
              <View style={styles.radioDot} />
              <Text style={styles.optionBtnText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        /* Single-Attempt Outcome Section */
        <View style={styles.outcomeSection}>
          {isCorrect ? (
            <View style={styles.correctBanner}>
              <Text style={styles.bannerEmoji}>🎉</Text>
              <View style={styles.bannerTextCol}>
                <Text style={styles.correctTitle}>
                  Spot on! It's {challenge.correctAnswer}!
                </Text>
                <Text style={styles.correctSub}>
                  You know your culinary recipes! +50 Foodie XP unlocked.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.incorrectBanner}>
              <Text style={styles.bannerEmoji}>😅</Text>
              <View style={styles.bannerTextCol}>
                <Text style={styles.incorrectTitle}>
                  Nice try! The dish was {challenge.correctAnswer}
                </Text>
                <Text style={styles.incorrectSub}>
                  You guessed "{selectedAnswer}". Check out the real dish below:
                </Text>
              </View>
            </View>
          )}

          {/* Real Revealed Meal Card */}
          <View style={styles.dishCard}>
            <MobileMealImage
              uri={meal.imageUrl}
              style={styles.dishImage}
              dishName={meal.name}
            />
            <View style={styles.dishBody}>
              <View style={styles.dishRow}>
                <Text style={styles.dishName}>{meal.name}</Text>
                <Text style={styles.dishPrice}>${meal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.dishRest}>
                {meal.restaurantName} · {meal.cuisine}
              </Text>
              <Text style={styles.dishDesc} numberOfLines={2}>
                {meal.description}
              </Text>

              {/* Nutrition Pill */}
              <View style={styles.macroPillRow}>
                <Text style={styles.macroPillText}>
                  🔥 {meal.calories} kcal · 💪 {meal.proteinGrams || 22}g protein
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addCartBtn}
                activeOpacity={0.8}
                onPress={() => onAddToCart(meal.id)}
              >
                <Text style={styles.addCartText}>
                  🛒 Add to cart — ${meal.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Locked Status Notice - No retrying the same question */}
          <View style={styles.lockedNotice}>
            <Text style={styles.lockIcon}>🔒</Text>
            <View style={styles.lockedTextCol}>
              <Text style={styles.lockedTitle}>Challenge Finished (1-Attempt Only)</Text>
              <Text style={styles.lockedSub}>
                To keep the trivia fair, you cannot re-guess the same dish.
              </Text>
            </View>
          </View>

          {/* Play a brand new mystery dish (completely different meal) */}
          <TouchableOpacity
            style={styles.nextDishBtn}
            activeOpacity={0.8}
            onPress={() => {
              setChallenge(generateTriviaChallenge(meal.id));
              setSelectedAnswer(null);
              setHasAttempted(false);
              setSessionCompleted(false);
            }}
          >
            <Text style={styles.nextDishText}>
              ✨ Play Next Mystery Dish (New Question)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sessionStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0D7844',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  challengeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  challengeBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 18,
  },
  cluesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  clueBullet: {
    fontSize: 13,
    marginRight: 8,
    marginTop: 1,
  },
  clueText: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    fontWeight: '500',
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsCol: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#94A3B8',
    marginRight: 10,
  },
  optionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  outcomeSection: {
    marginTop: 4,
  },
  correctBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  incorrectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  bannerEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  bannerTextCol: {
    flex: 1,
  },
  correctTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  correctSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  incorrectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  incorrectSub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  dishImage: {
    width: '100%',
    height: 160,
  },
  dishBody: {
    padding: 12,
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  dishRest: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  dishDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  macroPillRow: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  macroPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  addCartBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addCartText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  lockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  lockedTextCol: {
    flex: 1,
  },
  lockedTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  lockedSub: {
    fontSize: 10,
    color: '#64748B',
  },
  nextDishBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  nextDishText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});
