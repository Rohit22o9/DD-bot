import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthGoalOption } from '../types';

interface MobileQuickQuestionsProps {
  goals?: HealthGoalOption[];
  dismissPrompt?: string;
  onSelectGoal: (prompt: string) => void;
}

export const DEFAULT_HEALTH_GOALS: HealthGoalOption[] = [
  {
    icon: '❤️',
    title: 'Heart Healthy',
    subtitle: 'Lower saturated fat & sodium',
    prompt: 'Heart healthy meals',
  },
  {
    icon: '📉',
    title: 'Diabetes Friendly',
    subtitle: 'Balanced carbs & higher fibre',
    prompt: 'Diabetes friendly meals',
  },
  {
    icon: '💪',
    title: 'High Protein',
    subtitle: '30g+ protein per meal',
    prompt: 'High protein meals',
  },
  {
    icon: '🥑',
    title: 'Low Carb / Keto',
    subtitle: 'Lower carb, protein & healthy fats',
    prompt: 'Low carb keto meals',
  },
  {
    icon: '🧂',
    title: 'Low Sodium',
    subtitle: 'Lower-sodium meal choices',
    prompt: 'Low sodium meals',
  },
  {
    icon: '🌿',
    title: 'Anti-Inflammatory',
    subtitle: 'Plant-rich whole foods & healthy fats',
    prompt: 'Anti-inflammatory meals',
  },
  {
    icon: '⚖️',
    title: 'Weight Management',
    subtitle: 'Calorie-conscious & filling',
    prompt: 'Weight management meals',
  },
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({
  goals = DEFAULT_HEALTH_GOALS,
  dismissPrompt = 'Not sure, just show me healthy options',
  onSelectGoal,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {goals.map((goal, idx) => {
          const isOddLast = idx === goals.length - 1 && goals.length % 2 !== 0;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.card, isOddLast && styles.cardFull]}
              activeOpacity={0.75}
              onPress={() => onSelectGoal(goal.prompt)}
            >
              <View style={styles.iconBox}>
                <Text style={styles.iconText}>{goal.icon}</Text>
              </View>
              <View style={isOddLast ? styles.cardFullContent : undefined}>
                <Text style={styles.title} numberOfLines={1}>
                  {goal.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={2}>
                  {goal.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {dismissPrompt ? (
        <TouchableOpacity
          style={styles.dismissBtn}
          activeOpacity={0.7}
          onPress={() => onSelectGoal(dismissPrompt)}
        >
          <Text style={styles.dismissIcon}>⊗</Text>
          <Text style={styles.dismissText}>{dismissPrompt}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    width: '48.5%',
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
    minHeight: 104,
    justifyContent: 'space-between',
  },
  cardFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 58,
  },
  cardFullContent: {
    flex: 1,
    marginLeft: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconText: {
    fontSize: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  dismissBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    gap: 6,
  },
  dismissIcon: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '700',
  },
  dismissText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
});
