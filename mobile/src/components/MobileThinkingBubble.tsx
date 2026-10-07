import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface MobileThinkingBubbleProps {
  statusText?: string;
}

const THINKING_STEPS = [
  'Thinking…',
  "Checking today's menu…",
  'Matching your taste profile…',
  'Curating recommendations…',
];

export const MobileThinkingBubble: React.FC<MobileThinkingBubbleProps> = ({
  statusText,
}) => {
  // 3 Bouncing Dots Animations
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Pulse effect on thinking badge
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Staggered jumping dots loop
    const createDotAnim = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -6,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.delay(400 - delay),
        ])
      );

    const anim1 = createDotAnim(dot1, 0);
    const anim2 = createDotAnim(dot2, 140);
    const anim3 = createDotAnim(dot3, 280);

    anim1.start();
    anim2.start();
    anim3.start();

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Cycle thinking status messages every 700ms so user sees dynamic steps
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 700);

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      pulse.stop();
      clearInterval(stepInterval);
    };
  }, []);

  const displayStatus =
    statusText && statusText !== 'Thinking…'
      ? statusText
      : THINKING_STEPS[currentStepIndex];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.avatarBox, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.avatarEmoji}>🤖</Text>
      </Animated.View>

      <View style={styles.bubble}>
        {/* Animated Bouncing Dots */}
        <View style={styles.dotsRow}>
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
          />
          <Animated.View
            style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
          />
        </View>

        {/* Live Step Label */}
        <Text style={styles.statusText}>{displayStatus}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    gap: 8,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0D7844',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1EFE2',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    height: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D7844',
  },
  statusText: {
    fontSize: 13,
    color: '#0D7844',
    fontWeight: '700',
  },
});
