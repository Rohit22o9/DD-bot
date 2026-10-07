import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { UserProfile } from '../types';

interface MobileProfileViewProps {
  currentUserId: string;
  onUserChange: (userId: string) => void;
  userProfile: UserProfile | null;
  onOpenTasteModal: () => void;
  onStartChat: (prompt: string) => void;
}

const PERSONAS = [
  { id: 'user_alex', name: 'Alex Chen', detail: 'Thai / Spicy • Curtin' },
  { id: 'user_sam', name: 'Sam Taylor', detail: 'Vegetarian • Peanut Allergy' },
  { id: 'user_jordan', name: 'Jordan Lee', detail: 'Gluten-Free • High Protein' },
];

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({
  currentUserId,
  onUserChange,
  userProfile,
  onOpenTasteModal,
  onStartChat,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userProfile?.name || 'Alex Chen'}</Text>
          <Text style={styles.userRole}>Curtin Campus • Student Foodie</Text>
        </View>
      </View>

      {/* Switch Demo Persona */}
      <Text style={styles.sectionTitle}>Demo Persona Guardrail Switcher</Text>
      <View style={styles.personaRow}>
        {PERSONAS.map((p) => {
          const isSelected = currentUserId === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.personaCard, isSelected && styles.personaCardActive]}
              onPress={() => onUserChange(p.id)}
            >
              <Text
                style={[
                  styles.personaCardName,
                  isSelected && styles.personaCardNameActive,
                ]}
              >
                {p.name}
              </Text>
              <Text
                style={[
                  styles.personaCardDetail,
                  isSelected && styles.personaCardDetailActive,
                ]}
              >
                {p.detail}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Taste Profile Card */}
      <View style={styles.tasteCard}>
        <View style={styles.tasteHeader}>
          <Text style={styles.tasteTitle}>Your Taste Profile</Text>
          <TouchableOpacity onPress={onOpenTasteModal}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tasteList}>
          <TouchableOpacity
            style={styles.tasteItem}
            onPress={() => onStartChat('Recommend spicy meals')}
          >
            <Text style={styles.tasteIcon}>🌶️</Text>
            <Text style={styles.tasteLabel}>Loves spicy food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tasteItem}
            onPress={() => onStartChat('Show chicken dishes')}
          >
            <Text style={styles.tasteIcon}>🍗</Text>
            <Text style={styles.tasteLabel}>Prefers chicken & protein</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tasteItem}
            onPress={() => onStartChat('Find lunches under $15')}
          >
            <Text style={styles.tasteIcon}>💰</Text>
            <Text style={styles.tasteLabel}>Budget usually under $15</Text>
          </TouchableOpacity>

          <View style={styles.tasteItem}>
            <Text style={styles.tasteIcon}>🚫</Text>
            <Text style={styles.tasteLabel}>No mushrooms</Text>
          </View>
        </View>
      </View>

      {/* Allergen & Dietary Guardrails */}
      <View style={styles.guardrailCard}>
        <View style={styles.guardrailHeader}>
          <Text style={styles.guardrailIcon}>🛡️</Text>
          <Text style={styles.guardrailTitle}>Allergen Safety Guardrails</Text>
        </View>
        <Text style={styles.guardrailDesc}>
          Drop AI automatically filters out meals containing your marked allergens before
          presenting any recommendations.
        </Text>
        <View style={styles.allergenPillRow}>
          {userProfile?.preferences?.allergies && userProfile.preferences.allergies.length > 0 ? (
            userProfile.preferences.allergies.map((allg, idx) => (
              <View key={idx} style={styles.allergenPill}>
                <Text style={styles.allergenPillText}>❌ {allg}</Text>
              </View>
            ))
          ) : (
            <View style={styles.allergenPill}>
              <Text style={styles.allergenPillText}>✓ No known allergies</Text>
            </View>
          )}
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D1EFE2',
  },
  avatarText: {
    fontSize: 26,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  userRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
  },
  personaRow: {
    gap: 8,
    marginBottom: 20,
  },
  personaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  personaCardActive: {
    borderColor: '#0D7844',
    backgroundColor: '#F0FDF4',
  },
  personaCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  personaCardNameActive: {
    color: '#0D7844',
  },
  personaCardDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  personaCardDetailActive: {
    color: '#047857',
  },
  tasteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  tasteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  tasteTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  editBtnText: {
    color: '#0D7844',
    fontWeight: '700',
    fontSize: 13,
  },
  tasteList: {
    gap: 10,
  },
  tasteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  tasteIcon: {
    fontSize: 16,
  },
  tasteLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  guardrailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  guardrailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guardrailIcon: {
    fontSize: 18,
  },
  guardrailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  guardrailDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },
  allergenPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  allergenPillText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
  },
});
