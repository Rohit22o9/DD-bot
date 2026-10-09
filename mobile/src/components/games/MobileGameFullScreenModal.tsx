import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GamePayload } from '../../types';
import { MobileDiscoveryGameContainer } from './MobileDiscoveryGameContainer';

interface MobileGameFullScreenModalProps {
  visible: boolean;
  payload: GamePayload | null;
  onClose: () => void;
  onAddToCart: (mealId: string) => void;
  onSendMessage?: (prompt: string) => void;
  onPreferencesDiscovered?: (signals: {
    likedCuisines: string[];
    spicyLoved: boolean;
    proteinPref: string;
  }) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

const GAME_METADATA: Record<
  string,
  { title: string; subtitle: string; icon: string; themeColor: string; bgBadge: string }
> = {
  meal_battle: {
    title: 'Meal Battle',
    subtitle: 'Vote round-by-round to crown tonight’s champion ⚔️',
    icon: '⚔️',
    themeColor: '#D97706',
    bgBadge: '#FEF3C7',
  },
  food_tinder: {
    title: 'Food Tinder',
    subtitle: 'Swipe right to like, left to skip • Find your 90%+ match 🔥',
    icon: '🔥',
    themeColor: '#DC2626',
    bgBadge: '#FEE2E2',
  },
  this_or_that: {
    title: 'This or That',
    subtitle: 'Quick 20s game • Rapid choices to pinpoint your dinner 🤔',
    icon: '🤔',
    themeColor: '#059669',
    bgBadge: '#ECFDF5',
  },
  meal_roulette: {
    title: 'Meal Roulette',
    subtitle: 'Spin the flavour wheel for curated global daily drops 🎲',
    icon: '🎲',
    themeColor: '#7C3AED',
    bgBadge: '#F5F3FF',
  },
  mystery_meal: {
    title: 'Mystery Meal',
    subtitle: 'Pick a mystery box for an exciting dinner surprise 🎁',
    icon: '🎁',
    themeColor: '#2563EB',
    bgBadge: '#EFF6FF',
  },
  food_passport: {
    title: 'Food Passport',
    subtitle: 'Collect stamps from world cuisines & earn streak points 🌍',
    icon: '🌍',
    themeColor: '#0D7844',
    bgBadge: '#E8F5E9',
  },
  guess_dish: {
    title: 'Guess the Dish',
    subtitle: 'Daily culinary trivia • Crack the 3 secret clues 🕵️',
    icon: '🕵️',
    themeColor: '#B45309',
    bgBadge: '#FEF3C7',
  },
  build_meal: {
    title: 'Build a Bowl',
    subtitle: 'Mix & match base, protein, veggies, and sauce 🥗',
    icon: '🥗',
    themeColor: '#059669',
    bgBadge: '#ECFDF5',
  },
};

export const MobileGameFullScreenModal: React.FC<MobileGameFullScreenModalProps> = ({
  visible,
  payload,
  onClose,
  onAddToCart,
  onSendMessage,
  onPreferencesDiscovered,
  cartCount = 0,
  onOpenCart,
}) => {
  if (!payload) return null;

  const meta = GAME_METADATA[payload.gameType] || {
    title: payload.title || 'Food Game',
    subtitle: 'Interactive Game Mode • Zero Distractions 🎮',
    icon: '🎮',
    themeColor: '#0D7844',
    bgBadge: '#E8F5E9',
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Dedicated Game Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={onClose}
          >
            <Text style={styles.backBtnArrow}>←</Text>
            <Text style={styles.backBtnText}>Back to Chat</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.titleIcon}>{meta.icon}</Text>
              <Text style={styles.titleText}>{meta.title}</Text>
            </View>
            <Text style={styles.subtitleText} numberOfLines={1}>
              {meta.subtitle}
            </Text>
          </View>

          {/* Quick Cart Pill */}
          <TouchableOpacity
            style={styles.cartPill}
            activeOpacity={0.8}
            onPress={() => {
              onClose();
              onOpenCart?.();
            }}
          >
            <Text style={styles.cartPillIcon}>🛒</Text>
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Dedicated Game Screen Body */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Game Tag Banner */}
          <View style={styles.modeBanner}>
            <View style={styles.modeDot} />
            <Text style={styles.modeBannerText}>
              FULL-SCREEN GAME ARENA • TAP TO INTERACT
            </Text>
          </View>

          {/* Game Widget Container */}
          <View style={styles.widgetWrapper}>
            <MobileDiscoveryGameContainer
              payload={payload}
              onAddToCart={(mealId) => {
                onAddToCart(mealId);
                // After adding, close game to return to chat with celebratory state
                onClose();
              }}
              onSendMessage={(prompt) => {
                onSendMessage?.(prompt);
                onClose();
              }}
              onPreferencesDiscovered={onPreferencesDiscovered}
            />
          </View>

          {/* Footer note inside game screen */}
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              Winning meal goes directly to your bag • Ready for fresh daily drop delivery
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Consistent clean background matching the app
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backBtnArrow: {
    fontSize: 14,
    color: '#475569',
    marginRight: 4,
    fontWeight: '700',
  },
  backBtnText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cartPillIcon: {
    fontSize: 16,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0D7844',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  modeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  modeBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.6,
  },
  widgetWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  footerNote: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerNoteText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
