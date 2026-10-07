import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MobileChatLaunchScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

interface ActionCard {
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
}

const ACTION_CARDS: ActionCard[] = [
  {
    icon: '🍜',
    title: 'Help me choose',
    subtitle: 'Find something based on your mood',
    prompt: 'Help me choose',
  },
  {
    icon: '🤷',
    title: "I don't know what I want",
    subtitle: 'Let Drop AI pick for you',
    prompt: "I don't know what I want",
  },
  {
    icon: '❤️',
    title: 'Eat healthier',
    subtitle: 'Meals for your nutrition goals',
    prompt: 'Eat healthier',
  },
  {
    icon: '💰',
    title: 'Budget meal',
    subtitle: 'Great meals for your budget',
    prompt: 'Budget meal',
  },
  {
    icon: '📅',
    title: 'Plan my week',
    subtitle: 'Interactive multi-day dinner planner',
    prompt: 'Plan my week',
  },
  {
    icon: '🔄',
    title: 'My usual',
    subtitle: 'Quick reorder & similar favourites',
    prompt: 'My usual',
  },
];

const TRY_ASKING_PILLS = [
  { label: '🇹🇭 Asian cuisines', prompt: 'Asian food' },
  { label: '🍗 Protein-first', prompt: 'Build around protein' },
  { label: '✨ Something different', prompt: 'Something different' },
  { label: '👨‍👩‍👧 Dinner for 4', prompt: 'Dinner for four' },
  { label: '🌱 What can I eat?', prompt: 'What can I eat?' },
  { label: '🕒 Available tomorrow', prompt: 'What can I get tomorrow?' },
];

export const MobileChatLaunchScreen: React.FC<MobileChatLaunchScreenProps> = ({
  onSelectPrompt,
}) => {
  return (
    <View style={styles.container}>
      {/* Hero: Mascot with Floating Food Doodles */}
      <View style={styles.heroSection}>
        <View style={styles.mascotWrapper}>
          {/* Floating Doodles */}
          <Text style={[styles.floatingDoodle, styles.doodle1]}>🥟</Text>
          <Text style={[styles.floatingDoodle, styles.doodle2]}>🍜</Text>
          <Text style={[styles.floatingDoodle, styles.doodle3]}>🥗</Text>
          <Text style={[styles.floatingDoodle, styles.doodle4]}>💰</Text>
          <Text style={[styles.floatingDoodle, styles.doodle5]}>🍃</Text>
          <Text style={[styles.floatingDoodle, styles.doodle6]}>🍲</Text>

          {/* Cute Chef Mascot Badge */}
          <View style={styles.mascotBadge}>
            <View style={styles.mascotHat}>
              <Text style={styles.mascotHatText}>👨‍🍳</Text>
            </View>
            <View style={styles.mascotFace}>
              <View style={styles.mascotEyesRow}>
                <View style={styles.mascotEye} />
                <View style={styles.mascotEye} />
              </View>
              <View style={styles.mascotSmile} />
            </View>
          </View>
        </View>

        <Text style={styles.title}>What would you like to eat?</Text>
        <Text style={styles.subtitle}>
          I can find a meal, help you choose or plan ahead.
        </Text>
      </View>

      {/* 2x3 Grid of Action Cards */}
      <View style={styles.grid}>
        {ACTION_CARDS.map((card, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.card,
              card.title === 'Eat healthier' && styles.highlightedCard,
            ]}
            activeOpacity={0.7}
            onPress={() => onSelectPrompt(card.prompt)}
          >
            <View style={styles.cardIconBox}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardSub}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* "Or try asking..." Section */}
      <View style={styles.tryAskingSection}>
        <Text style={styles.tryAskingHeading}>Or try asking...</Text>
        <View style={styles.pillsContainer}>
          {TRY_ASKING_PILLS.map((pill, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.tryPill}
              activeOpacity={0.7}
              onPress={() => onSelectPrompt(pill.prompt)}
            >
              <Text style={styles.tryPillText}>{pill.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const cardWidth = (width - 44) / 2;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F4FAF6',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  mascotWrapper: {
    width: 96,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  floatingDoodle: {
    position: 'absolute',
    fontSize: 17,
  },
  doodle1: { top: -2, left: 2 },
  doodle2: { top: 2, right: 6 },
  doodle3: { top: 34, left: -6 },
  doodle4: { top: 36, right: -4 },
  doodle5: { bottom: 2, left: 10 },
  doodle6: { bottom: 4, right: 12 },

  mascotBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D7844',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0D7844',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  mascotHat: {
    position: 'absolute',
    top: -10,
  },
  mascotHatText: {
    fontSize: 20,
  },
  mascotFace: {
    alignItems: 'center',
    marginTop: 4,
  },
  mascotEyesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mascotEye: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  mascotSmile: {
    width: 12,
    height: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomWidth: 1.8,
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderColor: '#FFFFFF',
    marginTop: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 16,
    lineHeight: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  highlightedCard: {
    borderColor: '#0D7844',
    borderWidth: 1.8,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },

  tryAskingSection: {
    marginTop: 4,
  },
  tryAskingHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tryPill: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
