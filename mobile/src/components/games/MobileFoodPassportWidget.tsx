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

interface MobileFoodPassportWidgetProps {
  onAddToCart: (mealId: string) => void;
  onExploreMore?: () => void;
}

interface PassportStamp {
  country: string;
  flag: string;
  cuisine: string;
  isUnlocked: boolean;
  mealId?: string;
}

const PASSPORT_STAMPS: PassportStamp[] = [
  { country: 'India', flag: '🇮🇳', cuisine: 'Indian', isUnlocked: true },
  { country: 'Thailand', flag: '🇹🇭', cuisine: 'Thai', isUnlocked: true },
  { country: 'Indonesia', flag: '🇮🇩', cuisine: 'Indonesian', isUnlocked: false, mealId: 'meal_beef_rendang' },
  { country: 'Nigeria', flag: '🇳🇬', cuisine: 'African', isUnlocked: false, mealId: 'meal_jollof_chicken' },
  { country: 'Japan', flag: '🇯🇵', cuisine: 'Japanese', isUnlocked: false, mealId: 'meal_salmon_bowl' },
  { country: 'Greece', flag: '🇬🇷', cuisine: 'Mediterranean', isUnlocked: false, mealId: 'meal_halloumi_bowl' },
];

export const MobileFoodPassportWidget: React.FC<MobileFoodPassportWidgetProps> = ({
  onAddToCart,
  onExploreMore,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<PassportStamp>(PASSPORT_STAMPS[2]); // Indonesia
  const unlockedCount = PASSPORT_STAMPS.filter((s) => s.isUnlocked).length;

  const targetMeal: Meal =
    MOCK_MOBILE_MEALS.find((m) => m.id === selectedTarget.mealId) || MOCK_MOBILE_MEALS[5];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>🌍</Text>
          <Text style={styles.headerTitle}>Your Food Passport</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressPillText}>
            {unlockedCount} of {PASSPORT_STAMPS.length} Cuisines
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Collect country stamps by tasting global authentic kitchens.
      </Text>

      {/* Grid of Stamps */}
      <View style={styles.stampsGrid}>
        {PASSPORT_STAMPS.map((stamp, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.stampItem,
              stamp.isUnlocked && styles.stampUnlocked,
              !stamp.isUnlocked && selectedTarget.country === stamp.country && styles.stampTargeted,
            ]}
            onPress={() => !stamp.isUnlocked && setSelectedTarget(stamp)}
            activeOpacity={0.7}
          >
            <Text style={styles.stampFlag}>{stamp.flag}</Text>
            <Text style={styles.stampCountry}>{stamp.country}</Text>
            <Text style={styles.stampStatus}>
              {stamp.isUnlocked ? '✅ STAMPED' : '🔒 LOCKED'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Unlock Quest Card */}
      <View style={styles.questCard}>
        <View style={styles.questHeader}>
          <Text style={styles.questTitle}>
            Want to unlock {selectedTarget.country} {selectedTarget.flag} tonight?
          </Text>
          <Text style={styles.questSub}>
            Order this authentic culinary specialty to earn your stamp:
          </Text>
        </View>

        <View style={styles.questDishRow}>
          <MobileMealImage
            uri={targetMeal.imageUrl}
            style={styles.questImage}
            dishName={targetMeal.name}
          />
          <View style={styles.questContent}>
            <Text style={styles.questDishName}>{targetMeal.name}</Text>
            <Text style={styles.questDishRest}>{targetMeal.restaurantName}</Text>
            <Text style={styles.questDishPrice}>${targetMeal.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.unlockBtn}
              activeOpacity={0.8}
              onPress={() => onAddToCart(targetMeal.id)}
            >
              <Text style={styles.unlockBtnText}>
                STAMP & ORDER {selectedTarget.flag}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  progressPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  stampItem: {
    width: '31%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stampUnlocked: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  stampTargeted: {
    borderColor: '#0D7844',
    borderWidth: 1.5,
    backgroundColor: '#F0FDF4',
  },
  stampFlag: {
    fontSize: 22,
    marginBottom: 2,
  },
  stampCountry: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
  },
  stampStatus: {
    fontSize: 9,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 2,
  },
  questCard: {
    backgroundColor: '#F4FAF6',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C6E8D5',
  },
  questHeader: {
    marginBottom: 8,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
    marginBottom: 2,
  },
  questSub: {
    fontSize: 11,
    color: '#4B5563',
  },
  questDishRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  questImage: {
    width: 85,
    height: 85,
  },
  questContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  questDishName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  questDishRest: {
    fontSize: 11,
    color: '#6B7280',
  },
  questDishPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
  },
  unlockBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  unlockBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
