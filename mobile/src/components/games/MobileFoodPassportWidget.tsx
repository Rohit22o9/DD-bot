import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Meal } from '../../types';
import { REAL_DAILY_DROP_MEALS } from '../../realDailyDropMeals';
import { MOCK_MOBILE_MEALS } from '../../mockData';
import { MobileMealImage } from '../MobileMealImage';
import { MobileCelebrationModal } from '../MobileCelebrationModal';

interface MobileFoodPassportWidgetProps {
  onAddToCart: (mealId: string) => void;
  onExploreMore?: () => void;
}

export interface PassportStamp {
  country: string;
  flag: string;
  cuisine: string;
  isUnlocked: boolean;
  sampleMealName: string;
}

const ALL_MEALS_CATALOG = [...REAL_DAILY_DROP_MEALS, ...MOCK_MOBILE_MEALS];

const INITIAL_PASSPORT_STAMPS: PassportStamp[] = [
  { country: 'India', flag: '🇮🇳', cuisine: 'North Indian', isUnlocked: true, sampleMealName: 'Chicken Biryani' },
  { country: 'Thailand', flag: '🇹🇭', cuisine: 'Thai', isUnlocked: true, sampleMealName: 'Thai Basil Chicken' },
  { country: 'Indonesia', flag: '🇮🇩', cuisine: 'Indonesian', isUnlocked: false, sampleMealName: 'Indonesian Beef Rendang' },
  { country: 'Nigeria', flag: '🇳🇬', cuisine: 'African', isUnlocked: false, sampleMealName: 'Jollof Rice & Roasted Chicken' },
  { country: 'Japan', flag: '🇯🇵', cuisine: 'Japanese', isUnlocked: false, sampleMealName: 'Signature Tonkotsu Ramen' },
  { country: 'Greece', flag: '🇬🇷', cuisine: 'Greek', isUnlocked: false, sampleMealName: 'Mediterranean Greek Salad' },
];

export const MobileFoodPassportWidget: React.FC<MobileFoodPassportWidgetProps> = ({
  onAddToCart,
  onExploreMore,
}) => {
  const [stamps, setStamps] = useState<PassportStamp[]>(INITIAL_PASSPORT_STAMPS);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('Indonesia');
  const [showCelebration, setShowCelebration] = useState(false);

  const selectedTarget =
    stamps.find((s) => s.country === selectedCountryName) || stamps[2] || stamps[0];

  const unlockedCount = stamps.filter((s) => s.isUnlocked).length;
  const lockedStamps = stamps.filter((s) => !s.isUnlocked);
  const isCurrentUnlocked = selectedTarget.isUnlocked;

  // Find authentic meal matching this country's cuisine
  const targetMeal: Meal =
    ALL_MEALS_CATALOG.find(
      (m) =>
        m.name.toLowerCase().includes(selectedTarget.sampleMealName.toLowerCase()) ||
        m.cuisine.toLowerCase().includes(selectedTarget.cuisine.toLowerCase())
    ) || REAL_DAILY_DROP_MEALS[0];

  // Handler for Stamp Button (Step 1)
  const handleStampPassport = () => {
    // 1. Mark stamp as unlocked
    setStamps((prev) =>
      prev.map((s) =>
        s.country === selectedTarget.country ? { ...s, isUnlocked: true } : s
      )
    );
    // 2. Trigger celebratory pop animation modal (Step 2)
    setShowCelebration(true);
  };

  const handleSelectNextLocked = () => {
    const nextLocked = stamps.find((s) => !s.isUnlocked && s.country !== selectedTarget.country);
    if (nextLocked) {
      setSelectedCountryName(nextLocked.country);
    }
  };

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
            {unlockedCount} of {stamps.length} Cuisines
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Collect country stamps by tasting global authentic kitchens.
      </Text>

      {/* Grid of Stamps */}
      <View style={styles.stampsGrid}>
        {stamps.map((stamp, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.stampItem,
              stamp.isUnlocked && styles.stampUnlocked,
              selectedCountryName === stamp.country && styles.stampTargeted,
            ]}
            onPress={() => setSelectedCountryName(stamp.country)}
            activeOpacity={0.7}
          >
            <Text style={styles.stampFlag}>{stamp.flag}</Text>
            <Text style={styles.stampCountry}>{stamp.country}</Text>
            <Text
              style={[
                styles.stampStatus,
                stamp.isUnlocked ? styles.stampStatusUnlocked : styles.stampStatusLocked,
              ]}
            >
              {stamp.isUnlocked ? '✅ STAMPED' : '🔒 LOCKED'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* STEP 1: BEFORE STAMPING — Clean Stamp Button Card (No congested meal details yet!) */}
      {!isCurrentUnlocked ? (
        <View style={styles.questCard}>
          <View style={styles.questHeader}>
            <Text style={styles.questTitle}>
              Want to unlock {selectedTarget.country} {selectedTarget.flag} tonight?
            </Text>
            <Text style={styles.questSub}>
              Tap below to stamp your passport and unlock tonight's authentic {selectedTarget.cuisine} culinary specialty:
            </Text>
          </View>

          {/* Dedicated Clean Stamp Action Button */}
          <TouchableOpacity
            style={styles.stampBtnPrimary}
            activeOpacity={0.85}
            onPress={handleStampPassport}
          >
            <View style={styles.stampBtnContent}>
              <Text style={styles.stampBtnIcon}>🛂</Text>
              <View style={styles.stampBtnTextCol}>
                <Text style={styles.stampBtnTitle}>
                  STAMP PASSPORT {selectedTarget.flag}
                </Text>
                <Text style={styles.stampBtnSub}>
                  Earn stamp & reveal exclusive specialty dish
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        /* STEP 3: AFTER STAMPING — Spacious, un-congested Meal Card with Order Option */
        <View style={styles.revealedSection}>
          {/* Stamped Confirmation Banner */}
          <View style={styles.stampedBanner}>
            <Text style={styles.stampedBannerIcon}>🎉</Text>
            <View style={styles.stampedBannerCol}>
              <Text style={styles.stampedBannerTitle}>
                {selectedTarget.country} {selectedTarget.flag} Stamped!
              </Text>
              <Text style={styles.stampedBannerSub}>
                Authentic {selectedTarget.cuisine} specialty unlocked & ready to order:
              </Text>
            </View>
          </View>

          {/* Spacious Meal Showcase Card (NOT cramped) */}
          <View style={styles.spaciousMealCard}>
            {/* Meal Image with Cuisine Overlay Badge */}
            <View style={styles.imageBox}>
              <MobileMealImage
                uri={targetMeal.imageUrl}
                style={styles.spaciousMealImage}
                dishName={targetMeal.name}
              />
              <View style={styles.cuisineBadge}>
                <Text style={styles.cuisineBadgeText}>
                  {selectedTarget.flag} {targetMeal.cuisine}
                </Text>
              </View>
            </View>

            {/* Meal Details Body */}
            <View style={styles.spaciousMealBody}>
              <View style={styles.mealTitleRow}>
                <Text style={styles.mealName} numberOfLines={1}>
                  {targetMeal.name}
                </Text>
                <Text style={styles.mealPrice}>${targetMeal.price.toFixed(2)}</Text>
              </View>

              <Text style={styles.mealRest}>
                {targetMeal.restaurantName} · {targetMeal.cuisine}
              </Text>

              <Text style={styles.mealDesc} numberOfLines={2}>
                {targetMeal.description}
              </Text>

              {/* Macro Nutrition Pill */}
              <View style={styles.macroPill}>
                <Text style={styles.macroPillText}>
                  🔥 {targetMeal.calories} kcal · 💪 {targetMeal.proteinGrams || 28}g protein
                </Text>
              </View>

              {/* Primary Full-Width Order Option */}
              <TouchableOpacity
                style={styles.orderMealBtn}
                activeOpacity={0.85}
                onPress={() => onAddToCart(targetMeal.id)}
              >
                <Text style={styles.orderMealBtnText}>
                  🛒 Order {targetMeal.name} — ${targetMeal.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Explore next locked country if available */}
          {lockedStamps.length > 0 && (
            <TouchableOpacity
              style={styles.exploreNextBtn}
              activeOpacity={0.8}
              onPress={handleSelectNextLocked}
            >
              <Text style={styles.exploreNextText}>
                🌍 Stamp Next Country ({lockedStamps.length} locked) ➔
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* STEP 2: CELEBRATION POP ANIMATION MODAL */}
      <MobileCelebrationModal
        visible={showCelebration}
        meal={targetMeal}
        onClose={() => setShowCelebration(false)}
        onAddToCart={(mealId) => {
          setShowCelebration(false);
          onAddToCart(mealId);
        }}
        title="PASSPORT STAMPED! 🛂🎉"
        subtitle={`You officially unlocked ${selectedTarget.country} ${selectedTarget.flag}! Delicious dish revealed:`}
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
    borderWidth: 2,
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
    marginTop: 2,
  },
  stampStatusUnlocked: {
    color: '#059669',
  },
  stampStatusLocked: {
    color: '#6B7280',
  },
  questCard: {
    backgroundColor: '#F4FAF6',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C6E8D5',
  },
  questHeader: {
    marginBottom: 10,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
    marginBottom: 3,
  },
  questSub: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
  },
  stampBtnPrimary: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  stampBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stampBtnIcon: {
    fontSize: 22,
  },
  stampBtnTextCol: {
    flex: 1,
  },
  stampBtnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  stampBtnSub: {
    fontSize: 10,
    color: '#D1FAE5',
    marginTop: 1,
  },
  revealedSection: {
    gap: 10,
  },
  stampedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 8,
  },
  stampedBannerIcon: {
    fontSize: 18,
  },
  stampedBannerCol: {
    flex: 1,
  },
  stampedBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  stampedBannerSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 1,
  },
  spaciousMealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageBox: {
    width: '100%',
    height: 140,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  spaciousMealImage: {
    width: '100%',
    height: '100%',
  },
  cuisineBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cuisineBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spaciousMealBody: {
    padding: 12,
  },
  mealTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8,
  },
  mealPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
  },
  mealRest: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 6,
  },
  mealDesc: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  macroPill: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  macroPillText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
  },
  orderMealBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  orderMealBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exploreNextBtn: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exploreNextText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
});
