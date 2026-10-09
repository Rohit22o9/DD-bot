import React, { useState, useRef } from 'react';
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
  onPreferencesDiscovered?: (signals: {
    likedCuisines: string[];
    spicyLoved: boolean;
    proteinPref: string;
  }) => void;
  onPlayAgain?: () => void;
}

export const MobileFoodTinderWidget: React.FC<MobileFoodTinderWidgetProps> = ({
  onAddToCart,
  onPreferencesDiscovered,
  onPlayAgain,
}) => {
  // Use a dynamic 5-dish deck from real 136 meals
  const [deck] = useState<Meal[]>(() => {
    const mains = REAL_DAILY_DROP_MEALS.filter((m) => m.category === 'main');
    return [...mains].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [matchedMeal, setMatchedMeal] = useState<Meal | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Animated values for swipe gesture & button actions
  const position = useRef(new Animated.ValueXY()).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          handleSwipe('right');
        } else if (gestureState.dx < -100) {
          handleSwipe('left');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipe = (direction: 'left' | 'right') => {
    const isLike = direction === 'right';
    const currentMeal = deck[currentIndex];

    const targetX = isLike ? width + 50 : -width - 50;
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: targetX, y: 0 },
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0.2,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start(() => {
      const nextLiked = isLike ? [...likedMeals, currentMeal] : likedMeals;
      if (isLike) setLikedMeals(nextLiked);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= deck.length) {
        // Complete! Calculate best match
        finishGame(nextLiked);
      } else {
        setCurrentIndex(nextIndex);
        position.setValue({ x: 0, y: 0 });
        cardOpacity.setValue(1);
      }
    });
  };

  const finishGame = (likes: Meal[]) => {
    // Pick the most relevant match from the rest of meals or top liked meal
    let match: Meal | undefined;
    if (likes.length > 0) {
      // Find another meal with matching cuisine or the highest liked meal
      const topCuisine = likes[0].cuisine;
      match =
        REAL_DAILY_DROP_MEALS.find((m) => m.cuisine.toLowerCase() === topCuisine.toLowerCase() && !likes.includes(m)) ||
        likes[0];
    } else {
      match = REAL_DAILY_DROP_MEALS[0]; // fallback
    }

    setMatchedMeal(match || REAL_DAILY_DROP_MEALS[0]);
    setIsCompleted(true);
    setShowCelebration(true);

    if (onPreferencesDiscovered && likes.length > 0) {
      const cuisines = Array.from(new Set(likes.map((m) => m.cuisine)));
      const spicy = likes.some((m) => m.spicyLevel > 0);
      onPreferencesDiscovered({
        likedCuisines: cuisines,
        spicyLoved: spicy,
        proteinPref: 'Chicken',
      });
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedMeals([]);
    setIsCompleted(false);
    setMatchedMeal(null);
    position.setValue({ x: 0, y: 0 });
    cardOpacity.setValue(1);
    onPlayAgain?.();
  };

  if (isCompleted && matchedMeal) {
    return (
      <View style={styles.completedContainer}>
        <View style={styles.matchBadge}>
          <Text style={styles.matchBadgeIcon}>👀</Text>
          <Text style={styles.matchBadgeTitle}>I think I've figured you out!</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Your craving match</Text>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillText}>🔥 94% Match</Text>
          </View>
        </View>

        {/* Revealed Match Card */}
        <View style={styles.resultCard}>
          <MobileMealImage
            uri={matchedMeal.imageUrl}
            style={styles.resultImage}
            dishName={matchedMeal.name}
          />
          <View style={styles.resultBody}>
            <View style={styles.resultTop}>
              <Text style={styles.resultTitle}>{matchedMeal.name}</Text>
              <Text style={styles.resultPrice}>${matchedMeal.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.resultRest}>{matchedMeal.restaurantName} · {matchedMeal.cuisine}</Text>
            <Text style={styles.resultDesc} numberOfLines={2}>
              {matchedMeal.description}
            </Text>

            <View style={styles.tagRow}>
              {matchedMeal.spicyLevel > 0 && (
                <View style={[styles.miniTag, styles.spicyTag]}>
                  <Text style={styles.miniTagText}>🌶️ Spicy</Text>
                </View>
              )}
              {matchedMeal.dietaryTags.slice(0, 2).map((tag, idx) => (
                <View key={idx} style={styles.miniTag}>
                  <Text style={styles.miniTagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addCartBtn}
              activeOpacity={0.8}
              onPress={() => onAddToCart(matchedMeal.id)}
            >
              <Text style={styles.addCartText}>🛒 Add to cart — ${matchedMeal.price.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.keepSwipingBtn} onPress={handleReset}>
          <Text style={styles.keepSwipingText}>🔥 Keep swiping / Play again</Text>
        </TouchableOpacity>

        {/* Celebratory Pop-up with Falling Confetti Bars */}
        <MobileCelebrationModal
          visible={showCelebration}
          meal={matchedMeal}
          onClose={() => setShowCelebration(false)}
          onAddToCart={(mealId) => {
            setShowCelebration(false);
            onAddToCart(mealId);
          }}
          title="CRAVING MATCHED! 🔥"
          subtitle="AI discovered your ideal match from your swipes!"
        />
      </View>
    );
  }

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
        Let's find out what you're craving. Swipe right for YUM, left for PASS!
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

      {/* Swipeable Card Stack */}
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
          </View>
        </Animated.View>
      </View>

      {/* Swipe Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.passBtn]}
          activeOpacity={0.7}
          onPress={() => handleSwipe('left')}
        >
          <Text style={styles.actionBtnIcon}>👈</Text>
          <Text style={styles.passBtnText}>PASS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.yumBtn]}
          activeOpacity={0.7}
          onPress={() => handleSwipe('right')}
        >
          <Text style={styles.actionBtnIcon}>❤️</Text>
          <Text style={styles.yumBtnText}>YUM</Text>
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
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 16,
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
    backgroundColor: '#0D7844',
  },
  progressSegActive: {
    backgroundColor: '#10B981',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  cardPrice: {
    fontSize: 15,
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
    fontWeight: '600',
    color: '#0D7844',
  },
  cardDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  spicyTag: {
    backgroundColor: '#FEF2F2',
  },
  miniTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  passBtn: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  passBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  yumBtn: {
    backgroundColor: '#0D7844',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  yumBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnIcon: {
    fontSize: 16,
  },

  // Completed Celebration Styles
  completedContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  matchBadgeIcon: {
    fontSize: 20,
  },
  matchBadgeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  scorePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  scorePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  resultCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  resultImage: {
    width: '100%',
    height: 150,
  },
  resultBody: {
    padding: 12,
  },
  resultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  resultPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  resultRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  resultDesc: {
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
    marginTop: 8,
  },
  addCartText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  keepSwipingBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  keepSwipingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
