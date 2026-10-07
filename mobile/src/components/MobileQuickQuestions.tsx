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
    title: 'Heart healthy',
    subtitle: 'Low sodium, rich in antioxidants & omega-3',
    prompt: 'Heart healthy meals',
  },
  {
    icon: '🩸',
    title: 'Diabetes friendly',
    subtitle: 'Low GI, balanced complex carbs & high fibre',
    prompt: 'Diabetes friendly meals',
  },
  {
    icon: '💪',
    title: 'High protein',
    subtitle: '30g+ protein per meal to fuel your day',
    prompt: 'High protein meals',
  },
  {
    icon: '🥑',
    title: 'Low carb / Keto',
    subtitle: 'Under 20g net carbs, healthy fats',
    prompt: 'Low carb keto meals',
  },
  {
    icon: '🧂',
    title: 'Low sodium',
    subtitle: 'Under 500mg sodium per meal',
    prompt: 'Low sodium meals',
  },
  {
    icon: '🌿',
    title: 'Anti-inflammatory',
    subtitle: 'Whole foods, turmeric, leafy greens',
    prompt: 'Anti-inflammatory meals',
  },
  {
    icon: '⚖️',
    title: 'Weight loss',
    subtitle: 'Calorie-conscious, filling & nutritious',
    prompt: 'Weight loss meals',
  },
];

export const MobileQuickQuestions: React.FC<MobileQuickQuestionsProps> = ({
  goals = DEFAULT_HEALTH_GOALS,
  dismissPrompt = 'Not sure, just show me healthy options',
  onSelectGoal,
}) => {
  return (
    <View style={styles.container}>
      {goals.map((goal, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => onSelectGoal(goal.prompt)}
        >
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>{goal.icon}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{goal.title}</Text>
            <Text style={styles.subtitle}>{goal.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}

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
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  dismissBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    gap: 6,
  },
  dismissIcon: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },
  dismissText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
});
