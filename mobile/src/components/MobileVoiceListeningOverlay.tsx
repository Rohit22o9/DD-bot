import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { voiceAgent, VOICE_SAMPLE_PRESETS, VoiceSamplePreset } from '../voiceAgent';

interface MobileVoiceListeningOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSendTranscript: (transcript: string) => void;
  initialTranscript?: string;
  hint?: string;
  apiBaseUrl?: string;
}

export const MobileVoiceListeningOverlay: React.FC<MobileVoiceListeningOverlayProps> = ({
  visible,
  onClose,
  onSendTranscript,
  initialTranscript = '',
  hint = 'Say something like: "I need to buy some groceries like milk and eggs" or "Something spicy under $15"',
  apiBaseUrl = 'http://172.19.13.103:5000',
}) => {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0.2);
  const [statusMessage, setStatusMessage] = useState('Listening… Speak now');
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef<any>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveBars = useRef([
    new Animated.Value(8),
    new Animated.Value(14),
    new Animated.Value(24),
    new Animated.Value(18),
    new Animated.Value(10),
  ]).current;

  const clearTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (visible) {
      setTranscript(initialTranscript);
      setIsTranscribing(false);
      setStatusMessage('Listening… Speak now');
      startVoiceListening();

      // Pulsing mic animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      clearTimer();
      voiceAgent.cancelListening();
      setIsListening(false);
      setIsTranscribing(false);
    }

    return () => {
      clearTimer();
      voiceAgent.cancelListening();
    };
  }, [visible]);

  // Animate wave bars based on sound level
  useEffect(() => {
    if (isListening) {
      waveBars.forEach((anim, idx) => {
        const targetHeight = Math.max(8, Math.min(36, 10 + soundLevel * (idx % 2 === 0 ? 32 : 22)));
        Animated.timing(anim, {
          toValue: targetHeight,
          duration: 150,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [soundLevel, isListening]);

  const startVoiceListening = async () => {
    clearTimer();
    setIsListening(true);
    setIsTranscribing(false);
    setStatusMessage('Listening… Speak now');
    setCountdown(5);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleFinishAndSend();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    await voiceAgent.startListening(
      {
        onStart: () => {
          setIsListening(true);
        },
        onResult: (text, isFinal) => {
          setTranscript(text);
        },
        onSoundLevel: (lvl) => {
          setSoundLevel(lvl);
        },
        onStatusChange: (status) => {
          setStatusMessage(status);
        },
        onError: (err) => {
          console.warn('Voice error:', err);
        },
        onEnd: () => {
          setIsListening(false);
        },
      },
      apiBaseUrl
    );
  };

  const handleFinishAndSend = async () => {
    clearTimer();
    if (isTranscribing) return;
    setIsTranscribing(true);
    setIsListening(false);
    setStatusMessage('Converting voice with AI Whisper…');

    const result = await voiceAgent.stopAndTranscribe(apiBaseUrl);
    const clean = (result || transcript).trim();

    if (!clean) {
      setIsTranscribing(false);
      setStatusMessage('No speech detected. Speak into mic or tap a suggestion below.');
      return;
    }

    setTranscript(clean);
    setStatusMessage(`Voice recognized! Sending to bot: "${clean}"`);

    // Auto-send converted text to bot after 350ms so user sees the converted text
    setTimeout(() => {
      onSendTranscript(clean);
      onClose();
    }, 400);
  };

  const handleSelectPreset = (preset: VoiceSamplePreset) => {
    clearTimer();
    voiceAgent.cancelListening();
    setIsListening(false);
    setTranscript(preset.spokenText);
    setStatusMessage(`Selected: "${preset.label}"`);

    setTimeout(() => {
      onSendTranscript(preset.spokenText);
      onClose();
    }, 400);
  };

  const handleCancel = () => {
    clearTimer();
    voiceAgent.cancelListening();
    setIsListening(false);
    setIsTranscribing(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerIcon}>🎙️</Text>
              <Text style={styles.headerTitle}>Drop AI Voice Agent</Text>
            </View>
            <TouchableOpacity onPress={handleCancel} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Center Mic & Sound Wave Visualizer */}
          <View style={styles.visualizerContainer}>
            <Animated.View
              style={[
                styles.micHalo,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: isListening ? 0.4 : 0.1,
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.micCircle,
                isListening && styles.micCircleActive,
                isTranscribing && styles.micCircleTranscribing,
              ]}
              onPress={isListening ? handleFinishAndSend : startVoiceListening}
              activeOpacity={0.8}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Text style={styles.micEmoji}>🎙️</Text>
              )}
            </TouchableOpacity>

            {/* Sound Wave Bars */}
            <View style={styles.waveBarsRow}>
              {waveBars.map((barAnim, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.waveBar,
                    { height: barAnim },
                    isTranscribing && styles.waveBarDimmed,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.listeningStatus}>
              {isTranscribing
                ? '⚡ Converting speech with AI Whisper…'
                : isListening
                ? `🎙️ Listening… Speak now (Auto-sending in ${countdown}s)`
                : statusMessage}
            </Text>
            {isListening && (
              <Text style={styles.tapToFinishHint}>
                Tap mic or 'Finish & Send' when done speaking
              </Text>
            )}
          </View>

          {/* Transcript Display Box */}
          <View style={styles.transcriptBox}>
            <View style={styles.transcriptHeaderRow}>
              <Text style={styles.transcriptLabel}>
                {isTranscribing ? 'Transcribing Audio…' : 'Converted Text:'}
              </Text>
              {Boolean(transcript) && (
                <TouchableOpacity onPress={() => setTranscript('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.clearTextBtn}>✕ Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.transcriptInput}
              value={transcript}
              onChangeText={setTranscript}
              placeholder={isTranscribing ? 'Processing voice with AI Whisper…' : hint}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              editable={!isTranscribing}
            />
          </View>

          {/* Quick Voice Prompt Suggestions */}
          <View style={styles.presetsSection}>
            <Text style={styles.presetsTitle}>Quick Voice Suggestions:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsList}
            >
              {VOICE_SAMPLE_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.presetChip}
                  onPress={() => handleSelectPreset(preset)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                  <Text style={styles.presetText}>{preset.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                isTranscribing && styles.sendBtnTranscribing,
              ]}
              onPress={handleFinishAndSend}
              activeOpacity={0.8}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <View style={styles.transcribingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.sendBtnText}>Converting…</Text>
                </View>
              ) : (
                <Text style={styles.sendBtnText}>
                  {isListening ? `✓ Finish & Send (${countdown}s)` : 'Send to Bot ➔'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 17,
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
  closeBtnText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  visualizerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  micHalo: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10B981',
  },
  micCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  micCircleActive: {
    backgroundColor: '#047857',
  },
  micCircleTranscribing: {
    backgroundColor: '#2563EB',
  },
  micEmoji: {
    fontSize: 30,
  },
  waveBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    height: 36,
  },
  waveBar: {
    width: 5,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  waveBarDimmed: {
    opacity: 0.3,
  },
  listeningStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginTop: 8,
  },
  tapToFinishHint: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  transcriptBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 74,
    marginBottom: 14,
  },
  transcriptHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  transcriptLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearTextBtn: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  transcriptInput: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    fontWeight: '600',
    padding: 0,
    margin: 0,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  transcriptText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    fontWeight: '600',
  },
  transcriptPlaceholder: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontWeight: '400',
  },
  presetsSection: {
    marginBottom: 18,
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
  },
  presetsList: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  presetEmoji: {
    fontSize: 14,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  sendBtn: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  sendBtnTranscribing: {
    backgroundColor: '#2563EB',
  },
  transcribingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
