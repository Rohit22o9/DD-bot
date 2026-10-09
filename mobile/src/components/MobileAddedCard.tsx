import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meal } from '../types';
import { MobileMealImage } from './MobileMealImage';

interface AddedItemEntry {
  meal: Meal;
  quantity: number;
}

interface MobileAddedCardProps {
  meal?: Meal;
  quantity?: number;
  items?: AddedItemEntry[];
  onUpdateQuantity?: (mealId: string, quantity: number) => void;
  onSelectOption: (option: string) => void;
}

export const MobileAddedCard: React.FC<MobileAddedCardProps> = ({
  meal,
  quantity = 1,
  items,
  onUpdateQuantity,
  onSelectOption,
}) => {
  // Normalize to items list
  const activeItems: AddedItemEntry[] = items && items.length > 0
    ? items
    : meal
    ? [{ meal, quantity }]
    : [];

  const followUpChips = [
    { label: '🥟 Add a side', prompt: 'Add a side' },
    { label: '🥤 Add a drink', prompt: 'Add a drink' },
    { label: '🍰 Add a dessert', prompt: 'Add a dessert' },
    { label: '🍲 Add soup', prompt: 'Add soup' },
    { label: '🥗 Add salad', prompt: 'Add salad' },
    { label: '🛒 View cart', prompt: 'View cart' },
  ];

  if (activeItems.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Upsell prompt directly without the dish card above it */}
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
    flexShrink: 0,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  multiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  multiCardHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  compactDot: {
    fontSize: 14,
    color: '#0D7844',
    marginRight: 6,
  },
  compactName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  compactMeta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
    marginLeft: 8,
  },
});
