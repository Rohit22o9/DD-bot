import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MobileOrderConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  total: number;
  summaryText?: string;
  onConfirm: () => void;
}

export const MobileOrderConfirmModal: React.FC<MobileOrderConfirmModalProps> = ({
  visible,
  onClose,
  total,
  summaryText,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <SafeAreaView>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🛍️</Text>
            </View>

            <Text style={styles.title}>Confirm Your Order</Text>

            <Text style={styles.summary}>
              {summaryText || 'Your selected meals from Daily Drop'}
            </Text>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total to Pay</Text>
              <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Text style={styles.confirmText}>Place Order Now</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D7844',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  confirmBtn: {
    flex: 2,
    backgroundColor: '#0D7844',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
