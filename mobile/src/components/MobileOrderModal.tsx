import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface MobileOrderModalProps {
  visible: boolean;
  onClose: () => void;
  total: number;
  summaryText?: string;
  onConfirm: () => Promise<any>;
}

export const MobileOrderModal: React.FC<MobileOrderModalProps> = ({
  visible,
  onClose,
  total,
  summaryText,
  onConfirm,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 1800);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {done ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Order Placed!</Text>
              <Text style={styles.successSub}>
                Your Daily Drop order is confirmed and scheduled.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Confirm Your Order</Text>
              <Text style={styles.summary}>
                {summaryText || 'Your selected items are ready.'}
              </Text>

              <View style={styles.totalBox}>
                <Text style={styles.totalLabel}>Total Due:</Text>
                <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
              </View>

              <Text style={styles.disclaimer}>
                Place this order? We require explicit confirmation before submitting payment.
              </Text>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.editBtn} onPress={onClose}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirm}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmBtnText}>Confirm Order</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: '#1B2333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  summary: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 14,
  },
  totalBox: {
    backgroundColor: '#141B26',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontSize: 14,
  },
  totalVal: {
    color: '#34D399',
    fontWeight: '800',
    fontSize: 18,
  },
  disclaimer: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#FF5A36',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    fontSize: 36,
    color: '#10B981',
    fontWeight: '800',
    marginBottom: 8,
  },
  successTitle: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  successSub: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
});
