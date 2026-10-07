import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface MobileRewardsViewProps {
  onStartChat: (prompt: string) => void;
}

export const MobileRewardsView: React.FC<MobileRewardsViewProps> = ({ onStartChat }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Daily Drop Rewards ⭐</Text>

      {/* Streak Hero Card */}
      <View style={styles.streakCard}>
        <View style={styles.streakHeader}>
          <Text style={styles.streakBadge}>🔥 CURRENT STREAK</Text>
          <Text style={styles.streakCount}>4 Days</Text>
        </View>

        <Text style={styles.streakTitle}>1 more drop to unlock free dessert!</Text>
        <Text style={styles.streakSubtitle}>
          Order your dinner with Daily Drop today to keep your streak alive.
        </Text>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '80%' }]} />
        </View>
      </View>

      {/* Points & Tier Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>⚡ POINTS</Text>
          <Text style={styles.statValue}>340</Text>
          <Text style={styles.statSub}>=$3.40 Drop discount</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>🏆 STATUS</Text>
          <Text style={styles.statValue}>Foodie</Text>
          <Text style={styles.statSub}>Level 2 Member</Text>
        </View>
      </View>

      {/* Unlockable Rewards */}
      <Text style={styles.sectionTitle}>Unlockable Perks</Text>

      <View style={styles.rewardCard}>
        <View style={styles.rewardLeft}>
          <Text style={styles.rewardIcon}>🥟</Text>
          <View>
            <Text style={styles.rewardName}>Free Samosa (2 pcs)</Text>
            <Text style={styles.rewardCost}>200 pts required</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.redeemBtn}
          onPress={() => onStartChat('Redeem Free Samosa reward with my points')}
        >
          <Text style={styles.redeemBtnText}>Redeem</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardCard}>
        <View style={styles.rewardLeft}>
          <Text style={styles.rewardIcon}>🥤</Text>
          <View>
            <Text style={styles.rewardName}>Free Cold Drink</Text>
            <Text style={styles.rewardCost}>150 pts required</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.redeemBtn}
          onPress={() => onStartChat('Redeem Free Drink reward with my points')}
        >
          <Text style={styles.redeemBtnText}>Redeem</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rewardCard}>
        <View style={styles.rewardLeft}>
          <Text style={styles.rewardIcon}>🎟️</Text>
          <View>
            <Text style={styles.rewardName}>$5 Off Any Drop</Text>
            <Text style={styles.rewardCost}>450 pts (110 pts needed)</Text>
          </View>
        </View>
        <View style={styles.lockedBadge}>
          <Text style={styles.lockedBadgeText}>Locked</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: '#E8F8F0',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#D1EFE2',
    padding: 18,
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  streakBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D7844',
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#D1EFE2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D7844',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D7844',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },
  statSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  rewardCost: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: '#0D7844',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  redeemBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  lockedBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lockedBadgeText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 11,
  },
});
