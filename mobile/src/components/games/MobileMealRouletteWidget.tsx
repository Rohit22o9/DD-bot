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
  countryName: string;
  emoji: string;
  cuisine: string;
  color: string;
}

const WHEEL_DIAMETER = 240;
const WHEEL_RADIUS = WHEEL_DIAMETER / 2;

const CATEGORIES: RouletteCategory[] = [
  {
    id: 'indian',
    label: 'Indian Specialties',
    countryName: 'India',
    emoji: '🇮🇳',
    cuisine: 'Indian',
    color: '#DC2626', // Crimson Red
  },
  {
    id: 'australian',
    label: 'Australian Classics',
    countryName: 'Australia',
    emoji: '🇦🇺',
    cuisine: 'Australian',
    color: '#0D9488', // Aussie Teal
  },
  {
    id: 'african',
    label: 'African Spiced Kitchen',
    countryName: 'Africa',
    emoji: '🌍',
    cuisine: 'African',
    color: '#D97706', // Warm Amber
  },
  {
    id: 'chinese',
    label: 'Chinese Wok Drops',
    countryName: 'China',
    emoji: '🇨🇳',
    cuisine: 'Chinese',
    color: '#B91C1C', // Imperial Red
  },
  {
    id: 'malaysian',
    label: 'Malaysian Delights',
    countryName: 'Malaysia',
    emoji: '🇲🇾',
    cuisine: 'Malaysian',
    color: '#DB2777', // Hibiscus Pink
  },
  {
    id: 'singaporean',
    label: 'Singaporean Street Eats',
    countryName: 'Singapore',
    emoji: '🇸🇬',
    cuisine: 'Singaporean',
    color: '#E11D48', // Vibrant Rose
  },
  {
    id: 'indonesian',
    label: 'Indonesian Flavours',
    countryName: 'Indonesia',
    emoji: '🇮🇩',
    cuisine: 'Indonesian',
    color: '#EA580C', // Terracotta Orange
  },
  {
    id: 'vietnamese',
    label: 'Vietnamese Fresh Drops',
    countryName: 'Vietnam',
    emoji: '🇻🇳',
    cuisine: 'Vietnamese',
    color: '#16A34A', // Fresh Herb Green
  },
  {
    id: 'philippines',
    label: 'Filipino Comfort Kitchen',
    countryName: 'Philippines',
    emoji: '🇵🇭',
    cuisine: 'Filipino',
    color: '#2563EB', // Sapphire Blue
  },
  {
    id: 'japanese',
    label: 'Japanese Ramen & Don',
    countryName: 'Japan',
    emoji: '🇯🇵',
    cuisine: 'Japanese',
    color: '#9333EA', // Kyoto Purple
  },
  {
    id: 'thai',
    label: 'Thai Street Curries',
    countryName: 'Thailand',
    emoji: '🇹🇭',
    cuisine: 'Thai',
    color: '#0891B2', // Andaman Cyan
  },
];

const NUM_SLICES = CATEGORIES.length;
const SLICE_ANGLE = 360 / NUM_SLICES; // ~32.72 deg

export const MobileMealRouletteWidget: React.FC<MobileMealRouletteWidgetProps> = ({
  onAddToCart,
  onSpinAgain,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSlicePopped, setIsSlicePopped] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RouletteCategory>(CATEGORIES[0]);
  const [matchedMeals, setMatchedMeals] = useState<Meal[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Wheel rotation animation value
  const wheelRotationAnim = useRef(new Animated.Value(0)).current;
  const currentAngleRef = useRef(0);

  // Pop-up animation for the winning slice of the wheel
  const slicePopAnim = useRef(new Animated.Value(0)).current;

  // Center country name pop-up animation
  const centerPopupAnim = useRef(new Animated.Value(0)).current;

  // Pointer tick wobble animation
  const pointerAnim = useRef(new Animated.Value(0)).current;

  // Meals fade-in animation
  const mealsFadeAnim = useRef(new Animated.Value(0)).current;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsSlicePopped(false);
    setHasLanded(false);
    slicePopAnim.setValue(0);
    centerPopupAnim.setValue(0);
    mealsFadeAnim.setValue(0);

    // Pick a random destination category
    const targetIdx = Math.floor(Math.random() * CATEGORIES.length);
    const targetCat = CATEGORIES[targetIdx];

    // Math for wheel alignment:
    // 7 full rotations (2520°) for high-speed momentum and extended deceleration
    const baseSpins = 7 * 360;
    const offsetToArrow = (360 - (targetIdx * SLICE_ANGLE)) % 360;
    const nextTotalAngle = currentAngleRef.current + baseSpins + offsetToArrow - (currentAngleRef.current % 360);

    // Pointer tick wobble during spin with prolonged duration
    Animated.loop(
      Animated.sequence([
        Animated.timing(pointerAnim, {
          toValue: -10,
          duration: 65,
          useNativeDriver: true,
        }),
        Animated.timing(pointerAnim, {
          toValue: 5,
          duration: 65,
          useNativeDriver: true,
        }),
        Animated.timing(pointerAnim, {
          toValue: 0,
          duration: 65,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 26 } // Sync with 5.2s total spin time
    ).start();

    // 1. Spin the wheel with dramatic physics deceleration curve (fast start, gradual suspenseful slowdown)
    Animated.timing(wheelRotationAnim, {
      toValue: nextTotalAngle,
      duration: 5200,
      easing: Easing.bezier(0.12, 0.85, 0.2, 1), // Realistic casino roulette deceleration curve
      useNativeDriver: true,
    }).start(() => {
      pointerAnim.setValue(0);
      currentAngleRef.current = nextTotalAngle;
      setSelectedCategory(targetCat);
      setIsSpinning(false);

      // Find real matching meals for this country / cuisine
      const dishes = REAL_DAILY_DROP_MEALS.filter((m) => {
        const cLower = m.cuisine.toLowerCase();
        const nLower = m.name.toLowerCase();
        const dLower = m.description.toLowerCase();
        switch (targetCat.id) {
          case 'indian':
            return /indian|curry|dal|biryani|paneer|tandoori/i.test(cLower + nLower + dLower);
          case 'australian':
            return /australian|aussie|burger|steak|salad|salmon/i.test(cLower + nLower + dLower);
          case 'african':
            return /african|jollof|stew|spiced/i.test(cLower + nLower + dLower);
          case 'chinese':
            return /chinese|wok|fried rice|dumpling|sichuan/i.test(cLower + nLower + dLower);
          case 'malaysian':
            return /malaysian|laksa|rendang|satay|nasi/i.test(cLower + nLower + dLower);
          case 'singaporean':
            return /singaporean|noodle|rice|roti/i.test(cLower + nLower + dLower);
          case 'indonesian':
            return /indonesian|bali|satay|goreng|gado/i.test(cLower + nLower + dLower);
          case 'vietnamese':
            return /vietnamese|pho|roll|banh|vermicelli/i.test(cLower + nLower + dLower);
          case 'philippines':
            return /filipino|philippines|adobo|rice|stew/i.test(cLower + nLower + dLower);
          case 'japanese':
            return /japanese|ramen|teriyaki|miso|don/i.test(cLower + nLower + dLower);
          case 'thai':
            return /thai|pad thai|green curry|tom yum/i.test(cLower + nLower + dLower);
          default:
            return cLower.includes(targetCat.cuisine.toLowerCase());
        }
      });
      const pickedDishes = dishes.length > 0
        ? [...dishes].sort(() => Math.random() - 0.5).slice(0, 2)
        : [REAL_DAILY_DROP_MEALS[Math.floor(Math.random() * REAL_DAILY_DROP_MEALS.length)]];
      setMatchedMeals(pickedDishes);

      // 2. POP UP that specific country in the center of the wheel!
      setIsSlicePopped(true);
      centerPopupAnim.setValue(0);
      Animated.parallel([
        Animated.spring(centerPopupAnim, {
          toValue: 1,
          friction: 4,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.spring(slicePopAnim, {
          toValue: 1.15,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 3. AND THEN open/reveal the meals accordingly!
        setTimeout(() => {
          setHasLanded(true);
          Animated.timing(mealsFadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }).start(() => {
            setShowCelebration(true);
            onSpinAgain?.();
          });
        }, 1100);
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
        {/* Top Indicator Arrow Needle pointing DOWN at winning wedge (Hidden when slice pops up so it never covers the popped slice) */}
        {!isSlicePopped && (
          <Animated.View
            style={[
              styles.pointerContainer,
              { transform: [{ rotate: pointerWobbleInterpolate }] },
            ]}
          >
            <View style={styles.pointerTriangle} />
            <View style={styles.pointerCircle} />
          </Animated.View>
        )}

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

                  {/* Wedge Content (Flag Emoji ONLY — Country Name Removed from Slices) */}
                  <View style={styles.sliceContent}>
                    <Text style={styles.sliceEmoji}>{cat.emoji}</Text>
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

          {/* CENTER COUNTRY POP-UP: Shows Country Name in center of wheel when selected */}
          {isSlicePopped && (
            <Animated.View
              style={[
                styles.centerPopupOverlay,
                {
                  transform: [
                    {
                      scale: centerPopupAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                      }),
                    },
                  ],
                  opacity: centerPopupAnim,
                },
              ]}
              pointerEvents="none"
            >
              <View style={styles.centerCountryCard}>
                <Text style={styles.centerCountryFlag}>{selectedCategory.emoji}</Text>
                <Text style={styles.centerCountryName}>
                  {selectedCategory.countryName.toUpperCase()}
                </Text>
                <View style={styles.centerCountryBadge}>
                  <Text style={styles.centerCountryBadgeText}>SELECTED 🎯</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
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
            {isSpinning ? '🎡 SPINNING THE WHEEL...' : '🎡 SPIN THE WHEEL'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Landed Outcome (Opens smoothly AFTER the wheel slice pops up) */}
      {hasLanded && (
        <Animated.View
          style={[
            styles.landedSection,
            {
              opacity: mealsFadeAnim,
              transform: [
                {
                  translateY: mealsFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
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

                  {/* Roomy, Prominent Add to Cart Button */}
                  <TouchableOpacity
                    style={styles.addCartBtn}
                    activeOpacity={0.8}
                    onPress={() => onAddToCart(meal.id)}
                  >
                    <Text style={styles.addCartBtnIcon}>🛒</Text>
                    <Text style={styles.addCartBtnText}>Add to cart</Text>
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
        </Animated.View>
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
    height: WHEEL_DIAMETER + 24,
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
    borderLeftWidth: 38,
    borderRightWidth: 38,
    borderTopWidth: WHEEL_RADIUS,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  sliceContent: {
    position: 'absolute',
    top: 14,
    alignItems: 'center',
    width: 44,
  },
  sliceEmoji: {
    fontSize: 22,
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

  // Center Country Pop-up in Wheel Hub
  centerPopupOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  centerCountryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    minWidth: 120,
  },
  centerCountryFlag: {
    fontSize: 32,
    marginBottom: 4,
  },
  centerCountryName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  centerCountryBadge: {
    backgroundColor: '#0D7844',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  centerCountryBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
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
    gap: 10,
    marginBottom: 10,
  },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
    gap: 10,
  },
  dishImage: {
    width: 88,
    height: 88,
    borderRadius: 10,
  },
  dishContent: {
    flex: 1,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 6,
  },
  dishRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },

  // Substantial, prominent Add to Cart button
  addCartBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  addCartBtnIcon: {
    fontSize: 13,
  },
  addCartBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  spinAgainBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  spinAgainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
