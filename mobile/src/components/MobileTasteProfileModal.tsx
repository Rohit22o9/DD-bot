import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserProfile } from '../types';

interface MobileTasteProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  onSwitchUser: (newUserId: string) => void;
  userProfile: UserProfile | null;
}

const TASTE_ITEMS = [
  { emoji: '🌶️', label: 'Loves spicy food' },
  { emoji: '🍗', label: 'Prefers chicken & high-protein' },
  { emoji: '💲', label: 'Usually orders under $15' },
  { emoji: '🚫', label: 'No mushrooms or bell peppers' },
  { emoji: '🌐', label: 'Likes trying new Asian & Thai dishes' },
  { emoji: '🥗', label: 'Healthy options preferred' },
];

export const MobileTasteProfileModal: React.FC<MobileTasteProfileModalProps> = ({
  visible,
  onClose,
  userId,
  onSwitchUser,
  userProfile,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(
    insets.bottom + 12,
    Platform.OS === 'android' ? 36 : 16
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: bottomPadding }]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Taste Profile</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {/* Persona Switcher */}
              <Text style={styles.sectionTitle}>👤 Switch Customer Persona</Text>
              <View style={styles.personasRow}>
                {[
                  { id: 'user_alex', name: '🌶️ Alex Chen', tag: 'Spicy / Thai' },
                  { id: 'user_sam', name: '🥜 Sam Taylor', tag: 'Veg / Nut Allergy' },
                  { id: 'user_jordan', name: '🌮 Jordan Lee', tag: 'Gluten-Free' },
                ].map((persona) => (
                  <TouchableOpacity
                    key={persona.id}
                    style={[
                      styles.personaBtn,
                      userId === persona.id && styles.personaBtnActive,
                    ]}
                    onPress={() => onSwitchUser(persona.id)}
                  >
                    <Text
                      style={[
                        styles.personaName,
                        userId === persona.id && styles.personaNameActive,
                      ]}
                    >
                      {persona.name}
                    </Text>
                    <Text
                      style={[
                        styles.personaTag,
                        userId === persona.id && styles.personaTagActive,
                      ]}
                    >
                      {persona.tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tastes List */}
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                🍽️ Learned Preferences
              </Text>
              <View style={styles.tastesList}>
                {TASTE_ITEMS.map((item, idx) => (
                  <View key={idx} style={styles.tasteRow}>
                    <Text style={styles.tasteEmoji}>{item.emoji}</Text>
                    <Text style={styles.tasteLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {userProfile?.preferences && (
                <View style={styles.prefsSummary}>
                  <Text style={styles.prefsSummaryTitle}>
                    Profile: {userProfile.name}
                  </Text>
                  <Text style={styles.prefsSummaryText}>
                    Dietary:{' '}
                    {userProfile.preferences.dietaryPreferences?.join(', ') || 'None'}
                  </Text>
                  <Text style={styles.prefsSummaryText}>
                    Allergies: {userProfile.preferences.allergies?.join(', ') || 'None'}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    paddingBottom: 16,
  },
  safeArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },
  content: {
    maxHeight: 420,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  personasRow: {
    gap: 8,
  },
  personaBtn: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  personaBtnActive: {
    backgroundColor: '#E8F5EE',
    borderColor: '#0D7844',
  },
  personaName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  personaNameActive: {
    color: '#0D7844',
  },
  personaTag: {
    fontSize: 11,
    color: '#6B7280',
  },
  personaTagActive: {
    color: '#0D7844',
    fontWeight: '600',
  },
  tastesList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  tasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tasteEmoji: {
    fontSize: 16,
  },
  tasteLabel: {
    fontSize: 13,
    color: '#374151',
  },
  prefsSummary: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  prefsSummaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  prefsSummaryText: {
    fontSize: 12,
    color: '#4B5563',
  },
  doneBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
