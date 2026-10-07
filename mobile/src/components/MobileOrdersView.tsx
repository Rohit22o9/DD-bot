import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Cart } from '../types';

interface MobileOrdersViewProps {
  onStartChat: (prompt: string) => void;
  onOpenCart: () => void;
  cart: Cart | null;
}

export const MobileOrdersView: React.FC<MobileOrdersViewProps> = ({
  onStartChat,
  onOpenCart,
  cart,
}) => {
  const cartItemCount = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        {cartItemCount > 0 && (
          <TouchableOpacity style={styles.cartBadgeBtn} onPress={onOpenCart}>
            <Text style={styles.cartBadgeText}>🛍️ Bag ({cartItemCount})</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Re-order Your Usual Banner */}
      <View style={styles.usualCard}>
        <View style={styles.usualHeader}>
          <Text style={styles.usualBadge}>⚡ FAST RE-ORDER</Text>
          <Text style={styles.usualSubBadge}>Saved Default</Text>
        </View>

        <View style={styles.usualMainRow}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.usualImage}
          />
          <View style={styles.usualInfo}>
            <Text style={styles.usualMealName}>Chicken Biryani</Text>
            <Text style={styles.usualRestaurant}>Spice Lounge • $12.00</Text>
          </View>
        </View>

        <View style={styles.usualMetaBox}>
          <Text style={styles.usualMetaText}>📍 Pickup: Curtin Campus Hub</Text>
          <Text style={styles.usualMetaText}>⏰ Time: Tomorrow, 5–7 PM</Text>
        </View>

        <TouchableOpacity
          style={styles.reorderBtn}
          onPress={() => onStartChat('Order my usual')}
        >
          <Text style={styles.reorderBtnText}>Re-Order Usual ($12.00)</Text>
        </TouchableOpacity>
      </View>

      {/* Active Drop Status Tracker */}
      <View style={styles.trackerCard}>
        <View style={styles.trackerHeader}>
          <Text style={styles.trackerDot}>🟢</Text>
          <Text style={styles.trackerTitle}>Latest Order #DD-8492</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Confirmed</Text>
          </View>
        </View>
        <Text style={styles.trackerDetail}>
          1x Teriyaki Salmon Bento • Pickup Hub Curtin
        </Text>
        <Text style={styles.trackerTime}>Estimated arrival: 6:15 PM today</Text>

        <TouchableOpacity
          style={styles.trackChatBtn}
          onPress={() => onStartChat('Where is my order #DD-8492?')}
        >
          <Text style={styles.trackChatBtnText}>Ask Drop AI for Update ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Past Orders History */}
      <Text style={styles.sectionTitle}>Past Drops</Text>

      <View style={styles.historyCard}>
        <View style={styles.historyRow}>
          <View>
            <Text style={styles.historyMeal}>Thai Basil Chicken + Jasmine Rice</Text>
            <Text style={styles.historyDate}>Delivered yesterday • $13.00</Text>
          </View>
          <TouchableOpacity
            style={styles.miniReorderBtn}
            onPress={() => onStartChat('Add Thai Basil Chicken to my cart')}
          >
            <Text style={styles.miniReorderText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.historyCard}>
        <View style={styles.historyRow}>
          <View>
            <Text style={styles.historyMeal}>Greek Lamb Soulvaki Bowl</Text>
            <Text style={styles.historyDate}>Delivered 3 days ago • $14.50</Text>
          </View>
          <TouchableOpacity
            style={styles.miniReorderBtn}
            onPress={() => onStartChat('Add Greek Lamb Soulvaki Bowl to my cart')}
          >
            <Text style={styles.miniReorderText}>Reorder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  cartBadgeBtn: {
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1EFE2',
  },
  cartBadgeText: {
    color: '#0D7844',
    fontWeight: '700',
    fontSize: 13,
  },
  usualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#D1EFE2',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  usualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  usualBadge: {
    color: '#0D7844',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  usualSubBadge: {
    color: '#6B7280',
    fontSize: 11,
  },
  usualMainRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  usualImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  usualInfo: {
    flex: 1,
  },
  usualMealName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  usualRestaurant: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  usualMetaBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    gap: 4,
  },
  usualMetaText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  reorderBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  trackerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  trackerDot: {
    fontSize: 10,
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  statusPill: {
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    color: '#0D7844',
    fontSize: 11,
    fontWeight: '700',
  },
  trackerDetail: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 4,
  },
  trackerTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  trackChatBtn: {
    paddingVertical: 6,
  },
  trackChatBtnText: {
    color: '#0D7844',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyMeal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  historyDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  miniReorderBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  miniReorderText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
});
