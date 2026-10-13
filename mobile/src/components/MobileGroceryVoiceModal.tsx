import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GroceryItem, GroceryOrderList, ChatMessage } from '../types';
import { parseGroceryVoiceTranscript } from '../groceryData';
import { voiceAgent, formatMessageForSpeech } from '../voiceAgent';
import { MobileInChatGroceryCard } from './MobileInChatGroceryCard';
import { MobileThinkingBubble } from './MobileThinkingBubble';
import { MobileVoiceListeningOverlay } from './MobileVoiceListeningOverlay';

const { width } = Dimensions.get('window');

interface MobileGroceryVoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToCart: (mealId: string) => void;
  onAddMultipleToCart?: (items: GroceryItem[]) => void;
  onSendToChat?: (prompt: string) => void;
  onOpenCart?: () => void;
  onProceedToCheckout?: () => void;
  apiBaseUrl?: string;
}

interface GroceryPromptCard {
  icon: string;
  title: string;
  subtitle: string;
  prompt: string;
}

const GROCERY_PROMPT_CARDS: GroceryPromptCard[] = [
  {
    icon: '🥛',
    title: 'Weekly Essentials',
    subtitle: 'Milk, eggs, sourdough bread & butter',
    prompt: 'I need to buy some groceries like milk, eggs, sourdough bread and butter',
  },
  {
    icon: '🥑',
    title: 'Fresh Produce',
    subtitle: 'Avocados, tomatoes, spinach & olive oil',
    prompt: 'Buy avocados, roma tomatoes, baby spinach and olive oil',
  },
  {
    icon: '🥣',
    title: 'Healthy Breakfast',
    subtitle: 'Greek yogurt, bananas, apples & honey',
    prompt: 'Order bananas, crisp apples, Greek yogurt and wildflower honey',
  },
  {
    icon: '🍝',
    title: 'Pasta Night',
    subtitle: 'Penne pasta, marinara sauce & garlic',
    prompt: 'I need penne pasta, marinara sauce, garlic and cheddar cheese',
  },
];

const QUICK_GROCERY_PILLS = [
  { label: '🥛 Milk & Eggs', prompt: 'Whole organic milk and brown eggs' },
  { label: '🍞 Sourdough Bread', prompt: 'Artisan sourdough bread and butter' },
  { label: '🥑 3 Hass Avocados', prompt: '3 ripe Hass avocados' },
  { label: '🧀 Cheese & Dairy', prompt: 'Cheddar cheese block and Greek yogurt' },
  { label: '🍎 Fresh Fruit Basket', prompt: 'Bananas and crisp apples' },
  { label: '🛒 Restock Pantry', prompt: 'Olive oil, jasmine rice and pasta' },
];

export const MobileGroceryVoiceModal: React.FC<MobileGroceryVoiceModalProps> = ({
  visible,
  onClose,
  onAddToCart,
  onAddMultipleToCart,
  onSendToChat,
  onOpenCart,
  onProceedToCheckout,
  apiBaseUrl = 'http://172.19.13.103:5000',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (visible && messages.length === 0) {
      // Clean slate on opening
      setInput('');
      setIsLoading(false);
    }
    if (!visible) {
      voiceAgent.stopSpeaking();
      setSpeakingMsgId(null);
    }
    return () => {
      voiceAgent.stopSpeaking();
    };
  }, [visible]);

  const handleToggleSpeak = (msg: ChatMessage) => {
    if (speakingMsgId === msg.id) {
      voiceAgent.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      voiceAgent.stopSpeaking();
      setSpeakingMsgId(msg.id);
      const textToSpeak = formatMessageForSpeech(msg);
      voiceAgent.speak(
        textToSpeak,
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    voiceAgent.stopSpeaking();
    setSpeakingMsgId(null);

    // Unconditionally clear typing bar immediately
    setInput('');

    const now = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const lower = text.toLowerCase().trim().replace(/[.,!]/g, '');

    // 1. Direct cart & checkout commands
    if (
      lower === 'view cart' ||
      lower === 'view cart & checkout' ||
      lower === 'proceed to payment' ||
      lower === 'proceed to checkout' ||
      lower === 'go to cart' ||
      lower === 'open cart'
    ) {
      if (onProceedToCheckout) {
        onProceedToCheckout();
      } else if (onOpenCart) {
        onOpenCart();
      } else {
        onClose();
      }
      return;
    }

    // 2. Order this / Add list to cart commands
    const isOrderThisCmd =
      lower === 'order this for me' ||
      lower === 'order this' ||
      lower === 'order for me' ||
      lower === 'order it for me' ||
      lower === 'order it' ||
      lower === 'order them' ||
      lower === 'order these' ||
      lower === 'order all' ||
      lower === 'add this to cart' ||
      lower === 'add these to cart' ||
      lower === 'add to cart' ||
      lower === 'add all to cart' ||
      lower === 'proceed with order' ||
      lower === 'proceed to checkout' ||
      lower === 'place order' ||
      lower === 'buy this' ||
      lower === 'order now' ||
      lower.includes('order this') ||
      lower.includes('order for me') ||
      lower.includes('order them') ||
      lower.includes('add this to cart') ||
      lower.includes('add all to cart');

    if (isOrderThisCmd) {
      const latestWithList = [...messages]
        .reverse()
        .find((m) => m.groceryList && m.groceryList.items && m.groceryList.items.length > 0);

      if (latestWithList && latestWithList.groceryList) {
        const checkedItems = latestWithList.groceryList.items.filter(
          (i) => i.checked !== false
        );
        const itemsToOrder =
          checkedItems.length > 0 ? checkedItems : latestWithList.groceryList.items;

        if (onAddMultipleToCart) {
          onAddMultipleToCart(itemsToOrder);
        } else {
          itemsToOrder.forEach((it) => onAddToCart(it.id));
        }

        const totalCost = itemsToOrder
          .reduce((s, i) => s + i.price * i.quantity, 0)
          .toFixed(2);
        const itemNames = itemsToOrder
          .slice(0, 4)
          .map((i) => `${i.quantity}x ${i.name}`)
          .join(', ');

        showToast(`🛒 Added ${itemsToOrder.length} grocery items to cart!`);

        const aiConfirmText = `Done! I've added all ${itemsToOrder.length} items (${itemNames}) to your cart. Total: $${totalCost}. Ready to proceed with checkout?`;

        const userMsg: ChatMessage = {
          id: `user_${Date.now()}`,
          sender: 'user',
          text,
          timestamp: now(),
        };

        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          text: aiConfirmText,
          timestamp: now(),
          quickOptions: [
            '🛒 View Cart & Checkout',
            '💳 Proceed to Payment',
            '➕ Add More Groceries',
          ],
        };

        setMessages((prev) => [...prev, userMsg, aiMsg]);
        setIsLoading(false);

        voiceAgent.speak(
          aiConfirmText,
          () => setSpeakingMsgId(null),
          () => setSpeakingMsgId(null)
        );

        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 150);
        return;
      }
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: now(),
    };

    const aiId = `ai_${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: aiId,
      sender: 'assistant',
      text: '',
      timestamp: now(),
      isStreaming: true,
      statusText: 'Checking fresh grocery market…',
    };

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setIsLoading(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const cleanBase = apiBaseUrl.replace(/\/$/, '');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      const res = await fetch(`${cleanBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_alex', message: text }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const serverGroceryList = data?.groceryList || parseGroceryVoiceTranscript(text);
        const serverText =
          data?.message ||
          `I found ${serverGroceryList.items.length} fresh grocery items matching your request. Here is your grocery list:`;
        const serverOptions = data?.quickOptions || [
          '🛒 Add All to Cart',
          '🥛 More Dairy',
          '🥑 Fresh Produce',
          '🍞 Bakery Items',
          '🔄 Clear & Start Over',
        ];

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? {
                  ...m,
                  text: serverText,
                  isStreaming: false,
                  statusText: undefined,
                  groceryList: serverGroceryList,
                  quickOptions: serverOptions,
                }
              : m
          )
        );
        setIsLoading(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        return;
      }
    } catch (netErr) {
      console.warn('[MobileGroceryModal] Chat request fallback:', netErr);
    }

    // Dynamic intelligent offline fallback for any input
    const parsedGroceryList = parseGroceryVoiceTranscript(text);
    const replyText = `I found ${parsedGroceryList.items.length} fresh grocery items matching your request. Here is your grocery list:`;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiId
          ? {
              ...m,
              text: replyText,
              isStreaming: false,
              statusText: undefined,
              groceryList: parsedGroceryList,
              quickOptions: [
                '🛒 Add All to Cart',
                '🥛 More Dairy',
                '🥑 Fresh Produce',
                '🍞 Bakery Items',
                '🔄 Clear & Start Over',
              ],
            }
          : m
      )
    );

    setIsLoading(false);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleSelectQuickOption = (option: string) => {
    if (option === '🔄 Clear & Start Over') {
      setMessages([]);
      return;
    }
    if (
      option === '🛒 View Cart & Checkout' ||
      option === '💳 Proceed to Payment'
    ) {
      if (onProceedToCheckout) {
        onProceedToCheckout();
      } else if (onOpenCart) {
        onOpenCart();
      } else {
        onClose();
      }
      return;
    }
    if (option === '🛒 Add All to Cart') {
      // Find latest grocery list in messages
      const latestWithList = [...messages]
        .reverse()
        .find((m) => m.groceryList && m.groceryList.items.length > 0);
      if (latestWithList && latestWithList.groceryList) {
        if (onAddMultipleToCart) {
          onAddMultipleToCart(latestWithList.groceryList.items);
        } else {
          latestWithList.groceryList.items.forEach((it) => onAddToCart(it.id));
        }
        showToast(
          `🛒 Added ${latestWithList.groceryList.items.length} grocery items to cart!`
        );
      }
      return;
    }
    handleSend(option);
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backBtnIcon}>←</Text>
            </TouchableOpacity>

            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🛒</Text>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Grocery AI 🛒</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online • Voice & Text Grocery Bot</Text>
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {messages.length > 0 && (
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
                <Text style={styles.resetBtnText}>🔄 Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Toast Popup */}
        {toastMessage && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Chat Scroll Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              /* EMPTY LAUNCH PANEL */
              <View style={styles.launchContainer}>
                {/* Hero Mascot with Floating Doodles */}
                <View style={styles.heroSection}>
                  <View style={styles.mascotWrapper}>
                    <Text style={[styles.floatingDoodle, styles.doodle1]}>🥛</Text>
                    <Text style={[styles.floatingDoodle, styles.doodle2]}>🍞</Text>
                    <Text style={[styles.floatingDoodle, styles.doodle3]}>🥑</Text>
                    <Text style={[styles.floatingDoodle, styles.doodle4]}>🧀</Text>
                    <Text style={[styles.floatingDoodle, styles.doodle5]}>🍎</Text>
                    <Text style={[styles.floatingDoodle, styles.doodle6]}>🥚</Text>

                    <View style={styles.mascotBadge}>
                      <Text style={styles.mascotBadgeEmoji}>🛒</Text>
                    </View>
                  </View>

                  <Text style={styles.launchTitle}>What groceries do you need?</Text>
                  <Text style={styles.launchSubtitle}>
                    Speak into the mic or type items below. I'll build your fresh grocery list instantly!
                  </Text>
                </View>

                {/* 2x2 Grid of Grocery Prompt Cards */}
                <View style={styles.grid}>
                  {GROCERY_PROMPT_CARDS.map((card, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.promptCard}
                      activeOpacity={0.7}
                      onPress={() => handleSend(card.prompt)}
                    >
                      <View style={styles.promptIconBox}>
                        <Text style={styles.promptIcon}>{card.icon}</Text>
                      </View>
                      <Text style={styles.promptTitle}>{card.title}</Text>
                      <Text style={styles.promptSub} numberOfLines={2}>
                        {card.subtitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quick Suggestion Pills */}
                <View style={styles.trySection}>
                  <Text style={styles.tryHeading}>Or try asking...</Text>
                  <View style={styles.pillsRow}>
                    {QUICK_GROCERY_PILLS.map((pill, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.tryPill}
                        activeOpacity={0.7}
                        onPress={() => handleSend(pill.prompt)}
                      >
                        <Text style={styles.tryPillText}>{pill.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              /* CHAT MESSAGES */
              messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isAssistantThinking =
                  !isUser && Boolean(msg.isStreaming) && (!msg.text || msg.text.trim().length === 0);

                if (isAssistantThinking) {
                  return (
                    <View key={`thinking-${msg.id || idx}`} style={[styles.msgRow, styles.msgAssistant]}>
                      <MobileThinkingBubble statusText={msg.statusText || 'Finding fresh groceries…'} />
                    </View>
                  );
                }

                return (
                  <View
                    key={`msg-${msg.id || idx}`}
                    style={[styles.msgRow, isUser ? styles.msgUser : styles.msgAssistant]}
                  >
                    {!isUser && (
                      <View style={styles.msgAvatar}>
                        <Text style={styles.msgAvatarText}>🛒</Text>
                      </View>
                    )}

                    <View style={[styles.bubbleCol, !isUser && !!msg.groceryList && styles.bubbleColFull]}>
                      {/* Message Text Bubble */}
                      {msg.text ? (
                        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
                            {msg.text}
                          </Text>

                          {/* Speaker Button to listen to voice response */}
                          {!isUser && !msg.isStreaming && (
                            <View style={styles.bubbleFooter}>
                              <TouchableOpacity
                                style={[
                                  styles.speakerBtn,
                                  speakingMsgId === msg.id && styles.speakerBtnActive,
                                ]}
                                onPress={() => handleToggleSpeak(msg)}
                                activeOpacity={0.7}
                                accessibilityRole="button"
                                accessibilityLabel={
                                  speakingMsgId === msg.id ? 'Stop audio' : 'Listen to response'
                                }
                              >
                                <Text style={styles.speakerIcon}>
                                  {speakingMsgId === msg.id ? '🔊' : '🔈'}
                                </Text>
                                <Text
                                  style={[
                                    styles.speakerBtnText,
                                    speakingMsgId === msg.id && styles.speakerBtnTextActive,
                                  ]}
                                >
                                  {speakingMsgId === msg.id ? 'Speaking…' : 'Listen'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ) : null}

                      {/* Interactive Grocery List Card */}
                      {msg.groceryList ? (
                        <MobileInChatGroceryCard
                          groceryList={msg.groceryList}
                          onAddToCart={(item) => {
                            onAddToCart(item.id);
                            showToast(`🛒 Added ${item.name} to cart!`);
                          }}
                          onAddAllToCart={(items) => {
                            if (onAddMultipleToCart) {
                              onAddMultipleToCart(items);
                            } else {
                              items.forEach((it) => onAddToCart(it.id));
                            }
                            showToast(`🛒 Added ${items.length} items to cart!`);
                          }}
                        />
                      ) : null}

                      {/* Quick Option Suggestion Chips */}
                      {msg.quickOptions && msg.quickOptions.length > 0 && !msg.isStreaming ? (
                        <View style={styles.chipsWrap}>
                          {msg.quickOptions.map((opt, i) => (
                            <TouchableOpacity
                              key={i}
                              style={styles.chipBtn}
                              onPress={() => handleSelectQuickOption(opt)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.chipBtnText}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Chat Typing Bar & Voice Mic Button */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask Grocery AI (e.g. milk, eggs)..."
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />

              {/* Voice Mic Button */}
              <TouchableOpacity
                style={styles.micBtn}
                activeOpacity={0.7}
                onPress={() => setIsVoiceOverlayOpen(true)}
              >
                <Text style={styles.micIcon}>🎙️</Text>
              </TouchableOpacity>

              {/* Circular Send Button */}
              <TouchableOpacity
                style={[styles.sendCircleBtn, (!input.trim() || isLoading) && styles.sendCircleBtnDisabled]}
                onPress={() => handleSend()}
                disabled={!input.trim() || isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.sendCircleBtnText}>➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Voice Listening Overlay */}
        <MobileVoiceListeningOverlay
          visible={isVoiceOverlayOpen}
          onClose={() => setIsVoiceOverlayOpen(false)}
          apiBaseUrl={apiBaseUrl}
          onSendTranscript={(transcript) => {
            setIsVoiceOverlayOpen(false);
            setInput('');
            handleSend(transcript);
          }}
          initialTranscript={input}
          hint='Speak groceries (e.g. "I need whole milk, brown eggs, sourdough bread and tomatoes")'
        />
      </SafeAreaView>
    </Modal>
  );
};

const cardWidth = (width - 44) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    padding: 6,
  },
  backBtnIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  toast: {
    position: 'absolute',
    top: 64,
    alignSelf: 'center',
    backgroundColor: '#065F46',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  launchContainer: {
    paddingTop: 8,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mascotWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  floatingDoodle: {
    position: 'absolute',
    fontSize: 20,
  },
  doodle1: { top: 0, left: 6 },
  doodle2: { top: 4, right: 6 },
  doodle3: { bottom: 6, left: 0 },
  doodle4: { bottom: 6, right: 0 },
  doodle5: { top: '35%', left: -14 },
  doodle6: { top: '35%', right: -14 },
  mascotBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  mascotBadgeEmoji: {
    fontSize: 30,
  },
  launchTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  launchSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  promptCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  promptIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  promptIcon: {
    fontSize: 20,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  promptSub: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  trySection: {
    marginTop: 4,
  },
  tryHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tryPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  msgRow: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  msgUser: {
    justifyContent: 'flex-end',
  },
  msgAssistant: {
    justifyContent: 'flex-start',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  msgAvatarText: {
    fontSize: 16,
  },
  bubbleCol: {
    maxWidth: '85%',
  },
  bubbleColFull: {
    maxWidth: '100%',
    width: '100%',
    flex: 1,
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: '#1E293B',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bubbleTextAssistant: {
    color: '#1F2937',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  speakerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  speakerBtnActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  speakerIcon: {
    fontSize: 13,
  },
  speakerBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  speakerBtnTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  chipBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  chipBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#111827',
    paddingHorizontal: 6,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  micIcon: {
    fontSize: 18,
  },
  sendCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCircleBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  sendCircleBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
