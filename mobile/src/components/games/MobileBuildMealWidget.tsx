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

interface MobileBuildMealWidgetProps {
  onAddToCart: (mealId: string) => void;
  onPlayAgain?: () => void;
}

interface StepOption {
  label: string;
  emoji: string;
  key: string;
}

const PROTEINS: StepOption[] = [
  { label: 'Chicken', emoji: '🍗', key: 'chicken' },
  { label: 'Beef', emoji: '🥩', key: 'beef' },
  { label: 'Salmon', emoji: '🐟', key: 'salmon' },
  { label: 'Veg/Cheese', emoji: '🌱', key: 'veg' },
];

const PERSONALITIES: StepOption[] = [
  { label: 'Fiery Spice', emoji: '🌶️', key: 'fiery' },
  { label: 'Fresh Citrus', emoji: '🍋', key: 'fresh' },
  { label: 'Rich Curry', emoji: '🍛', key: 'rich' },
  { label: 'Clean Health', emoji: '🥗', key: 'healthy' },
];

const BASES: StepOption[] = [
  { label: 'Jasmine Rice', emoji: '🍚', key: 'rice' },
  { label: 'Noodles', emoji: '🍜', key: 'noodles' },
  { label: 'Quinoa Bowl', emoji: '🥗', key: 'quinoa' },
];

export const MobileBuildMealWidget: React.FC<MobileBuildMealWidgetProps> = ({
  onAddToCart,
  onPlayAgain,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProtein, setSelectedProtein] = useState<StepOption | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<StepOption | null>(null);
  const [selectedBase, setSelectedBase] = useState<StepOption | null>(null);

  const handleSelectProtein = (opt: StepOption) => {
    setSelectedProtein(opt);
    setStep(2);
  };

  const handleSelectPersonality = (opt: StepOption) => {
    setSelectedPersonality(opt);
    setStep(3);
  };

  const handleSelectBase = (opt: StepOption) => {
    setSelectedBase(opt);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedProtein(null);
    setSelectedPersonality(null);
    setSelectedBase(null);
    onPlayAgain?.();
  };

  // Determine closest available match from mock meals
  let matchedMeal: Meal = MOCK_MOBILE_MEALS[0];
  if (selectedPersonality?.key === 'fresh' || selectedBase?.key === 'quinoa') {
    matchedMeal = MOCK_MOBILE_MEALS[1]; // Quinoa bowl
  } else if (selectedProtein?.key === 'salmon') {
    matchedMeal = MOCK_MOBILE_MEALS[2]; // Salmon Teriyaki
  } else if (selectedPersonality?.key === 'rich') {
    matchedMeal = MOCK_MOBILE_MEALS[3]; // Biryani
  } else if (selectedProtein?.key === 'beef') {
    matchedMeal = MOCK_MOBILE_MEALS[5]; // Rendang
  } else if (selectedProtein?.key === 'veg') {
    matchedMeal = MOCK_MOBILE_MEALS[4]; // Halloumi
  } else {
    matchedMeal = MOCK_MOBILE_MEALS[0]; // Thai Basil
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🧑‍🍳</Text>
          <Text style={styles.headerTitle}>Build My Meal</Text>
        </View>
        <Text style={styles.stepBadge}>Step {step} of 3</Text>
      </View>

      <Text style={styles.subtitle}>
        Craft your custom flavour formula and Drop AI finds the perfect match!
      </Text>

      {/* STEP 1: PROTEIN */}
      {step === 1 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>1. Choose your protein:</Text>
          <View style={styles.optionsGrid}>
            {PROTEINS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={styles.optionBtn}
                activeOpacity={0.8}
                onPress={() => handleSelectProtein(p)}
              >
                <Text style={styles.optionEmoji}>{p.emoji}</Text>
                <Text style={styles.optionLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 2: PERSONALITY */}
      {step === 2 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>2. Choose your personality:</Text>
          <View style={styles.optionsGrid}>
            {PERSONALITIES.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={styles.optionBtn}
                activeOpacity={0.8}
                onPress={() => handleSelectPersonality(p)}
              >
                <Text style={styles.optionEmoji}>{p.emoji}</Text>
                <Text style={styles.optionLabel}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 3: BASE */}
      {step === 3 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepTitle}>3. Choose your base:</Text>
          <View style={styles.optionsGrid}>
            {BASES.map((b) => (
              <TouchableOpacity
                key={b.key}
                style={styles.optionBtn}
                activeOpacity={0.8}
                onPress={() => handleSelectBase(b)}
              >
                <Text style={styles.optionEmoji}>{b.emoji}</Text>
                <Text style={styles.optionLabel}>{b.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* STEP 4: REVEAL MATCH */}
      {step === 4 && (
        <View style={styles.revealBox}>
          <View style={styles.formulaPill}>
            <Text style={styles.formulaText}>
              You built: {selectedProtein?.emoji} {selectedProtein?.label} +{' '}
              {selectedPersonality?.emoji} {selectedPersonality?.label} +{' '}
              {selectedBase?.emoji} {selectedBase?.label}
            </Text>
          </View>

          <View style={styles.matchCard}>
            <MobileMealImage
              uri={matchedMeal.imageUrl}
              style={styles.matchImage}
              dishName={matchedMeal.name}
            />
            <View style={styles.matchBody}>
              <View style={styles.matchRow}>
                <Text style={styles.matchName}>{matchedMeal.name}</Text>
                <Text style={styles.matchPrice}>${matchedMeal.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.matchRest}>{matchedMeal.restaurantName}</Text>
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

          <TouchableOpacity style={styles.restartBtn} onPress={handleReset}>
            <Text style={styles.restartText}>🧑‍🍳 Rebuild a new combo</Text>
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
  stepBadge: {
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
    marginBottom: 10,
  },
  stepBox: {
    marginTop: 4,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  optionEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },

  // Reveal
  revealBox: {
    marginTop: 4,
  },
  formulaPill: {
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  formulaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
    textAlign: 'center',
  },
  matchCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
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
  matchName: {
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
    paddingVertical: 4,
    alignItems: 'center',
  },
  restartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
