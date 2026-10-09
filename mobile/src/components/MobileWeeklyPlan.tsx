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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
  budget: {
    color: '#0D7844',
    fontSize: 14,
    fontWeight: '800',
  },
  budgetCap: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  daysScroll: {
    marginBottom: 12,
  },
  dayCell: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    width: 105,
    marginRight: 8,
  },
  dayLabel: {
    color: '#0D7844',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealName: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
    marginVertical: 4,
    minHeight: 30,
  },
  mealPrice: {
    color: '#0D7844',
    fontSize: 13,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#E8F5EE',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
});
