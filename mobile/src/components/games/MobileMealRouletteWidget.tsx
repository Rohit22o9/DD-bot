import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
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
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
  cuisine: string;
  color: string;
}

const WHEEL_DIAMETER = 240;
const WHEEL_RADIUS = WHEEL_DIAMETER / 2;

const CATEGORIES: RouletteCategory[] = [
  {
    id: 'indian',
    label: 'North Indian Spice',
    shortLabel: 'INDIAN',
    emoji: '🇮🇳',
    cuisine: 'North Indian',
    color: '#DC2626', // Crimson Red
  },
  {
    id: 'chinese',
    label: 'Chinese Wok Drops',
    shortLabel: 'CHINESE',
    emoji: '🇨🇳',
    cuisine: 'Chinese',
    color: '#D97706', // Golden Amber
  },
  {
    id: 'korean',
    label: 'Korean Street Food',
    shortLabel: 'KOREAN',
    emoji: '🇰🇷',
    cuisine: 'Korean',
    color: '#7C3AED', // Deep Violet
  },
  {
    id: 'japanese',
    label: 'Japanese Ramen & Don',
    shortLabel: 'JAPANESE',
    emoji: '🇯🇵',
    cuisine: 'Japanese',
    color: '#2563EB', // Cobalt Blue
  },
  {
    id: 'italian',
    label: 'Italian Fresh Pasta',
    shortLabel: 'ITALIAN',
    emoji: '🇮🇹',
    cuisine: 'Italian',
    color: '#059669', // Emerald Green
  },
  {
    id: 'malaysian',
    label: 'Malaysian Comfort',
    shortLabel: 'MALAYSIAN',
    emoji: '🇲🇾',
    cuisine: 'Malaysian',
    color: '#DB2777', // Vibrant Pink
  },
];

const NUM_SLICES = CATEGORIES.length;
const SLICE_ANGLE = 360 / NUM_SLICES; // 60 deg

export const MobileMealRouletteWidget: React.FC<MobileMealRouletteWidgetProps> = ({
  onAddToCart,
  onSpinAgain,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RouletteCategory>(CATEGORIES[0]);
  const [matchedMeals, setMatchedMeals] = useState<Meal[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Wheel rotation animation value
  const wheelRotationAnim = useRef(new Animated.Value(0)).current;
  const currentAngleRef = useRef(0);

  // Winning option pop-up scale animation
  const popAnim = useRef(new Animated.Value(0)).current;

  // Pointer tick wobble animation
  const pointerAnim = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasLanded(false);
    popAnim.setValue(0);

    // Pick a random destination category
    const targetIdx = Math.floor(Math.random() * CATEGORIES.length);
    const targetCat = CATEGORIES[targetIdx];

    // Math for wheel alignment:
    // Slice 0 is at 0° (top). Slice k is at k * 60°.
    // To align Slice k with the top arrow (0°), wheel must rotate clockwise by:
    // (360 - (k * 60)) % 360.
    // We add 5 full rotations (1800°) for realistic momentum.
    const baseSpins = 5 * 360; // 1800°
    const offsetToArrow = (360 - (targetIdx * SLICE_ANGLE)) % 360;
    const nextTotalAngle = currentAngleRef.current + baseSpins + offsetToArrow - (currentAngleRef.current % 360);

    // Pointer tick wobble during spin
    Animated.loop(
      Animated.sequence([
        Animated.timing(pointerAnim, {
          toValue: -8,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(pointerAnim, {
          toValue: 4,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(pointerAnim, {
          toValue: 0,
          duration: 70,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 14 }
    ).start();

    // Spin wheel with smooth deceleration (easing cubic out)
    Animated.timing(wheelRotationAnim, {
      toValue: nextTotalAngle,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      currentAngleRef.current = nextTotalAngle;
      setSelectedCategory(targetCat);
      setIsSpinning(false);

      // Find real matching meals for this cuisine
      const dishes = REAL_DAILY_DROP_MEALS.filter(
        (m) =>
          m.cuisine.toLowerCase().includes(targetCat.cuisine.toLowerCase()) ||
          targetCat.cuisine.toLowerCase().includes(m.cuisine.toLowerCase())
      );
      const pickedDishes = dishes.length > 0
        ? [...dishes].sort(() => Math.random() - 0.5).slice(0, 2)
        : [REAL_DAILY_DROP_MEALS[0]];
      setMatchedMeals(pickedDishes);

      // Trigger pop-up bounce animation on the selected option!
      Animated.sequence([
        Animated.spring(popAnim, {
          toValue: 1.16,
          friction: 4,
          tension: 110,
          useNativeDriver: true,
        }),
        Animated.spring(popAnim, {
          toValue: 1.0,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After pop animation settles, reveal the chef-picked dishes
        setTimeout(() => {
          setHasLanded(true);
          setShowCelebration(true);
          onSpinAgain?.();
        }, 350);
      });
    });
  };

  const wheelRotationInterpolate = wheelRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const pointerWobbleInterpolate = pointerAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* ROTATING CIRCULAR WHEEL ARENA */}
      <View style={styles.wheelArena}>
        {/* Top Indicator Arrow Needle pointing DOWN at winning wedge */}
        <Animated.View
          style={[
            styles.pointerContainer,
            { transform: [{ rotate: pointerWobbleInterpolate }] },
          ]}
        >
          <View style={styles.pointerTriangle} />
          <View style={styles.pointerCircle} />
        </Animated.View>

        {/* Outer Golden Studded Ring */}
        <View style={styles.wheelOuterRing}>
          {/* Rotating Wheel Disc */}
          <Animated.View
            style={[
              styles.wheelDisc,
              { transform: [{ rotate: wheelRotationInterpolate }] },
            ]}
          >
            {/* 6 Triangular Sectors */}
            {CATEGORIES.map((cat, idx) => {
              const rotation = idx * SLICE_ANGLE;
              return (
                <View
                  key={cat.id}
                  style={[
                    styles.sliceWrapper,
                    { transform: [{ rotate: `${rotation}deg` }] },
                  ]}
                >
                  {/* Colored Triangle Wedge */}
                  <View
                    style={[
                      styles.sliceTriangle,
                      { borderTopColor: cat.color },
                    ]}
                  />

                  {/* Wedge Content (Emoji + Cuisine Label) */}
                  <View style={styles.sliceContent}>
                    <Text style={styles.sliceEmoji}>{cat.emoji}</Text>
                    <Text style={styles.sliceLabel}>{cat.shortLabel}</Text>
                  </View>
                </View>
              );
            })}

            {/* Golden Center Hub */}
            <View style={styles.centerHub}>
              <View style={styles.centerHubInner}>
                <Text style={styles.centerHubEmoji}>🎲</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Winning Selection Pop-Up Animation */}
      <Animated.View
        style={[
          styles.popHighlightContainer,
          {
            transform: [{ scale: popAnim }],
            opacity: popAnim.interpolate({
              inputRange: [0, 0.1, 1],
              outputRange: [0, 1, 1],
            }),
          },
        ]}
      >
        <View style={styles.popHighlightCard}>
          <Text style={styles.popHighlightEmoji}>{selectedCategory.emoji}</Text>
          <View style={styles.popHighlightTextCol}>
            <View style={styles.popTagRow}>
              <Text style={styles.popBadge}>🎯 LANDED ON ARROW</Text>
            </View>
            <Text style={styles.popHighlightTitle}>
              {selectedCategory.label.toUpperCase()}
            </Text>
            <Text style={styles.popHighlightSub}>
              Cuisine unlocked! Curating dishes...
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Spin Button */}
      {!hasLanded && (
        <TouchableOpacity
          style={[styles.spinBtn, isSpinning && styles.spinBtnDisabled]}
          activeOpacity={0.8}
          disabled={isSpinning}
          onPress={handleSpin}
        >
          <Text style={styles.spinBtnText}>
            {isSpinning ? '🎡 SPINNING THE WHEEL...' : '🎡 SPIN THE WHEEL'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Landed Outcome (Dishes revealed after pop animation) */}
      {hasLanded && (
        <View style={styles.landedSection}>
          <View style={styles.congratsBanner}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.congratsTitle}>
                Tonight you're having {selectedCategory.label}!
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
                    {meal.restaurantName} · {meal.cuisine}
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

          <TouchableOpacity
            style={styles.spinAgainBtn}
            disabled={isSpinning}
            onPress={handleSpin}
          >
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
        subtitle={`The wheel stopped on ${selectedCategory.label}!`}
        selectedPreferences={[
          { icon: selectedCategory.emoji, label: selectedCategory.cuisine },
          { icon: '🎯', label: 'Roulette Pick' },
        ]}
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
    marginBottom: 10,
  },

  // Wheel Arena
  wheelArena: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
    height: WHEEL_DIAMETER + 20,
  },
  pointerContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 99,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 8,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderTopWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#B91C1C', // Deep red arrow
  },
  pointerCircle: {
    position: 'absolute',
    top: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  wheelOuterRing: {
    width: WHEEL_DIAMETER + 14,
    height: WHEEL_DIAMETER + 14,
    borderRadius: (WHEEL_DIAMETER + 14) / 2,
    backgroundColor: '#1E293B',
    borderWidth: 5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 7,
  },
  wheelDisc: {
    width: WHEEL_DIAMETER,
    height: WHEEL_DIAMETER,
    borderRadius: WHEEL_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  sliceWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WHEEL_DIAMETER,
    height: WHEEL_DIAMETER,
    alignItems: 'center',
  },
  sliceTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 70,
    borderRightWidth: 70,
    borderTopWidth: WHEEL_RADIUS,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  sliceContent: {
    position: 'absolute',
    top: 14,
    alignItems: 'center',
    width: 70,
  },
  sliceEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  sliceLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  centerHub: {
    position: 'absolute',
    top: WHEEL_RADIUS - 28,
    left: WHEEL_RADIUS - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  centerHubInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHubEmoji: {
    fontSize: 20,
  },

  // Pop-Up Highlight Animation Card
  popHighlightContainer: {
    marginVertical: 8,
  },
  popHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  popHighlightEmoji: {
    fontSize: 34,
    marginRight: 12,
  },
  popHighlightTextCol: {
    flex: 1,
  },
  popTagRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  popBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popHighlightTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4C1D95',
    letterSpacing: 0.3,
  },
  popHighlightSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },

  spinBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 4,
  },
  spinBtnDisabled: {
    opacity: 0.7,
  },
  spinBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Landed outcome
  landedSection: {
    marginTop: 8,
  },
  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  congratsEmoji: {
    fontSize: 22,
  },
  congratsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  congratsSub: {
    fontSize: 11,
    color: '#4B5563',
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
