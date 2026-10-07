import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MobileGamesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGame: (prompt: string) => void;
}

interface GameItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  badgeBg?: string;
  prompt: string;
}

const GAMES_LIST: GameItem[] = [
  {
    id: 'food_tinder',
    icon: '🔥',
    title: 'Food Tinder (Swipe & Pick)',
    subtitle: 'Swipe 5 dishes. AI learns your cravings and finds your 90%+ match.',
    badge: 'TOP PICK',
    badgeColor: '#DC2626',
    badgeBg: '#FEE2E2',
    prompt: 'Play Food Tinder',
  },
  {
    id: 'meal_battle',
    icon: '⚔️',
    title: 'Meal Battle',
    subtitle: 'Which one wins? Tap round-by-round contenders to crown tonight’s champion.',
    badge: 'ADDICTIVE',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    prompt: 'Meal Battle',
  },
  {
    id: 'this_or_that',
    icon: '🤔',
    title: 'This or That',
    subtitle: 'Quick game. Find your dinner in 4 rapid binary questions.',
    badge: 'FAST 20s',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    prompt: 'This or That',
  },
  {
    id: 'meal_roulette',
    icon: '🎲',
    title: 'Meal Roulette',
    subtitle: 'Feeling lucky? Spin the flavour wheel to reveal curated global dishes.',
    badge: 'FUN',
    badgeColor: '#7C3AED',
    badgeBg: '#F5F3FF',
    prompt: 'Meal Roulette',
  },
  {
    id: 'mystery_meal',
    icon: '🎁',
    title: 'Mystery Meal',
    subtitle: 'Crack open mystery box A, B, or C for a delicious surprise meal.',
    badge: 'SURPRISE',
    badgeColor: '#2563EB',
    badgeBg: '#EFF6FF',
    prompt: 'Mystery Meal',
  },
  {
    id: 'food_passport',
    icon: '🌍',
    title: 'Food Passport',
    subtitle: 'Collect country stamps across world kitchens and unlock new cuisines.',
    badge: 'REWARDS',
    badgeColor: '#0D7844',
    badgeBg: '#E8F5E9',
    prompt: 'Food Passport',
  },
  {
    id: 'guess_dish',
    icon: '🕵️',
    title: 'Guess the Dish',
    subtitle: 'Daily 3-clue culinary trivia! Guess the secret recipe to order it.',
    badge: 'DAILY TRIVIA',
    badgeColor: '#B45309',
    badgeBg: '#FEF3C7',
    prompt: 'Guess the Dish',
  },
  {
    id: 'build_meal',
    icon: '🧑‍🍳',
    title: 'Build My Meal',
    subtitle: 'Craft your protein + personality + base for instant chef matching.',
    badge: 'CUSTOM',
    badgeColor: '#4F46E5',
    badgeBg: '#EEF2FF',
    prompt: 'Build My Meal',
  },
];

export const MobileGamesModal: React.FC<MobileGamesModalProps> = ({
  visible,
  onClose,
  onSelectGame,
}) => {
  const handlePickGame = (prompt: string) => {
    onClose();
    onSelectGame(prompt);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header Handle Bar */}
            <View style={styles.handleBar} />

            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.headerIcon}>🎮</Text>
                  <Text style={styles.headerTitle}>Food Discovery Games</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                  Can't decide? Play a 20-second game and I'll pick your dinner!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Games List */}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {GAMES_LIST.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameCard}
                  activeOpacity={0.8}
                  onPress={() => handlePickGame(game.prompt)}
                >
                  <View style={styles.gameIconBox}>
                    <Text style={styles.gameIconText}>{game.icon}</Text>
                  </View>

                  <View style={styles.gameInfo}>
                    <View style={styles.gameTopRow}>
                      <Text style={styles.gameTitle}>{game.title}</Text>
                      {game.badge && (
                        <View
                          style={[
                            styles.badge,
                            { backgroundColor: game.badgeBg || '#F3F4F6' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeText,
                              { color: game.badgeColor || '#374151' },
                            ]}
                          >
                            {game.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                  </View>

                  <View style={styles.playArrowBtn}>
                    <Text style={styles.playArrowText}>Play ➔</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  safeArea: {
    flexShrink: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  gameIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gameIconText: {
    fontSize: 22,
  },
  gameInfo: {
    flex: 1,
    paddingRight: 8,
  },
  gameTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    gap: 6,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  gameSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  playArrowBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  playArrowText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D7844',
  },
});
