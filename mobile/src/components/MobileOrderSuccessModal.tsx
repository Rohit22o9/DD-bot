import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface MobileOrderSuccessModalProps {
  visible: boolean;
  orderNumber?: string;
  total?: number;
  onClose: () => void;
  onTrackOrder?: () => void;
}

export const MobileOrderSuccessModal: React.FC<MobileOrderSuccessModalProps> = ({
  visible,
  orderNumber = '362513',
  total = 0,
  onClose,
  onTrackOrder,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0.75)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.75);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.dialog,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Celebratory Icon Circle */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🎉</Text>
          </View>

          {/* Main Title */}
          <Text style={styles.title}>Your Order is Placed! 🎉</Text>
          <Text style={styles.subtitle}>
            Order #{orderNumber} has been received by our kitchen.
          </Text>

          {/* Order Details Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoRowIcon}>👨‍🍳</Text>
              <View style={styles.infoRowCol}>
                <Text style={styles.infoRowTitle}>Kitchen Status</Text>
                <Text style={styles.infoRowVal}>Preparing your fresh daily drop</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoRowIcon}>🚀</Text>
              <View style={styles.infoRowCol}>
                <Text style={styles.infoRowTitle}>Estimated Delivery</Text>
                <Text style={styles.infoRowVal}>25 – 35 minutes</Text>
              </View>
            </View>

            {total > 0 && (
              <>
                <View style={styles.infoDivider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoRowIcon}>💳</Text>
                  <View style={styles.infoRowCol}>
                    <Text style={styles.infoRowTitle}>Total Paid</Text>
                    <Text style={styles.infoRowVal}>${total.toFixed(2)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.88}
              onPress={() => {
                onClose();
                onTrackOrder?.();
              }}
            >
              <Text style={styles.primaryBtnText}>Great, Track Order 🚀</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissBtn}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.dismissBtnText}>Back to Chat</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: Math.min(SCREEN_WIDTH - 40, 360),
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoRowIcon: {
    fontSize: 20,
  },
  infoRowCol: {
    flex: 1,
  },
  infoRowTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  infoRowVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  actions: {
    width: '100%',
    gap: 8,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dismissBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  dismissBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
});
