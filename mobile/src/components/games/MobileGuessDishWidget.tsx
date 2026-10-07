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

interface MobileGuessDishWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

interface TriviaChallenge {
  clues: string[];
  options: string[];
  correctAnswer: string;
  mealId: string;
}

const TRIVIA: TriviaChallenge = {
  clues: [
    'Clue 1: 🇳🇬 West African culinary heritage',
    'Clue 2: 🍚 Fragrant, slow-simmered rice',
    'Clue 3: 🍅 Smoky tomato, scotch bonnet & peppers',
  ],
  options: ['Jollof Rice', 'Fried Rice', 'Chicken Biryani'],
  correctAnswer: 'Jollof Rice',
  mealId: 'meal_jollof_chicken',
};

export const MobileGuessDishWidget: React.FC<MobileGuessDishWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const matchedMeal: Meal =
    MOCK_MOBILE_MEALS.find((m) => m.id === TRIVIA.mealId) || MOCK_MOBILE_MEALS[6];

  const handlePickOption = (opt: string) => {
    setSelectedAnswer(opt);
    setIsCorrect(opt === TRIVIA.correctAnswer);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsCorrect(false);
    onPlayAgain?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🕵️</Text>
          <Text style={styles.headerTitle}>Guess the Dish</Text>
        </View>
        <Text style={styles.challengeBadge}>Daily Food Trivia</Text>
      </View>

      <Text style={styles.subtitle}>Can you guess today's mystery culinary creation?</Text>

      {/* Clues Box */}
      <View style={styles.cluesBox}>
        {TRIVIA.clues.map((clue, idx) => (
          <View key={idx} style={styles.clueRow}>
            <Text style={styles.clueBullet}>🔍</Text>
            <Text style={styles.clueText}>{clue}</Text>
          </View>
        ))}
      </View>

      {/* Multiple Choice Buttons */}
      {!selectedAnswer ? (
        <View style={styles.optionsCol}>
          {TRIVIA.options.map((opt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionBtn}
              activeOpacity={0.8}
              onPress={() => handlePickOption(opt)}
            >
              <Text style={styles.optionBtnText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.outcomeSection}>
          {isCorrect ? (
            <View style={styles.correctBanner}>
              <Text style={styles.bannerEmoji}>🎉</Text>
              <View>
                <Text style={styles.correctTitle}>Spot on! It's {TRIVIA.correctAnswer}!</Text>
                <Text style={styles.correctSub}>You know your global comfort food!</Text>
              </View>
            </View>
          ) : (
            <View style={styles.incorrectBanner}>
              <Text style={styles.bannerEmoji}>😅</Text>
              <View>
                <Text style={styles.incorrectTitle}>Close, but it's {TRIVIA.correctAnswer}!</Text>
                <Text style={styles.incorrectSub}>A West African legend of spices.</Text>
              </View>
            </View>
          )}

          {/* Dish Card */}
          <View style={styles.dishCard}>
            <MobileMealImage
              uri={matchedMeal.imageUrl}
              style={styles.dishImage}
              dishName={matchedMeal.name}
            />
            <View style={styles.dishBody}>
              <View style={styles.dishRow}>
                <Text style={styles.dishName}>{matchedMeal.name}</Text>
                <Text style={styles.dishPrice}>${matchedMeal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.dishRest}>{matchedMeal.restaurantName}</Text>
              <Text style={styles.dishDesc} numberOfLines={2}>
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

          <TouchableOpacity style={styles.tryAnotherBtn} onPress={handleReset}>
            <Text style={styles.tryAnotherText}>🔄 Try again</Text>
          </TouchableOpacity>
        </View>
      )}
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
  challengeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  cluesBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clueBullet: {
    fontSize: 12,
  },
  clueText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  optionsCol: {
    gap: 8,
  },
  optionBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  optionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  // Outcome
  outcomeSection: {
    marginTop: 4,
  },
  correctBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  incorrectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  bannerEmoji: {
    fontSize: 22,
  },
  correctTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  correctSub: {
    fontSize: 11,
    color: '#047857',
  },
  incorrectTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  incorrectSub: {
    fontSize: 11,
    color: '#B91C1C',
  },
  dishCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  dishImage: {
    width: '100%',
    height: 140,
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
    color: '#111827',
    flex: 1,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  dishRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  dishDesc: {
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
  tryAnotherBtn: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  tryAnotherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
