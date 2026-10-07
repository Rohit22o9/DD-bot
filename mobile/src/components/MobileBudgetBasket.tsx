import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BudgetBasket } from '../types';

interface MobileBudgetBasketProps {
  basket: BudgetBasket;
  onAddAllToCart: () => void;
}

export const MobileBudgetBasket: React.FC<MobileBudgetBasketProps> = ({
  basket,
  onAddAllToCart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Your ${basket.budgetCap} Drop</Text>
      </View>

      <View style={styles.list}>
        {basket.items.map((it, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.category}>{it.category}: </Text>
              <Text style={styles.name}>{it.name}</Text>
            </View>
            <Text style={styles.price}>${it.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalVal}>${basket.total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onAddAllToCart}>
        <Text style={styles.btnText}>Add All To Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1B2333',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 54, 0.35)',
    padding: 14,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(255, 90, 54, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#FFA288',
    fontSize: 11,
    fontWeight: '700',
  },
  list: {
    marginVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  category: {
    color: '#FFA288',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    color: '#F9FAFB',
    fontSize: 12,
  },
  price: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
    marginTop: 6,
    marginBottom: 10,
  },
  totalLabel: {
    color: '#F9FAFB',
    fontWeight: '700',
    fontSize: 13,
  },
  totalVal: {
    color: '#34D399',
    fontWeight: '800',
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#FF5A36',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
