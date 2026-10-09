import React, { useState } from 'react';
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
import { QuickSearchFilters } from '../types';

interface MobileFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: QuickSearchFilters;
  onApply: (applied: QuickSearchFilters) => void;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(
    insets.bottom + 12,
    Platform.OS === 'android' ? 36 : 16
  );

  const [draft, setDraft] = useState<QuickSearchFilters>(filters);

  // Sync on open
  React.useEffect(() => {
    setDraft(filters);
  }, [filters, visible]);

  const toggleBudget = (amount: number) => {
    setDraft((prev) => ({
      ...prev,
      budgetCap: prev.budgetCap === amount ? undefined : amount,
    }));
  };

  const toggleWellness = (val: 'high-protein' | 'weight-management' | 'high-fibre') => {
    setDraft((prev) => ({
      ...prev,
      wellness: prev.wellness === val ? undefined : val,
    }));
  };

  const toggleDietary = (val: 'vegetarian' | 'vegan' | 'halal' | 'gluten-free') => {
    setDraft((prev) => ({
      ...prev,
      dietary: prev.dietary === val ? undefined : val,
    }));
  };

  const toggleSpicy = (isSpicy: boolean) => {
    setDraft((prev) => ({
      ...prev,
      spicyFilter: prev.spicyFilter === isSpicy ? undefined : isSpicy,
    }));
  };

  const toggleSlot = (slot: 'lunch' | 'dinner') => {
    setDraft((prev) => ({
      ...prev,
      mealSlot: prev.mealSlot === slot ? undefined : slot,
    }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft({});
    onApply({});
    onClose();
  };

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
              <Text style={styles.headerTitle}>Filter Options</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {/* Budget Cap */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💵 Budget Cap</Text>
                <View style={styles.chipsRow}>
                  {[12, 15, 18, 20].map((cap) => (
                    <TouchableOpacity
                      key={cap}
                      style={[
                        styles.chip,
                        draft.budgetCap === cap && styles.chipActive,
                      ]}
                      onPress={() => toggleBudget(cap)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draft.budgetCap === cap && styles.chipTextActive,
                        ]}
                      >
                        Under ${cap}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Wellness Goals */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🌿 Wellness Focus</Text>
                <View style={styles.chipsRow}>
                  {[
                    { id: 'high-protein', label: '💪 High Protein' },
                    { id: 'weight-management', label: '⚖️ Weight Loss' },
                    { id: 'high-fibre', label: '🌾 High Fibre' },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        draft.wellness === item.id && styles.chipActive,
                      ]}
                      onPress={() => toggleWellness(item.id as any)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draft.wellness === item.id && styles.chipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Dietary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🥗 Dietary</Text>
                <View style={styles.chipsRow}>
                  {[
                    { id: 'vegetarian', label: '🌱 Vegetarian' },
                    { id: 'vegan', label: '🥑 Vegan' },
                    { id: 'halal', label: '🌙 Halal' },
                    { id: 'gluten-free', label: '🌾 Gluten-Free' },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.chip,
                        draft.dietary === item.id && styles.chipActive,
                      ]}
                      onPress={() => toggleDietary(item.id as any)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          draft.dietary === item.id && styles.chipTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Spice */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🌶️ Spice Level</Text>
                <View style={styles.chipsRow}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      draft.spicyFilter === true && styles.chipActive,
                    ]}
                    onPress={() => toggleSpicy(true)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draft.spicyFilter === true && styles.chipTextActive,
                      ]}
                    >
                      🌶️ Spicy
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.chip,
                      draft.spicyFilter === false && styles.chipActive,
                    ]}
                    onPress={() => toggleSpicy(false)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draft.spicyFilter === false && styles.chipTextActive,
                      ]}
                    >
                      😌 Mild
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Meal Slot */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🕒 Meal Time</Text>
                <View style={styles.chipsRow}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      draft.mealSlot === 'lunch' && styles.chipActive,
                    ]}
                    onPress={() => toggleSlot('lunch')}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draft.mealSlot === 'lunch' && styles.chipTextActive,
                      ]}
                    >
                      ☀️ Lunch
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.chip,
                      draft.mealSlot === 'dinner' && styles.chipActive,
                    ]}
                    onPress={() => toggleSlot('dinner')}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        draft.mealSlot === 'dinner' && styles.chipTextActive,
                      ]}
                    >
                      🌙 Dinner
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
    maxHeight: '85%',
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
    marginBottom: 12,
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
    maxHeight: 400,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#0D7844',
    borderColor: '#0D7844',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  clearBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  applyBtn: {
    flex: 1,
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
