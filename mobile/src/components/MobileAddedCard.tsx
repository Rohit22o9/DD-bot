import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meal } from '../types';
import { MobileMealImage } from './MobileMealImage';

interface MobileAddedCardProps {
  meal?: Meal;
  quantity?: number;
  onUpdateQuantity?: (quantity: number) => void;
  onSelectOption: (option: string) => void;
}

export const MobileAddedCard: React.FC<MobileAddedCardProps> = ({
  meal,
  quantity = 1,
  onUpdateQuantity,
  onSelectOption,
}) => {
  const [qty, setQty] = useState(quantity);

  const mealName = meal?.name || 'Grilled Chicken Quinoa Bowl';
  const mealPrice = meal?.price || 12.0;
  const mealImg =
    meal?.imageUrl ||
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80';

  const handleMinus = () => {
    if (qty > 1) {
      const next = qty - 1;
      setQty(next);
      onUpdateQuantity?.(next);
    }
  };

  const handlePlus = () => {
    const next = qty + 1;
    setQty(next);
    onUpdateQuantity?.(next);
  };

  const followUpChips = [
    { label: '🥤 Add a drink', prompt: 'Add a drink' },
    { label: '🥟 Add a side', prompt: 'Add a side' },
    { label: '🍽️ Another meal', prompt: 'Another meal' },
    { label: "✅ I'm done", prompt: "I'm done" },
  ];

  return (
    <View style={styles.container}>
      {/* Inline Added Card */}
      <View style={styles.card}>
        <MobileMealImage
          uri={mealImg}
          style={styles.thumb}
          containerStyle={styles.thumbContainer}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {mealName}
          </Text>
          <Text style={styles.price}>${mealPrice.toFixed(2)}</Text>
        </View>

        {/* Stepper */}
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={handleMinus} activeOpacity={0.7}>
            <Text style={styles.stepBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepCount}>{qty}</Text>
          <TouchableOpacity style={styles.stepBtn} onPress={handlePlus} activeOpacity={0.7}>
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.question}>Would you like to add something else?</Text>

      {/* Follow-up Chips */}
      <View style={styles.chipsRow}>
        {followUpChips.map((chip, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => onSelectOption(chip.prompt)}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  thumbContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  info: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  price: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 8,
  },
  question: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 10,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
