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

interface MobileMysteryMealWidgetProps {
  onAddToCart: (mealId: string) => void;
  onTryAnother?: () => void;
}

interface MysteryBox {
  id: string;
  letter: string;
  label: string;
  tagline: string;
  emoji: string;
  meal: Meal;
  highlightText: string;
}

function getDynamicMysteryBoxes(): MysteryBox[] {
  const budgetMeals = REAL_DAILY_DROP_MEALS.filter((m) => m.price <= 12);
  const proteinMeals = REAL_DAILY_DROP_MEALS.filter((m) => (m.proteinGrams || 0) >= 30);
  const spicyMeals = REAL_DAILY_DROP_MEALS.filter(
    (m) => m.spicyLevel > 0 || /spicy|chilli|mala|pepper/i.test(m.name)
  );
  const chefSpecialMeals = REAL_DAILY_DROP_MEALS.filter(
    (m) => m.category === 'main' && m.price > 12 && (m.proteinGrams || 0) < 30
  );

  const mealA = budgetMeals[Math.floor(Math.random() * budgetMeals.length)] || REAL_DAILY_DROP_MEALS[0];
  const mealB = proteinMeals[Math.floor(Math.random() * proteinMeals.length)] || REAL_DAILY_DROP_MEALS[3];
  const mealC = spicyMeals[Math.floor(Math.random() * spicyMeals.length)] || REAL_DAILY_DROP_MEALS[10];
  const mealD = chefSpecialMeals[Math.floor(Math.random() * chefSpecialMeals.length)] || REAL_DAILY_DROP_MEALS[5];

  return [
    {
      id: 'box_a',
      letter: 'A',
      label: 'Under $12',
      tagline: 'Best value drop',
      emoji: '💰',
      meal: mealA,
      highlightText: `Budget Super Saver · $${mealA.price.toFixed(2)}`,
    },
    {
      id: 'box_b',
      letter: 'B',
      label: 'High Protein',
      tagline: 'Macro powerhouse',
      emoji: '💪',
      meal: mealB,
      highlightText: `${mealB.proteinGrams || 32}g Pure Lean Protein`,
    },
    {
      id: 'box_c',
      letter: 'C',
      label: 'Adventurous',
      tagline: 'Bold global flavours',
      emoji: '🌶️',
      meal: mealC,
      highlightText: `Chef’s Bold ${mealC.cuisine} Surprise`,
    },
    {
      id: 'box_d',
      letter: 'D',
      label: 'Chef Special',
      tagline: 'Signature tonight',
      emoji: '⭐',
      meal: mealD,
      highlightText: `Signature Drop · ${mealD.cuisine} Specialty`,
    },
  ];
}

export const MobileMysteryMealWidget: React.FC<MobileMysteryMealWidgetProps> = ({
  onAddToCart,
  onTryAnother,
}) => {
  const [boxes, setBoxes] = useState<MysteryBox[]>(() => getDynamicMysteryBoxes());
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleOpenBox = (box: MysteryBox) => {
    setSelectedBox(box);
    setShowCelebration(true);
  };

  const handleReset = () => {
    setBoxes(getDynamicMysteryBoxes());
    setSelectedBox(null);
    setShowCelebration(false);
    onTryAnother?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🎁</Text>
          <Text style={styles.headerTitle}>Mystery Meal</Text>
        </View>
        <Text style={styles.peekBadge}>Pick your box 👀</Text>
      </View>

      <Text style={styles.subtitle}>
        Which mystery box will you crack open for tonight's dinner?
      </Text>

      {!selectedBox ? (
        <View style={styles.boxesGrid}>
          {boxes.map((box) => (
            <TouchableOpacity
              key={box.id}
              style={styles.boxCard}
              activeOpacity={0.8}
              onPress={() => handleOpenBox(box)}
            >
              <Text style={styles.boxEmoji}>🎁</Text>
              <View style={styles.boxBadge}>
                <Text style={styles.boxBadgeText}>Box {box.letter}</Text>
              </View>
              <Text style={styles.boxLabel}>{box.label}</Text>
              <Text style={styles.boxTagline}>{box.tagline}</Text>
              <View style={styles.tapOpen}>
                <Text style={styles.tapOpenText}>Open ➔</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.unboxedSection}>
          <View style={styles.unboxedBanner}>
            <Text style={styles.unboxedParty}>🎉</Text>
            <View>
              <Text style={styles.unboxedTitle}>Box {selectedBox.letter} Unboxed!</Text>
              <Text style={styles.unboxedHighlight}>{selectedBox.highlightText}</Text>
            </View>
          </View>

          {/* Revealed Meal Card */}
          <View style={styles.mealCard}>
            <MobileMealImage
              uri={selectedBox.meal.imageUrl}
              style={styles.mealImage}
              dishName={selectedBox.meal.name}
            />
            <View style={styles.mealBody}>
              <View style={styles.mealRow}>
                <Text style={styles.mealName}>{selectedBox.meal.name}</Text>
                <Text style={styles.mealPrice}>${selectedBox.meal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.mealRest}>
                {selectedBox.meal.restaurantName} · {selectedBox.meal.cuisine}
              </Text>
              <Text style={styles.mealDesc} numberOfLines={2}>
                {selectedBox.meal.description}
              </Text>

              <TouchableOpacity
                style={styles.takeItBtn}
                activeOpacity={0.8}
                onPress={() => onAddToCart(selectedBox.meal.id)}
              >
                <Text style={styles.takeItText}>
                  🛒 I'll take it! — ${selectedBox.meal.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.tryAnotherBtn} onPress={handleReset}>
            <Text style={styles.tryAnotherText}>🎁 Try another box</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Celebratory Pop-up with Falling Confetti Bars */}
      <MobileCelebrationModal
        visible={showCelebration}
        meal={selectedBox?.meal || null}
        onClose={() => setShowCelebration(false)}
        onAddToCart={(mealId) => {
          setShowCelebration(false);
          onAddToCart(mealId);
        }}
        title="MYSTERY CRACKED! 🎁"
        subtitle={selectedBox ? `Box ${selectedBox.letter} unlocked: ${selectedBox.meal.name}` : undefined}
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
  peekBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  boxesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  boxCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  boxEmoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  boxBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  boxBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
  },
  boxLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  boxTagline: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  tapOpen: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  tapOpenText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },

  // Unboxed
  unboxedSection: {
    marginTop: 4,
  },
  unboxedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  unboxedParty: {
    fontSize: 22,
  },
  unboxedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  unboxedHighlight: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  mealCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  mealImage: {
    width: '100%',
    height: 140,
  },
  mealBody: {
    padding: 12,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  mealPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
    marginLeft: 8,
  },
  mealRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  mealDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 10,
  },
  takeItBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  takeItText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tryAnotherBtn: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  tryAnotherText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
