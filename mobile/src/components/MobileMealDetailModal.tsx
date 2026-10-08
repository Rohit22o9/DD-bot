import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Meal } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MobileMealDetailModalProps {
  visible: boolean;
  meal: Meal | null;
  onClose: () => void;
  onAddToCart: (mealId: string, quantity?: number) => Promise<void> | void;
}

export const MobileMealDetailModal: React.FC<MobileMealDetailModalProps> = ({
  visible,
  meal,
  onClose,
  onAddToCart,
}) => {
  if (!meal) return null;

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImg =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

  const handleAdd = async () => {
    if (isAdding) return;
    try {
      setIsAdding(true);
      await Promise.all([
        Promise.resolve(onAddToCart(meal.id, quantity)),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
        setQuantity(1);
      }, 1200);
    } finally {
      setIsAdding(false);
    }
  };

  const cals = meal.nutrition?.calories || meal.calories || 480;
  const protein = meal.nutrition?.proteinGrams || meal.proteinGrams || 32;
  const fibre = meal.nutrition?.fibreGrams || 6;
  const sodium = meal.nutrition?.sodiumMg || 480;
  const satFat = meal.nutrition?.saturatedFatGrams || 2.4;
  const carbs = meal.nutrition?.carbsGrams || 42;

  const displayBadges =
    meal.displayBadges && meal.displayBadges.length > 0
      ? meal.displayBadges
      : meal.dietaryTags || ['Fresh Daily'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header Drag Handle */}
          <View style={styles.dragHandle} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Meal Hero Image */}
            <View style={styles.imgContainer}>
              <Image
                source={{ uri: imgError ? fallbackImg : meal.imageUrl || fallbackImg }}
                style={styles.heroImg}
                resizeMode="cover"
                onError={() => setImgError(true)}
              />

              {/* Close Button on top of image */}
              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>

              {/* Cuisine & Restaurant Badge */}
              <View style={styles.restaurantBadge}>
                <Text style={styles.restaurantText}>
                  📍 {meal.restaurantName} · {meal.cuisine}
                </Text>
              </View>
            </View>

            {/* Meal Core Info */}
            <View style={styles.infoSection}>
              <View style={styles.titleRow}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealPrice}>${meal.price.toFixed(2)}</Text>
              </View>

              {/* Customer Badges */}
              <View style={styles.badgeRow}>
                {displayBadges.map((badge, idx) => (
                  <View key={idx} style={styles.badgePill}>
                    <Text style={styles.badgeText}>{badge}</Text>
                  </View>
                ))}
              </View>

              {/* Description */}
              <Text style={styles.description}>{meal.description}</Text>

              {/* Section: Nutritional Breakdown */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Nutritional Highlights</Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{cals}</Text>
                    <Text style={styles.nutritionLabel}>Calories (kcal)</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{fibre}g</Text>
                    <Text style={styles.nutritionLabel}>Fibre</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{sodium}mg</Text>
                    <Text style={styles.nutritionLabel}>Sodium</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{satFat}g</Text>
                    <Text style={styles.nutritionLabel}>Sat. Fat</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionVal}>{carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                </View>
              </View>

              {/* Section: Key Ingredients */}
              {meal.ingredients && meal.ingredients.length > 0 && (
                <View style={styles.sectionBlock}>
                  <Text style={styles.sectionTitle}>Fresh Ingredients</Text>
                  <View style={styles.ingredientRow}>
                    {meal.ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingredientPill}>
                        <Text style={styles.ingredientText}>🌿 {ing}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Availability Notice */}
              <View style={styles.availabilityBox}>
                <Text style={styles.availabilityText}>
                  🕒 Available for today's Lunch & Dinner drops. Freshly prepped 2 hours before delivery.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Fixed Action Bar */}
          <View style={styles.actionBar}>
            {/* Quantity Selector */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={[styles.addBtn, isAdded && styles.addBtnSuccess]}
              activeOpacity={0.8}
              onPress={handleAdd}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.addBtnText}>
                  {isAdded
                    ? 'Added to cart ✓'
                    : `Add to cart • $${(meal.price * quantity).toFixed(2)}`}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.88,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 44,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imgContainer: {
    position: 'relative',
    width: '100%',
    height: 230,
    backgroundColor: '#F3F4F6',
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  restaurantBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  restaurantText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoSection: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
  },
  mealPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D7844',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  badgePill: {
    backgroundColor: '#EBF7EE',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(13, 120, 68, 0.2)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 18,
  },
  sectionBlock: {
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionCard: {
    width: '31%',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nutritionVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  ingredientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ingredientText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  availabilityBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  availabilityText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 20,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    minWidth: 18,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnSuccess: {
    backgroundColor: '#059669',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
