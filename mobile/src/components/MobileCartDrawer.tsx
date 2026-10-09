import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cart } from '../types';
import { MobileMealImage } from './MobileMealImage';

interface MobileCartDrawerProps {
  visible: boolean;
  onClose: () => void;
  cart: Cart | null;
  onUpdateQuantity: (mealId: string, quantity: number) => void;
  onRemoveItem: (mealId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const MobileCartDrawer: React.FC<MobileCartDrawerProps> = ({
  visible,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(
    insets.bottom + 12,
    Platform.OS === 'android' ? 36 : 16
  );

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheet, { paddingBottom: bottomPadding }]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{itemCount}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>
                  Ask Drop AI for recommendations to add delicious meals!
                </Text>
              </View>
            ) : (
              <>
                {/* Items List */}
                <ScrollView style={styles.itemsList}>
                  {items.map((item) => (
                    <View key={item.mealId} style={styles.itemRow}>
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
                        <Text style={styles.itemPrice}>
                          ${(item.meal.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>

                      {/* Stepper */}
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => {
                            if (item.quantity <= 1) {
                              onRemoveItem(item.mealId);
                            } else {
                              onUpdateQuantity(item.mealId, item.quantity - 1);
                            }
                          }}
                        >
                          <Text style={styles.stepText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.stepCount}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => onUpdateQuantity(item.mealId, item.quantity + 1)}
                        >
                          <Text style={styles.stepText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* Bill Breakdown */}
                <View style={styles.summaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryVal}>
                      ${(cart?.subtotal || 0).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Delivery</Text>
                    <Text style={styles.summaryVal}>
                      ${(cart?.deliveryFee || 0).toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalVal}>
                      ${(cart?.total || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={onClearCart}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={onCheckout}
                  >
                    <Text style={styles.checkoutText}>
                      Checkout · ${(cart?.total || 0).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 16,
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 30,
  },
  itemsList: {
    maxHeight: 260,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemThumbContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D7844',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
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
  },
  stepText: {
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
  summaryBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    marginBottom: 14,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D7844',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  clearBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
