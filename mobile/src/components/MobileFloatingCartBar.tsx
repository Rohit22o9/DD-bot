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
        <Text style={styles.cartEmoji}>🛒</Text>
        <Text style={styles.title}>
          {itemCount} meal{itemCount > 1 ? 's' : ''} · ${total.toFixed(2)}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.actionText}>View cart</Text>
        <Text style={styles.arrowIcon}>⌃</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#0D7844',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartEmoji: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5F5EC',
  },
  arrowIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: -2,
  },
});
