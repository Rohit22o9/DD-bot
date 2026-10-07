import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type MobileTab = 'chat' | 'orders' | 'explore' | 'rewards' | 'profile';

interface MobileBottomNavBarProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  cartCount?: number;
}

export const MobileBottomNavBar: React.FC<MobileBottomNavBarProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
}) => {
  const tabs: { key: MobileTab; label: string; icon: string }[] = [
    { key: 'chat', label: 'Drop AI', icon: '✨' },
    { key: 'orders', label: 'Orders', icon: '🛍️' },
    { key: 'explore', label: 'Explore', icon: '🧭' },
    { key: 'rewards', label: 'Rewards', icon: '⭐' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onTabChange(t.key)}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {t.icon}
              </Text>
              {t.key === 'orders' && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 8,
    paddingBottom: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#0D7844',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#0D7844',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
