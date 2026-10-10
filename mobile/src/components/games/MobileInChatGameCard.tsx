import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GamePayload } from '../../types';

interface MobileInChatGameCardProps {
  payload: GamePayload;
  onLaunchGame: () => void;
}

const GAME_INFO: Record<
  string,
  { title: string; subtitle: string; icon: string; themeColor: string; bgBadge: string; ctaText: string }
> = {
  meal_battle: {
    title: 'Meal Battle',
    subtitle: 'Vote round-by-round to crown tonight’s champion ⚔️',
    icon: '⚔️',
    themeColor: '#D97706',
    bgBadge: '#FEF3C7',
    ctaText: '⚔️ Enter Meal Battle',
  },
  food_tinder: {
    title: 'Food Tinder',
    subtitle: 'Swipe dishes to train AI on your exact cravings 🔥',
    icon: '🔥',
    themeColor: '#DC2626',
    bgBadge: '#FEE2E2',
    ctaText: '🔥 Start Swiping',
  },
  this_or_that: {
    title: 'This or That',
    subtitle: '4 rapid binary choices to pinpoint your craving 🤔',
    icon: '🤔',
    themeColor: '#059669',
    bgBadge: '#ECFDF5',
    ctaText: '🤔 Play This or That',
  },
  meal_roulette: {
    title: 'Meal Roulette',
    subtitle: 'Spin the wheel for delicious global daily drops 🎲',
    icon: '🎲',
    themeColor: '#7C3AED',
    bgBadge: '#F5F3FF',
    ctaText: '🎲 Spin the Wheel',
  },
  mystery_meal: {
    title: 'Mystery Meal',
    subtitle: 'Pick a mystery box to reveal a special daily drop 🎁',
    icon: '🎁',
    themeColor: '#2563EB',
    bgBadge: '#EFF6FF',
    ctaText: '🎁 Open Mystery Box',
  },
  food_passport: {
    title: 'Food Passport',
    subtitle: 'Collect stamps across world cuisines & unlock rewards 🌍',
    icon: '🌍',
    themeColor: '#0D7844',
    bgBadge: '#E8F5E9',
    ctaText: '🌍 Open Passport',
  },
  guess_dish: {
    title: 'Guess the Dish',
    subtitle: 'Crack 3 chef clues to reveal and order the dish 🕵️',
    icon: '🕵️',
    themeColor: '#B45309',
    bgBadge: '#FEF3C7',
    ctaText: '🕵️ Start Guessing',
  },
  build_meal: {
    title: 'Build a Bowl',
    subtitle: 'Customize base, protein, veggies, and sauce 🥗',
    icon: '🥗',
    themeColor: '#059669',
    bgBadge: '#ECFDF5',
    ctaText: '🥗 Build Your Bowl',
  },
  food_iq: {
    title: 'Food IQ',
    subtitle: 'Learn culinary secrets & discover food behind the science 🧠',
    icon: '🧠',
    themeColor: '#7C3AED',
    bgBadge: '#F5F3FF',
    ctaText: '🧠 Test Your Food IQ',
  },
};

export const MobileInChatGameCard: React.FC<MobileInChatGameCardProps> = ({
  payload,
  onLaunchGame,
}) => {
  const info = GAME_INFO[payload.gameType] || {
    title: payload.title || 'Interactive Game',
    subtitle: 'Play in dedicated full-screen mode with 0 distractions 🎮',
    icon: '🎮',
    themeColor: '#0D7844',
    bgBadge: '#E8F5E9',
    ctaText: '🎮 Play Fullscreen',
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: info.bgBadge }]}>
          <Text style={styles.iconText}>{info.icon}</Text>
        </View>
        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {info.title}
            </Text>
            <View style={[styles.badge, { backgroundColor: info.bgBadge }]}>
              <Text style={[styles.badgeText, { color: info.themeColor }]}>
                FULL SCREEN
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle} numberOfLines={2}>
            {info.subtitle}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.launchBtn, { backgroundColor: info.themeColor }]}
        activeOpacity={0.85}
        onPress={onLaunchGame}
      >
        <Text style={styles.launchBtnText}>{info.ctaText} ➔</Text>
      </TouchableOpacity>

      <Text style={styles.hintText}>
        ✨ Opens in a dedicated full-screen view • Chat input & tabs hidden for focus
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  hintText: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});
