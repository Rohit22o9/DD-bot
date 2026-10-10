import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MobileFloatingCartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
}

export const MobileFloatingCartBar: React.FC<MobileFloatingCartBarProps> = ({
  itemCount,
  total,
  onPress,
}) => {
  if (itemCount <= 0) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.cartIconBadge}>
          <Text style={styles.cartEmoji}>🛒</Text>
        </View>
        <Text style={styles.title}>
          {itemCount} meal{itemCount > 1 ? 's' : ''} · ${total.toFixed(2)}
        </Text>
      </View>

      <View style={styles.viewCartBtnPill}>
        <Text style={styles.actionText}>View cart</Text>
        <Text style={styles.arrowIcon}>▲</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#111827', // Sleek Obsidian / Charcoal Dark, distinct from food card Add To Cart
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartEmoji: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  viewCartBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669', // Vibrant emerald pill inside dark bar
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  arrowIcon: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
});
