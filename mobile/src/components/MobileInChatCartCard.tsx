import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Cart } from '../types';
import { MobileMealImage } from './MobileMealImage';

interface MobileInChatCartCardProps {
  cart: Cart | null;
  onUpdateQuantity?: (mealId: string, quantity: number) => void;
  onRemoveItem?: (mealId: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  onOpenCartDrawer?: () => void;
}

export const MobileInChatCartCard: React.FC<MobileInChatCartCardProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onOpenCartDrawer,
}) => {
  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!cart || items.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Ask Drop AI for fresh recommendations to add delicious meals!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {/* Colorful Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.cartIconBadge}>
            <Text style={styles.cartIcon}>🛒</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Your Cart</Text>
            <Text style={styles.deliverySlot}>⚡ Tomorrow · Dinner Slot</Text>
          </View>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      {/* Cart Items List with Images & Steppers */}
      <View style={styles.itemsList}>
        {items.map((item, idx) => {
          const itemTotal = (item.meal.price * item.quantity).toFixed(2);
          return (
            <View
              key={item.mealId || idx}
              style={[
                styles.itemRow,
                idx === items.length - 1 ? styles.itemRowLast : null,
              ]}
            >
              <MobileMealImage
                uri={item.meal.imageUrl}
                style={styles.itemThumb}
                containerStyle={styles.itemThumbContainer}
                fallbackUri="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80"
              />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.meal.name}
                </Text>
                <View style={styles.itemSubRow}>
                  <Text style={styles.itemPrice}>${itemTotal}</Text>
                  {item.quantity > 1 && (
                    <Text style={styles.itemUnit}> (${item.meal.price.toFixed(2)} ea)</Text>
                  )}
                </View>
              </View>

              {/* Inline Stepper */}
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.quantity <= 1) {
                      onRemoveItem ? onRemoveItem(item.mealId) : onUpdateQuantity?.(item.mealId, 0);
                    } else {
                      onUpdateQuantity?.(item.mealId, item.quantity - 1);
                    }
                  }}
                >
                  <Text style={styles.stepBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.stepCount}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.stepBtn}
                  activeOpacity={0.7}
                  onPress={() => onUpdateQuantity?.(item.mealId, item.quantity + 1)}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Modern Bill Breakdown */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryVal}>${cart.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryVal}>
            {cart.deliveryFee === 0 ? 'FREE' : `$${cart.deliveryFee.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>${cart.total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Colorful Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.85}
          onPress={onCheckout}
        >
          <Text style={styles.checkoutBtnText}>Confirm Order · ${cart.total.toFixed(2)}</Text>
          <Text style={styles.checkoutArrow}>➔</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.clearBtn}
            activeOpacity={0.7}
            onPress={onClearCart}
          >
            <Text style={styles.clearBtnText}>🗑️ Clear cart</Text>
          </TouchableOpacity>

          {onOpenCartDrawer && (
            <TouchableOpacity
              style={styles.drawerBtn}
              activeOpacity={0.7}
              onPress={onOpenCartDrawer}
            >
              <Text style={styles.drawerBtnText}>Open cart drawer ⌃</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  deliverySlot: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D7844',
    marginTop: 1,
  },
  countBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D7844',
  },
  itemsList: {
    marginTop: 10,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemThumbContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  itemThumb: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  itemSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
  },
  itemUnit: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
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
    lineHeight: 16,
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 8,
  },
  summaryBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  summaryVal: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  totalRow: {
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D7844',
  },
  actionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  checkoutBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  checkoutArrow: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  drawerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  drawerBtnText: {
    fontSize: 12,
    color: '#0D7844',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
