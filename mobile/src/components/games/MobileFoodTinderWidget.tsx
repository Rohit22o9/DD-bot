import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

const { width } = Dimensions.get('window');

interface MobileFoodTinderWidgetProps {
  onAddToCart: (mealId: string) => void;
  onClose?: () => void;
  onPreferencesDiscovered?: (signals: {
    likedCuisines: string[];
    spicyLoved: boolean;
    proteinPref: string;
  }) => void;
  onPlayAgain?: () => void;
}

export const MobileFoodTinderWidget: React.FC<MobileFoodTinderWidgetProps> = ({
  onAddToCart,
  onClose,
  onPreferencesDiscovered,
  onPlayAgain,
}) => {
  // Use a dynamic 5-dish deck from real 136 meals
  const [deck] = useState<Meal[]>(() => {
    const mains = REAL_DAILY_DROP_MEALS.filter((m) => m.category === 'main');
    return [...mains].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedMeal, setMatchedMeal] = useState<Meal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animated values for card swipe gesture & transitions
  const position = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  // Refs to avoid stale closures in PanResponder
  const currentIndexRef = useRef(0);
  const deckRef = useRef(deck);
  const isHandlingSwipeRef = useRef(false);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Detect horizontal swipe movement
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        // If it was just a tap / click with little to no movement, pick this meal!
        if (Math.abs(gestureState.dx) < 15 && Math.abs(gestureState.dy) < 15) {
          handlePickCurrent();
          return;
        }

        // Deliberate horizontal swipe to PASS (swipe either left or right)
        if (gestureState.dx < -75 || gestureState.dx > 75) {
          handlePassSwipe(gestureState.dx < 0 ? 'left' : 'right');
        } else {
          // Snap back smoothly
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            tension: 50,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Swipe to pass to next meal card
  const handlePassSwipe = (direction: 'left' | 'right') => {
    if (isHandlingSwipeRef.current) return;
    isHandlingSwipeRef.current = true;

    const targetX = direction === 'left' ? -width - 120 : width + 120;
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: targetX, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0.1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      const curIdx = currentIndexRef.current;
      const nextIndex = curIdx + 1;

      if (nextIndex >= deckRef.current.length) {
        // Swiped through all 5! Use the last card or best match as the winning dish
        const finalMeal = deckRef.current[deckRef.current.length - 1];
        finishGame(finalMeal);
      } else {
        // Reset card coordinates and advance to next card cleanly
        position.setValue({ x: 0, y: 0 });
        cardOpacity.setValue(1);
        setCurrentIndex(nextIndex);
        isHandlingSwipeRef.current = false;
      }
    });
  };

  // Click/tap the card directly to PICK this dish
  const handlePickCurrent = () => {
    if (isHandlingSwipeRef.current) return;
    isHandlingSwipeRef.current = true;

    const curIdx = currentIndexRef.current;
    const pickedMeal = deckRef.current[curIdx];

    // Lift card slightly for touch feedback then finish
    Animated.sequence([
      Animated.spring(position, {
        toValue: { x: 0, y: -12 },
        friction: 4,
        tension: 80,
        useNativeDriver: false,
      }),
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }),
    ]).start(() => {
      finishGame(pickedMeal);
    });
  };

  const finishGame = (winningMeal: Meal) => {
    setMatchedMeal(winningMeal);
    setShowCelebration(true);

    if (onPreferencesDiscovered) {
      onPreferencesDiscovered({
        likedCuisines: [winningMeal.cuisine],
        spicyLoved: winningMeal.spicyLevel > 0,
        proteinPref: winningMeal.name.includes('Chicken') ? 'Chicken' : 'Beef',
      });
    }
  };

  const currentMeal = deck[currentIndex];
  if (!currentMeal) return null;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🔥</Text>
          <Text style={styles.headerTitle}>Food Tinder — Swipe & Pick</Text>
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {deck.length}
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Tap card to pick your dish, or swipe to pass to the next one!
      </Text>

      {/* Progress Bars */}
      <View style={styles.progressBarRow}>
        {deck.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSeg,
              i < currentIndex && styles.progressSegDone,
              i === currentIndex && styles.progressSegActive,
            ]}
          />
        ))}
      </View>

      {/* Swipeable & Tappable Card Stack */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
              opacity: cardOpacity,
            },
          ]}
        >
          {/* Card Tap Overlay with pick badge */}
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handlePickCurrent}
            style={styles.cardTouchable}
          >
            <MobileMealImage
              uri={currentMeal.imageUrl}
              style={styles.cardImage}
              dishName={currentMeal.name}
            />

            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{currentMeal.name}</Text>
                <Text style={styles.cardPrice}>${currentMeal.price.toFixed(2)}</Text>
              </View>

              <Text style={styles.cardRest}>
                {currentMeal.restaurantName} · <Text style={styles.cuisineText}>{currentMeal.cuisine}</Text>
              </Text>

              <Text style={styles.cardDesc} numberOfLines={2}>
                {currentMeal.description}
              </Text>

              <View style={styles.tagRow}>
                {currentMeal.spicyLevel > 0 && (
                  <View style={[styles.miniTag, styles.spicyTag]}>
                    <Text style={styles.miniTagText}>
                      {'🌶️'.repeat(currentMeal.spicyLevel)} Spicy
                    </Text>
                  </View>
                )}
                {currentMeal.dietaryTags.slice(0, 2).map((t, idx) => (
                  <View key={idx} style={styles.miniTag}>
                    <Text style={styles.miniTagText}>{t}</Text>
                  </View>
                ))}
              </View>

              {/* Direct Tap to Pick Prompt Button inside the card */}
              <View style={styles.tapToPickBtn}>
                <Text style={styles.tapToPickBtnText}>👆 Tap to Pick This Dish</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Gesture Hint Ribbon (Replacing Pass/Yum buttons) */}
      <View style={styles.hintRow}>
        <View style={styles.hintBadge}>
          <Text style={styles.hintBadgeText}>👈 Swipe to Pass</Text>
        </View>
        <View style={styles.hintBadge}>
          <Text style={styles.hintBadgeText}>Swipe to Pass 👉</Text>
        </View>
      </View>

      {/* Celebratory Pop-up with Falling Confetti Bars */}
      {/* On Close or Add to Cart, directly returns to the Chat Screen */}
      <MobileCelebrationModal
        visible={showCelebration}
        meal={matchedMeal}
        onClose={() => {
          setShowCelebration(false);
          onClose?.();
        }}
        onAddToCart={(mealId) => {
          setShowCelebration(false);
          onAddToCart(mealId);
          onClose?.();
        }}
        title="DISH PICKED! 🔥"
        subtitle="Great choice! Winning dish added to your dinner plan."
        selectedPreferences={
          matchedMeal
            ? [
                { icon: '🔥', label: matchedMeal.cuisine },
                { icon: '⭐', label: `$${matchedMeal.price.toFixed(2)}` },
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
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  progressBarRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  progressSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },
  progressSegDone: {
    backgroundColor: '#DC2626',
  },
  progressSegActive: {
    backgroundColor: '#EF4444',
  },

  // Card Stack
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTouchable: {
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardBody: {
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  cardRest: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  cuisineText: {
    fontWeight: '700',
    color: '#374151',
  },
  cardDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  miniTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  spicyTag: {
    backgroundColor: '#FEF2F2',
  },

  // Tap to Pick button inside the card
  tapToPickBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  tapToPickBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },

  // Interactive Gesture Hints (replacing Pass & Yum buttons)
  hintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 2,
  },
  hintBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  hintBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
});
