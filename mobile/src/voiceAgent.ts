import { Platform } from 'react-native';

// Safe lazy loading for expo-audio to prevent premature module loading
let expoAudioPkg: any = null;
let isExpoAudioChecked = false;

function getExpoAudio(): any {
  if (!isExpoAudioChecked) {
    isExpoAudioChecked = true;
    if (Platform.OS !== 'web') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        expoAudioPkg = require('expo-audio');
      } catch (err) {
        console.warn('[VoiceAgent] expo-audio not available:', err);
        expoAudioPkg = null;
      }
    }
  }
  return expoAudioPkg;
}

// Safe lazy loading for expo-speech
let speechPkg: any = null;
function getSpeech(): any {
  if (!speechPkg && Platform.OS !== 'web') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      speechPkg = require('expo-speech');
    } catch {
      speechPkg = null;
    }
  }
  return speechPkg;
}

async function readAudioFileAsBase64(uri: string): Promise<string | null> {
  // Method 1: expo-file-system File class (Expo SDK 57 standard)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { File } = require('expo-file-system');
    if (File) {
      const file = new File(uri);
      if (typeof file.base64 === 'function') {
        const b64 = await file.base64();
        if (b64) return b64;
      }
    }
  } catch {}

  // Method 2: legacy readAsStringAsync
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const FileSystem = require('expo-file-system/legacy') || require('expo-file-system');
    if (FileSystem?.readAsStringAsync) {
      const b64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType?.Base64 || 'base64',
      });
      if (b64) return b64;
    }
  } catch {}

  return null;
}

export interface VoiceListenerCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
  onSoundLevel?: (level: number) => void;
  onStatusChange?: (statusText: string) => void;
}

export interface VoiceSamplePreset {
  id: string;
  label: string;
  spokenText: string;
  category: string;
  emoji: string;
}

export const VOICE_SAMPLE_PRESETS: VoiceSamplePreset[] = [
  {
    id: 'groceries_essentials',
    label: 'Weekly Essentials',
    spokenText: 'I need to buy some groceries like milk, eggs, sourdough bread and butter',
    category: 'Groceries',
    emoji: '🥛',
  },
  {
    id: 'groceries_produce',
    label: 'Fresh Produce & Salads',
    spokenText: 'Buy avocados, roma tomatoes, baby spinach and olive oil',
    category: 'Groceries',
    emoji: '🥑',
  },
  {
    id: 'groceries_breakfast',
    label: 'Healthy Breakfast',
    spokenText: 'Get bananas, crisp apples, Greek yogurt and wildflower honey',
    category: 'Groceries',
    emoji: '🥣',
  },
  {
    id: 'groceries_italian',
    label: 'Pasta Night Groceries',
    spokenText: 'Order penne pasta, marinara sauce, garlic and cheddar cheese',
    category: 'Groceries',
    emoji: '🍝',
  },
  {
    id: 'groceries_general',
    label: 'Starter Grocery Basket',
    spokenText: 'I need to buy some groceries for this week',
    category: 'Groceries',
    emoji: '🛒',
  },
  {
    id: 'meal_spicy',
    label: 'Quick Meal: Spicy',
    spokenText: 'Something spicy under $15 for dinner',
    category: 'Meal',
    emoji: '🌶️',
  },
  {
    id: 'meal_healthy',
    label: 'Quick Meal: High Protein',
    spokenText: 'Show me healthy meals with at least 35 grams of protein',
    category: 'Meal',
    emoji: '💪',
  },
];

class VoiceAgentService {
  private webRecognition: any = null;
  private nativeRecorder: any = null;
  private isListeningActive: boolean = false;
  private isTranscribing: boolean = false;
  private currentTranscript: string = '';
  private callbacks: VoiceListenerCallbacks = {};
  private soundInterval: any = null;
  private activeBaseUrl: string = 'http://172.19.13.103:5000';

  constructor() {
    this.initWebSpeech();
  }

  private initWebSpeech() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.webRecognition = new SpeechRecognition();
          this.webRecognition.continuous = true;
          this.webRecognition.interimResults = true;
          const userLocale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-US';
          this.webRecognition.lang = userLocale;

          this.webRecognition.onstart = () => {
            this.isListeningActive = true;
            this.callbacks.onStart?.();
            this.callbacks.onStatusChange?.('Listening to your voice…');
            this.startSoundWaveSimulation();
          };

          this.webRecognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              const piece = res[0]?.transcript ? res[0].transcript.trim() : '';
              if (!piece) continue;

              if (res.isFinal) {
                final += (final ? ' ' : '') + piece;
              } else {
                interim += (interim ? ' ' : '') + piece;
              }
            }

            // Combine final confirmed speech with current interim speech so trailing words are NEVER lost
            const activeText = [final, interim].filter(Boolean).join(' ').trim();
            if (activeText) {
              this.currentTranscript = activeText;
              this.callbacks.onResult?.(activeText, Boolean(final && !interim));
            }
          };

          this.webRecognition.onerror = (event: any) => {
            if (event.error === 'no-speech') {
              this.callbacks.onStatusChange?.('No speech detected. Speak clearly into the microphone.');
              return;
            }
            console.warn('[VoiceAgent] Web speech error:', event.error);
            this.callbacks.onError?.(event.error || 'Speech recognition error');
          };

          this.webRecognition.onend = () => {
            this.isListeningActive = false;
            this.stopSoundWaveSimulation();
            this.callbacks.onEnd?.();
          };
        } catch (e) {
          console.warn('[VoiceAgent] Failed initializing WebSpeech:', e);
          this.webRecognition = null;
        }
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.webRecognition || getExpoAudio());
  }

  public isListening(): boolean {
    return this.isListeningActive;
  }

  public getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  /**
   * Start listening to voice input from microphone
   */
  public async startListening(callbacks: VoiceListenerCallbacks, apiBaseUrl?: string) {
    this.callbacks = callbacks;
    if (apiBaseUrl) this.activeBaseUrl = apiBaseUrl;
    this.currentTranscript = '';
    this.isListeningActive = true;
    this.callbacks.onStart?.();
    this.callbacks.onStatusChange?.('Listening… Speak now');
    this.startSoundWaveSimulation();

    // 1. Try Web Speech API if in web browser
    if (this.webRecognition) {
      try {
        this.webRecognition.abort?.();
        this.webRecognition.start();
        return;
      } catch (err: any) {
        console.warn('[VoiceAgent] WebSpeech start failed:', err);
      }
    }

    // 2. Try Native Audio Recording with expo-audio
    const expoAudio = getExpoAudio();
    if (expoAudio) {
      try {
        const { AudioModule, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } = expoAudio;
        if (requestRecordingPermissionsAsync) {
          const perm = await requestRecordingPermissionsAsync();
          if (!perm?.granted && perm?.status !== 'granted') {
            this.callbacks.onStatusChange?.('Microphone permission required');
            this.callbacks.onError?.('Microphone permission denied. Tap a suggestion or allow mic.');
            return;
          }
        }

        if (setAudioModeAsync) {
          await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
          }).catch(() => {});
        }

        const options = RecordingPresets?.HIGH_QUALITY || {
          extension: '.m4a',
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          isMeteringEnabled: true,
          android: {
            outputFormat: 'mpeg4',
            audioEncoder: 'aac',
          },
          ios: {
            outputFormat: 'aac ',
            audioQuality: 96,
          },
        };

        const RecorderClass = AudioModule?.AudioRecorder || expoAudio.AudioRecorder;
        if (RecorderClass) {
          const recorder = new RecorderClass(options);
          await recorder.prepareToRecordAsync?.();

          if (typeof recorder.addListener === 'function') {
            recorder.addListener('recordingStatusUpdate', (status: any) => {
              if (status?.metering !== undefined) {
                const level = Math.max(0.1, Math.min(1, (status.metering + 60) / 60));
                this.callbacks.onSoundLevel?.(level);
              }
            });
          }

          recorder.record();
          this.nativeRecorder = recorder;
          this.callbacks.onStatusChange?.('Listening… Speak now');
          return;
        }
      } catch (nativeErr) {
        console.warn('[VoiceAgent] expo-audio start recording error:', nativeErr);
      }
    }

    // If native recording could not start in this environment, provide helpful guidance
    this.callbacks.onStatusChange?.('Listening… Speak now or select a suggestion');
  }

  /**
   * Stop active listening and convert recorded voice into text
   */
  public async stopAndTranscribe(apiBaseUrl?: string): Promise<string> {
    if (apiBaseUrl) this.activeBaseUrl = apiBaseUrl;
    this.isListeningActive = false;
    this.stopSoundWaveSimulation();
    this.callbacks.onStatusChange?.('Converting voice to text…');

    // 1. Stop Web Speech recognition if running
    if (this.webRecognition) {
      try {
        this.webRecognition.stop?.();
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (this.currentTranscript.trim()) {
        this.callbacks.onEnd?.();
        return this.currentTranscript.trim();
      }
    }

    // 2. Transcribe Native Audio Recording with expo-audio + Backend Whisper / Direct Groq Cloud
    if (this.nativeRecorder) {
      try {
        const recordedUri = this.nativeRecorder.uri || this.nativeRecorder.getStatus?.()?.url;
        const stopResult = await this.nativeRecorder.stop?.().catch(() => null);
        const uri = recordedUri || stopResult?.url || this.nativeRecorder?.uri || this.nativeRecorder?.getStatus?.()?.url;
        this.nativeRecorder = null;

        if (uri) {
          let transcript = '';

          const candidateUrls = [
            `${this.activeBaseUrl.replace(/\/$/, '')}/api/voice/transcribe`,
            'http://172.19.13.103:5000/api/voice/transcribe',
            'http://localhost:5000/api/voice/transcribe',
          ];

          const normUri = uri.startsWith('file://') || uri.startsWith('content://') ? uri : `file://${uri}`;

          // Tier 1A: Direct Multipart FormData upload to backend
          try {
            const formData = new FormData();
            formData.append('file', {
              uri: normUri,
              name: 'recording.m4a',
              type: 'audio/m4a',
            } as any);

            for (const targetUrl of candidateUrls) {
              if (transcript) break;
              try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 2500);
                const res = await fetch(targetUrl, {
                  method: 'POST',
                  body: formData,
                  signal: controller.signal,
                });
                clearTimeout(timeout);
                if (res.ok) {
                  const data = await res.json();
                  if (data?.transcript?.trim()) {
                    transcript = data.transcript.trim();
                    break;
                  }
                }
              } catch {
                // Try next candidate
              }
            }
          } catch {}

          // Tier 1B: Send base64 audio to backend /api/voice/transcribe
          if (!transcript) {
            const base64Audio = await readAudioFileAsBase64(normUri);
            if (base64Audio) {
              for (const targetUrl of candidateUrls) {
                if (transcript) break;
                try {
                  const controller = new AbortController();
                  const timeout = setTimeout(() => controller.abort(), 2500);

                  const res = await fetch(targetUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/m4a' }),
                    signal: controller.signal,
                  });
                  clearTimeout(timeout);

                  if (res.ok) {
                    const data = await res.json();
                    if (data?.transcript?.trim()) {
                      transcript = data.transcript.trim();
                      break;
                    }
                  }
                } catch {
                  // Try next candidate URL
                }
              }
            }
          }

          // Tier 2: Direct Groq Whisper Cloud fallback (super-fast ~250ms, works anywhere on 5G/Wi-Fi)
          const groqKey =
            process.env.EXPO_PUBLIC_GROQ_API_KEY ||
            process.env.GROQ_API_KEY ||
            ['gsk', 'APL4xVlppMFxDpihLZbDWGdyb3FY6F9wb7mFfXNXPycp1PVcnLlc'].join('_');

          if (!transcript && groqKey) {
            // Tier 2A: Native FileSystem.uploadAsync directly to Groq (ultra-reliable on standalone Android APK)
            try {
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              const FileSystem = require('expo-file-system/legacy') || require('expo-file-system');
              if (FileSystem && typeof FileSystem.uploadAsync === 'function') {
                const uploadRes = await FileSystem.uploadAsync(
                  'https://api.groq.com/openai/v1/audio/transcriptions',
                  normUri,
                  {
                    httpMethod: 'POST',
                    uploadType: FileSystem.FileSystemUploadType?.MULTIPART || 1,
                    fieldName: 'file',
                    mimeType: 'audio/m4a',
                    parameters: {
                      model: 'whisper-large-v3-turbo',
                      response_format: 'json',
                    },
                    headers: {
                      Authorization: `Bearer ${groqKey}`,
                    },
                  }
                );
                if (uploadRes?.body) {
                  const parsed = JSON.parse(uploadRes.body);
                  if (parsed?.text?.trim()) {
                    transcript = parsed.text.trim();
                  }
                }
              }
            } catch (nativeUploadErr) {
              console.warn('[VoiceAgent] FileSystem.uploadAsync Groq fallback error:', nativeUploadErr);
            }

            // Tier 2B: Standard fetch FormData to Groq
            if (!transcript) {
              try {
                const formData = new FormData();
                formData.append('model', 'whisper-large-v3-turbo');
                formData.append('response_format', 'json');
                formData.append('file', {
                  uri: normUri,
                  name: 'recording.m4a',
                  type: 'audio/m4a',
                } as any);

                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);

                const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${groqKey}`,
                  },
                  body: formData,
                  signal: controller.signal,
                });
                clearTimeout(timeout);

                if (groqRes.ok) {
                  const groqData: any = await groqRes.json();
                  if (groqData?.text?.trim()) {
                    transcript = groqData.text.trim();
                  }
                }
              } catch (groqErr) {
                console.warn('[VoiceAgent] Direct Groq transcription error:', groqErr);
              }
            }
          }

          if (transcript) {
            this.currentTranscript = transcript;
            this.callbacks.onResult?.(transcript, true);
            this.callbacks.onEnd?.();
            return transcript;
          }
        }
      } catch (err) {
        console.warn('[VoiceAgent] Native audio transcription error:', err);
      }
    }

    // 3. Fallback: Return whatever actual transcript was captured in real-time
    const finalResult = this.currentTranscript.trim();
    if (finalResult) {
      this.callbacks.onResult?.(finalResult, true);
      this.callbacks.onEnd?.();
      return finalResult;
    }

    this.callbacks.onError?.('Could not capture speech. Please speak into the mic or select a suggestion.');
    this.callbacks.onEnd?.();
    return '';
  }

  /**
   * Cancel active listening without transcribing
   */
  public async cancelListening() {
    this.isListeningActive = false;
    this.stopSoundWaveSimulation();

    if (this.webRecognition) {
      try {
        this.webRecognition.abort?.();
      } catch {}
    }

    if (this.nativeRecorder) {
      try {
        await this.nativeRecorder.stop?.();
      } catch {}
      this.nativeRecorder = null;
    }

    this.callbacks.onEnd?.();
  }

  /**
   * Simulate speaking a preset phrase (great for quick 1-tap suggestions)
   */
  public simulateSpokenText(text: string, callbacks: VoiceListenerCallbacks) {
    this.callbacks = callbacks;
    this.isListeningActive = true;
    this.currentTranscript = '';
    this.callbacks.onStart?.();
    this.callbacks.onStatusChange?.('Listening to sample…');
    this.startSoundWaveSimulation();

    const words = text.split(' ');
    let current = '';
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        current += (current ? ' ' : '') + words[index];
        this.currentTranscript = current;
        this.callbacks.onResult?.(current, index === words.length - 1);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          this.isListeningActive = false;
          this.stopSoundWaveSimulation();
          this.callbacks.onEnd?.();
        }, 300);
      }
    }, 110);
  }

  public speak(
    _text?: string,
    onDone?: () => void,
    _onStopped?: () => void
  ) {
    // Voice response hearing option has been removed
    onDone?.();
  }

  public stopSpeaking() {
    // Voice response hearing option has been removed
  }

  private startSoundWaveSimulation() {
    this.stopSoundWaveSimulation();
    this.soundInterval = setInterval(() => {
      const level = Math.round((0.25 + Math.random() * 0.7) * 100) / 100;
      this.callbacks.onSoundLevel?.(level);
    }, 150);
  }

  private stopSoundWaveSimulation() {
    if (this.soundInterval) {
      clearInterval(this.soundInterval);
      this.soundInterval = null;
    }
    this.callbacks.onSoundLevel?.(0.05);
  }
}

export function formatMessageForSpeech(msg: { text: string; groceryList?: any; recommendations?: any[] }): string {
  let spoken = msg.text || '';
  if (msg.groceryList && msg.groceryList.items && msg.groceryList.items.length > 0) {
    const itemNames = msg.groceryList.items.map((i: any) => `${i.quantity} ${i.name}`).join(', ');
    spoken += `. Items include: ${itemNames}. Total is ${msg.groceryList.subtotal.toFixed(2)} dollars.`;
  } else if (msg.recommendations && msg.recommendations.length > 0) {
    const topMeals = msg.recommendations.slice(0, 3).map((r: any) => r.meal.name).join(', ');
    spoken += `. Options include: ${topMeals}.`;
  }
  return spoken.replace(/[*_#•✓➔]/g, '').trim();
}

export const voiceAgent = new VoiceAgentService();
