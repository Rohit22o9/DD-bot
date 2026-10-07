import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WeeklyMealPlan } from '../types';

interface MobileWeeklyPlanProps {
  plan: WeeklyMealPlan;
  onQuickAction: (actionText: string) => void;
}

export const MobileWeeklyPlan: React.FC<MobileWeeklyPlanProps> = ({
  plan,
  onQuickAction,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Dinner Plan</Text>
        <Text style={styles.budget}>
          ${plan.actualTotal.toFixed(2)}{' '}
          <Text style={styles.budgetCap}>/ ${plan.targetBudget.toFixed(2)}</Text>
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
        {plan.days.map((d, i) => (
          <View key={i} style={styles.dayCell}>
            <Text style={styles.dayLabel}>{d.day}</Text>
            <Text style={styles.mealName} numberOfLines={2}>
              {d.meal.name}
            </Text>
            <Text style={styles.mealPrice}>${d.meal.price.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => onQuickAction('Change Wednesday')}
        >
          <Text style={styles.chipText}>Change Wed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => onQuickAction('Make Friday vegetarian')}
        >
          <Text style={styles.chipText}>Fri Veg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => onQuickAction('Remove salads')}
        >
          <Text style={styles.chipText}>No Salads</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => onQuickAction('Keep everything under $60')}
        >
          <Text style={styles.chipText}>&lt;$60</Text>
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
  },
  budget: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '800',
  },
  budgetCap: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '400',
  },
  daysScroll: {
    marginBottom: 12,
  },
  dayCell: {
    backgroundColor: '#141B26',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 8,
    width: 100,
    marginRight: 8,
  },
  dayLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  mealName: {
    color: '#F9FAFB',
    fontSize: 11,
    fontWeight: '600',
    marginVertical: 4,
    minHeight: 28,
  },
  mealPrice: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: 'rgba(255, 90, 54, 0.12)',
    borderColor: 'rgba(255, 90, 54, 0.3)',
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    color: '#FFA288',
    fontSize: 11,
    fontWeight: '600',
  },
});
