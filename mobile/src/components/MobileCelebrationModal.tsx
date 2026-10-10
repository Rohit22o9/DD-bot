import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Meal } from '../types';
import { MobileMealImage } from './MobileMealImage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PreferenceBadge {
  icon: string;
  label: string;
}

interface MobileCelebrationModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
  onAddToCart: (mealId: string) => void;
  title?: string;
  subtitle?: string;
  selectedPreferences?: PreferenceBadge[];
}

const CONFETTI_COLORS = [
  '#F59E0B',
  '#10B981',
  '#EC4899',
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#FBBF24',
  '#34D399',
];

interface ParticleConfig {
  x: number;
  width: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  emoji?: string;
}

// Generate 36 diverse celebration bars, ribbons, and party poppers
const PARTICLES: ParticleConfig[] = Array.from({ length: 36 }).map((_, i) => ({
  x: Math.random() * (SCREEN_WIDTH - 20),
  width: i % 4 === 0 ? 14 : i % 3 === 0 ? 8 : 12,
  height: i % 4 === 0 ? 14 : i % 3 === 0 ? 24 : 10,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: Math.floor(Math.random() * 500),
  duration: 1700 + Math.floor(Math.random() * 900),
  rotation: Math.floor(Math.random() * 360),
  emoji: i % 5 === 0 ? '🎉' : i % 7 === 0 ? '✨' : i % 9 === 0 ? '⭐' : undefined,
}));

export const MobileCelebrationModal: React.FC<MobileCelebrationModalProps> = ({
  visible,
  meal,
  onClose,
  onAddToCart,
  title,
  subtitle = "Drop AI matched your recipe with today's hot kitchen drop!",
  selectedPreferences,
}) => {
  // 2-Step Flow: 'celebration' -> 'reveal'
  const [step, setStep] = React.useState<'celebration' | 'reveal'>('celebration');

  // Card pop-in scale & opacity
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Particle fall animations
  const particleAnims = useRef(
    PARTICLES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      setStep('celebration');
      // 1. Pop in the meal card
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 2. Animate falling confetti bars
      particleAnims.forEach((anim, idx) => {
        anim.setValue(0);
        Animated.loop(
          Animated.sequence([
            Animated.delay(PARTICLES[idx].delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: PARTICLES[idx].duration,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      setStep('celebration');
      cardScale.setValue(0.7);
      cardOpacity.setValue(0);
      particleAnims.forEach((anim) => anim.setValue(0));
    }
  }, [visible]);

  if (!visible || !meal) return null;

  // Filter out any "CUSTOM MEAL BUILT" wording from title
  const displayTitle =
    title && !title.toUpperCase().includes('CUSTOM MEAL BUILT')
      ? title
      : 'Your Meal is Ready! 🎉';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Central Glowing Card Container */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [{ scale: cardScale }],
              opacity: cardOpacity,
            },
          ]}
        >
          {step === 'celebration' ? (
            /* ================= STEP 1: CELEBRATION POP-UP ================= */
            <View style={styles.celebrationStepContainer}>
              {/* Big Celebration Hero Ring */}
              <View style={styles.celebrationHeroCircle}>
                <Text style={styles.celebrationHeroEmoji}>🎉</Text>
              </View>

              {/* Celebration Title & Subtitle */}
              <Text style={styles.celebrationMainTitle}>{displayTitle}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>

              {/* Selected Choices Tags */}
              {selectedPreferences && selectedPreferences.length > 0 && (
                <View style={styles.prefBadgesContainer}>
                  <View style={styles.prefBadgesRow}>
                    {selectedPreferences.map((p, idx) => (
                      <View key={idx} style={styles.prefBadge}>
                        <Text style={styles.prefBadgeIcon}>{p.icon}</Text>
                        <Text style={styles.prefBadgeText}>{p.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Ready Indicator Box */}
              <View style={styles.celebrationReadyBox}>
                <Text style={styles.celebrationReadyEmoji}>🍽️</Text>
                <View style={styles.celebrationReadyTextCol}>
                  <Text style={styles.celebrationReadyTitle}>Perfect Chef Drop Ready</Text>
                  <Text style={styles.celebrationReadySub}>
                    Crafted specially to match today's fresh kitchen drop
                  </Text>
                </View>
              </View>

              {/* Button: View Your Meal */}
              <TouchableOpacity
                style={styles.viewMealBtn}
                activeOpacity={0.88}
                onPress={() => setStep('reveal')}
              >
                <Text style={styles.viewMealBtnText}>🍽️ View Your Meal</Text>
              </TouchableOpacity>

              {/* Secondary Option: Continue */}
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================= STEP 2: REVEALED MEAL DETAILS ================= */
            <View style={styles.revealStepContainer}>
              <View style={styles.revealHeaderRow}>
                <Text style={styles.revealHeaderTitle}>Tonight's Kitchen Match 🌟</Text>
              </View>

              {/* Winning Dish Card */}
              <View style={styles.mealCard}>
                <View style={styles.imageFrame}>
                  <MobileMealImage
                    key={meal.id}
                    uri={meal.imageUrl}
                    style={styles.mealImage}
                    dishName={meal.name}
                  />
                  <View style={styles.unlockedRibbon}>
                    <Text style={styles.unlockedRibbonText}>🏆 REVEALED</Text>
                  </View>
                </View>

                <View style={styles.mealInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.mealName} numberOfLines={1}>
                      {meal.name}
                    </Text>
                    <Text style={styles.mealPrice}>${meal.price.toFixed(2)}</Text>
                  </View>

                  <Text style={styles.mealRest}>
                    {meal.restaurantName} · {meal.cuisine}
                  </Text>

                  <Text style={styles.mealDesc} numberOfLines={2}>
                    {meal.description}
                  </Text>

                  {/* Nutrition Pill */}
                  <View style={styles.macroPill}>
                    <Text style={styles.macroPillText}>
                      🔥 {meal.calories} kcal · 💪 {meal.proteinGrams || 22}g protein
                    </Text>
                  </View>

                  {/* Big Action: Add to Cart */}
                  <TouchableOpacity
                    style={styles.orderBtn}
                    activeOpacity={0.85}
                    onPress={() => onAddToCart(meal.id)}
                  >
                    <Text style={styles.orderBtnText}>
                      🛒 Add to cart — ${meal.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dismiss / Continue Button */}
              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.7}
                onPress={onClose}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Animated Celebration Confetti Bars — Placed AFTER card so they rain down directly ON TOP OF the card */}
        <View style={styles.confettiOverlay} pointerEvents="none">
          {PARTICLES.map((p, idx) => {
            const translateY = particleAnims[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [-60, SCREEN_HEIGHT + 60],
            });

            const rotate = particleAnims[idx].interpolate({
              inputRange: [0, 1],
              outputRange: [`${p.rotation}deg`, `${p.rotation + 360}deg`],
            });

            const opacity = particleAnims[idx].interpolate({
              inputRange: [0, 0.08, 0.88, 1],
              outputRange: [0, 1, 1, 0],
            });

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.particle,
                  {
                    left: p.x,
                    width: p.width,
                    height: p.height,
                    backgroundColor: p.emoji ? 'transparent' : p.color,
                    borderRadius: p.height > 15 ? 4 : 2,
                    transform: [{ translateY }, { rotate }],
                    opacity,
                  },
                ]}
              >
                {p.emoji ? <Text style={styles.particleEmoji}>{p.emoji}</Text> : null}
              </Animated.View>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)', // Deep slate with celebration focus
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 30,
  },
  particle: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  particleEmoji: {
    fontSize: 18,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A', // Gold celebration trim
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  topBadgeWrapper: {
    marginBottom: 6,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  topBadgeEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  topBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  prefBadgesContainer: {
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  prefBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  prefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  prefBadgeIcon: {
    fontSize: 12,
  },
  prefBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  mealCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  imageFrame: {
    position: 'relative',
    width: '100%',
    height: 170,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  unlockedRibbon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#0D7844',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  unlockedRibbonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mealInfo: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0D7844',
    marginLeft: 8,
  },
  mealRest: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  mealDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 8,
  },
  macroPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  macroPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  orderBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  continueBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  continueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  celebrationStepContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  celebrationHeroCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  celebrationHeroEmoji: {
    fontSize: 34,
  },
  celebrationMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  celebrationReadyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 16,
    padding: 12,
    width: '100%',
    marginVertical: 12,
    gap: 12,
  },
  celebrationReadyEmoji: {
    fontSize: 24,
  },
  celebrationReadyTextCol: {
    flex: 1,
  },
  celebrationReadyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#166534',
  },
  celebrationReadySub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  viewMealBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  viewMealBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  revealStepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  revealHeaderRow: {
    marginBottom: 10,
    alignItems: 'center',
  },
  revealHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
});
