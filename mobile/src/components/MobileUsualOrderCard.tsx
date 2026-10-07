import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from '../types';

interface MobileUsualOrderCardProps {
  order: Order;
  onAddToCart: () => void;
  onPlaceOrder: () => void;
}

export const MobileUsualOrderCard: React.FC<MobileUsualOrderCardProps> = ({
  order,
  onAddToCart,
  onPlaceOrder,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Your Usual</Text>
          </View>
          <Text style={styles.restaurant}>{order.restaurantName}</Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.price}>${order.total.toFixed(2)}</Text>
          <Text style={styles.subtext}>Available tomorrow</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {order.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.quantity}x {item.mealName}
            </Text>
            <Text style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.cartBtn} onPress={onAddToCart}>
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.orderBtn} onPress={onPlaceOrder}>
          <Text style={styles.orderBtnText}>Place This Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1B2333',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  tagText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  restaurant: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
  },
  subtext: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  itemsList: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  itemName: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  itemPrice: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartBtnText: {
    color: '#F9FAFB',
    fontSize: 12,
    fontWeight: '600',
  },
  orderBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
