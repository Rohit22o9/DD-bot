import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

interface MobileMealRouletteWidgetProps {
  onAddToCart: (mealId: string) => void;
  onSpinAgain?: () => void;
}

interface RouletteCategory {
  label: string;
  emoji: string;
  cuisine: string;
}

const CATEGORIES: RouletteCategory[] = [
  { label: 'North Indian Spice', emoji: '🇮🇳', cuisine: 'North Indian' },
  { label: 'Chinese Wok Drops', emoji: '🇨🇳', cuisine: 'Chinese' },
  { label: 'Korean Street Food', emoji: '🇰🇷', cuisine: 'Korean' },
  { label: 'Japanese Ramen & Don', emoji: '🇯🇵', cuisine: 'Japanese' },
  { label: 'Italian Fresh Pasta', emoji: '🇮🇹', cuisine: 'Italian' },
  { label: 'Malaysian Comfort', emoji: '🇲🇾', cuisine: 'Malaysian' },
];

export const MobileMealRouletteWidget: React.FC<MobileMealRouletteWidgetProps> = ({
  onAddToCart,
  onSpinAgain,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [matchedMeals, setMatchedMeals] = useState<Meal[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const spinAnimation = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasLanded(false);

    // Pick a random destination
    const targetIdx = Math.floor(Math.random() * CATEGORIES.length);
    let current = 0;
    const totalTicks = 18 + targetIdx; // spin through multiple rounds
    let speed = 60; // start fast

    const tick = () => {
      current++;
      setSelectedIndex(current % CATEGORIES.length);

      if (current < totalTicks) {
        if (current > totalTicks - 6) {
          speed += 50; // decelerate smoothly
        }
        setTimeout(tick, speed);
      } else {
        // Landed!
        const finalCategory = CATEGORIES[targetIdx];
        const dishes = REAL_DAILY_DROP_MEALS.filter(
          (m) =>
            m.cuisine.toLowerCase().includes(finalCategory.cuisine.toLowerCase()) ||
            finalCategory.cuisine.toLowerCase().includes(m.cuisine.toLowerCase())
        );
        setMatchedMeals(
          dishes.length > 0
            ? [...dishes].sort(() => Math.random() - 0.5).slice(0, 2)
            : [REAL_DAILY_DROP_MEALS[0]]
        );
        setIsSpinning(false);
        setHasLanded(true);
        setShowCelebration(true);
        onSpinAgain?.();
      }
    };

    setTimeout(tick, speed);
  };

  const currentCategory = CATEGORIES[selectedIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🎲</Text>
          <Text style={styles.headerTitle}>Meal Roulette</Text>
        </View>
        <Text style={styles.luckBadge}>Feeling lucky?</Text>
      </View>

      <Text style={styles.subtitle}>
        Can't decide? Let the roulette decide tonight's flavour journey!
      </Text>

      {/* Rotating Slot Display */}
      <View style={[styles.wheelBox, isSpinning && styles.wheelBoxSpinning]}>
        <Text style={styles.wheelEmoji}>{currentCategory.emoji}</Text>
        <Text style={styles.wheelLabel}>{currentCategory.label.toUpperCase()}</Text>
        {isSpinning && <Text style={styles.spinningTicker}>Spinning the wheel...</Text>}
      </View>

      {/* Spin Button */}
      {!hasLanded && (
        <TouchableOpacity
          style={[styles.spinBtn, isSpinning && styles.spinBtnDisabled]}
          activeOpacity={0.8}
          disabled={isSpinning}
          onPress={handleSpin}
        >
          <Text style={styles.spinBtnText}>
            {isSpinning ? '🎡 SPINNING...' : '🎡 SPIN THE WHEEL'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Landed Outcome */}
      {hasLanded && (
        <View style={styles.landedSection}>
          <View style={styles.congratsBanner}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <View>
              <Text style={styles.congratsTitle}>
                Tonight you're having {currentCategory.label}!
              </Text>
              <Text style={styles.congratsSub}>Here are top chef-picked dishes:</Text>
            </View>
          </View>

          {/* Curated Dishes */}
          <View style={styles.dishesList}>
            {matchedMeals.map((meal) => (
              <View key={meal.id} style={styles.dishCard}>
                <MobileMealImage
                  uri={meal.imageUrl}
                  style={styles.dishImage}
                  dishName={meal.name}
                />
                <View style={styles.dishContent}>
                  <View style={styles.dishRow}>
                    <Text style={styles.dishName} numberOfLines={1}>
                      {meal.name}
                    </Text>
                    <Text style={styles.dishPrice}>${meal.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.dishRest} numberOfLines={1}>
                    {meal.restaurantName}
                  </Text>
                  <TouchableOpacity
                    style={styles.addMiniBtn}
                    activeOpacity={0.8}
                    onPress={() => onAddToCart(meal.id)}
                  >
                    <Text style={styles.addMiniBtnText}>+ Add to cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.spinAgainBtn} onPress={handleSpin}>
            <Text style={styles.spinAgainText}>🎲 Spin again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Celebratory Pop-up with Falling Confetti Bars */}
      <MobileCelebrationModal
        visible={showCelebration}
        meal={matchedMeals[0] || null}
        onClose={() => setShowCelebration(false)}
        onAddToCart={(mealId) => {
          setShowCelebration(false);
          onAddToCart(mealId);
        }}
        title="ROULETTE JACKPOT! 🎲"
        subtitle={`The wheel selected delicious ${currentCategory.label}!`}
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
  luckBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  wheelBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  wheelBoxSpinning: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  wheelEmoji: {
    fontSize: 42,
    marginBottom: 6,
  },
  wheelLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.5,
  },
  spinningTicker: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    marginTop: 4,
  },
  spinBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  spinBtnDisabled: {
    opacity: 0.7,
  },
  spinBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Landed outcome
  landedSection: {
    marginTop: 4,
  },
  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F3FF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  congratsEmoji: {
    fontSize: 22,
  },
  congratsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B21B6',
  },
  congratsSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  dishesList: {
    gap: 8,
    marginBottom: 10,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dishImage: {
    width: 80,
    height: 80,
  },
  dishContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  dishPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 6,
  },
  dishRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  addMiniBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addMiniBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  spinAgainBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  spinAgainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
