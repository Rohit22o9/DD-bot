import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DropForMeResult, DropForMeMode } from '../types';
import { MobileMealImage } from './MobileMealImage';

interface MobileDropForMeWidgetProps {
  drop: DropForMeResult;
  onAddToCart: (mealId: string, quantity?: number) => void;
  onSwitchMode?: (mode: DropForMeMode) => void;
  onActionPrompt?: (prompt: string) => void;
}

export const MobileDropForMeWidget: React.FC<MobileDropForMeWidgetProps> = ({
  drop,
  onAddToCart,
  onSwitchMode,
  onActionPrompt,
}) => {
  const [selectedMode, setSelectedMode] = useState<DropForMeMode>(drop.mode);

  const modes: { mode: DropForMeMode; label: string; icon: string }[] = [
    { mode: 'safe', label: 'Safe', icon: '🛡️' },
    { mode: 'adventure', label: 'Adventure', icon: '🔥' },
    { mode: 'budget', label: 'Budget', icon: '💰' },
    { mode: 'healthy', label: 'Healthy', icon: '🥗' },
  ];

  const handleOrderAll = () => {
    onAddToCart(drop.main.id, 1);
    if (drop.side) onAddToCart(drop.side.id, 1);
    if (drop.drink) onAddToCart(drop.drink.id, 1);
    if (drop.dessert) onAddToCart(drop.dessert.id, 1);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Drop For Me</Text>
        </View>
        <Text style={styles.scoreText}>{drop.matchScore || 96}% Match</Text>
      </View>

      {/* Mode Selector Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.modeScroll}
        contentContainerStyle={styles.modeRow}
      >
        {modes.map((m) => {
          const isActive = selectedMode === m.mode;
          return (
            <TouchableOpacity
              key={m.mode}
              style={[styles.modeTab, isActive && styles.modeTabActive]}
              onPress={() => {
                setSelectedMode(m.mode);
                if (onSwitchMode) onSwitchMode(m.mode);
                if (onActionPrompt) onActionPrompt(`Drop for me in ${m.label} mode`);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modeIcon}>{m.icon}</Text>
              <Text
                style={[styles.modeLabel, isActive && styles.modeLabelActive]}
                numberOfLines={1}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Meal Item */}
      <View style={styles.mainMealBox}>
        {drop.main.imageUrl ? (
          <MobileMealImage
            uri={drop.main.imageUrl}
            style={styles.mealImage}
            containerStyle={styles.mealImageContainer}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mealImage, styles.mealImagePlaceholder]}>
            <Text style={{ fontSize: 24 }}>🍽️</Text>
          </View>
        )}
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{drop.main.name}</Text>
          <Text style={styles.restaurantName}>
            {drop.main.restaurantName} • ${drop.main.price.toFixed(2)}
          </Text>
          {drop.rationale ? (
            <Text style={styles.rationaleText} numberOfLines={2}>
              "{drop.rationale}"
            </Text>
          ) : null}
        </View>
      </View>

      {/* Sides / Drinks Bundle List */}
      {(drop.side || drop.drink || drop.dessert) && (
        <View style={styles.bundleList}>
          {drop.side && (
            <View style={styles.bundleRow}>
              <Text style={styles.bundleIcon}>🥟 Side:</Text>
              <Text style={styles.bundleName}>{drop.side.name}</Text>
              <Text style={styles.bundlePrice}>+${drop.side.price.toFixed(2)}</Text>
            </View>
          )}
          {drop.drink && (
            <View style={styles.bundleRow}>
              <Text style={styles.bundleIcon}>🥤 Drink:</Text>
              <Text style={styles.bundleName}>{drop.drink.name}</Text>
              <Text style={styles.bundlePrice}>+${drop.drink.price.toFixed(2)}</Text>
            </View>
          )}
          {drop.dessert && (
            <View style={styles.bundleRow}>
              <Text style={styles.bundleIcon}>🍰 Sweet:</Text>
              <Text style={styles.bundleName}>{drop.dessert.name}</Text>
              <Text style={styles.bundlePrice}>+${drop.dessert.price.toFixed(2)}</Text>
            </View>
          )}
        </View>
      )}

      {/* Reasons Checkmarks */}
      {drop.reasons && drop.reasons.length > 0 && (
        <View style={styles.reasonsBox}>
          {drop.reasons.map((r, i) => (
            <Text key={i} style={styles.reasonText}>
              ✓ {r}
            </Text>
          ))}
        </View>
      )}

      {/* Footer Combo Total & Order Action */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Combo Total</Text>
          <Text style={styles.totalPrice}>${drop.totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handleOrderAll}>
          <Text style={styles.orderBtnText}>Order This Drop ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1EFE2',
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#0D7844',
    fontSize: 12,
    fontWeight: '800',
  },
  scoreText: {
    color: '#0D7844',
    fontSize: 12,
    fontWeight: '700',
  },
  modeScroll: {
    marginBottom: 14,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    gap: 5,
  },
  modeTabActive: {
    backgroundColor: '#0D7844',
  },
  modeIcon: {
    fontSize: 12,
  },
  modeLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#4B5563',
  },
  modeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  mainMealBox: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  mealImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  mealImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  mealImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  restaurantName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  rationaleText: {
    fontSize: 11,
    color: '#0D7844',
    fontStyle: 'italic',
    marginTop: 3,
  },
  bundleList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 6,
  },
  bundleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bundleIcon: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    width: 60,
  },
  bundleName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  bundlePrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
  },
  reasonsBox: {
    marginBottom: 14,
    gap: 2,
  },
  reasonText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  orderBtn: {
    backgroundColor: '#0D7844',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
