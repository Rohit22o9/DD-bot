import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { useDropAI } from './useDropAI';
import { MobileChatLaunchScreen } from './components/MobileChatLaunchScreen';
import { MobileQuickQuestions } from './components/MobileQuickQuestions';
import { MobileMealCard } from './components/MobileMealCard';
import { MobileAddedCard } from './components/MobileAddedCard';
import { MobileFloatingCartBar } from './components/MobileFloatingCartBar';
import { MobileCartDrawer } from './components/MobileCartDrawer';
import { MobileInChatCartCard } from './components/MobileInChatCartCard';
import { MobileFilterModal } from './components/MobileFilterModal';
import { MobileTasteProfileModal } from './components/MobileTasteProfileModal';
import { MobileOrderConfirmModal } from './components/MobileOrderConfirmModal';
import { MobileWeeklyPlan } from './components/MobileWeeklyPlan';
import { MobileDropForMeWidget } from './components/MobileDropForMeWidget';
import { MobileThinkingBubble } from './components/MobileThinkingBubble';
import { MobileGameFullScreenModal } from './components/games/MobileGameFullScreenModal';
import { MobileInChatGameCard } from './components/games/MobileInChatGameCard';
import { MobileGamesModal } from './components/MobileGamesModal';
import { QuickSearchFilters, Cart, UserProfile, GamePayload } from './types';

export interface DropAIScreenProps {
  apiBaseUrl?: string;
  initialUserId?: string;
  activePrompt?: string;
  onClearActivePrompt?: () => void;
  onCartUpdated?: (cart: Cart | null) => void;
  onProfileUpdated?: (profile: UserProfile | null) => void;
}

export const DropAIScreen: React.FC<DropAIScreenProps> = ({
  apiBaseUrl = 'https://dd-bot-hx7u.onrender.com', // Live Render Cloud Backend
  initialUserId = 'user_alex',
  activePrompt,
  onClearActivePrompt,
  onCartUpdated,
  onProfileUpdated,
}) => {
  const [userId, setUserId] = useState(initialUserId);
  const [activeBaseUrl, setActiveBaseUrl] = useState(apiBaseUrl);

  const {
    messages,
    isLoading,
    cart,
    userProfile,
    sendMessage,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    confirmOrder,
    refreshCart,
    refreshProfile,
    resetChat,
  } = useDropAI({ apiBaseUrl: activeBaseUrl, userId });

  useEffect(() => {
    if (activePrompt && activePrompt.trim().length > 0) {
      sendMessage(activePrompt.trim());
      onClearActivePrompt?.();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [activePrompt]);

  useEffect(() => {
    onCartUpdated?.(cart);
  }, [cart]);

  useEffect(() => {
    onProfileUpdated?.(userProfile);
  }, [userProfile]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track keyboard height directly and scroll to bottom so input bar is always above the keyboard
  useEffect(() => {
    const onKeyboardShow = (e: any) => {
      const h = e?.endCoordinates?.height || 0;
      setKeyboardHeight(h);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [input, setInput] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTasteProfileOpen, setIsTasteProfileOpen] = useState(false);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);
  const [activeGamePayload, setActiveGamePayload] = useState<GamePayload | null>(null);
  const lastGameMsgIdRef = useRef<string | null>(null);

  // Automatically open the full-screen game view when an assistant message introduces a game
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (
      lastMsg &&
      lastMsg.sender === 'assistant' &&
      !lastMsg.isStreaming &&
      lastMsg.gamePayload &&
      lastMsg.id !== lastGameMsgIdRef.current
    ) {
      lastGameMsgIdRef.current = lastMsg.id;
      setActiveGamePayload(lastMsg.gamePayload);
    }
  }, [messages]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<QuickSearchFilters>({});
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    total: number;
    summary?: string;
  }>({ visible: false, total: 0 });

  const scrollRef = useRef<ScrollView>(null);

  const cartItemCount = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;
  const cartTotal = cart?.total || 0;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    sendMessage(text);
    if (!textToSend) setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleApplyFilters = (filters: QuickSearchFilters) => {
    setActiveFilters(filters);
    const parts: string[] = [];
    if (filters.budgetCap) parts.push(`under $${filters.budgetCap}`);
    if (filters.wellness) {
      if (filters.wellness === 'high-protein') parts.push('high-protein');
      else if (filters.wellness === 'weight-management') parts.push('weight-management');
      else if (filters.wellness === 'high-fibre') parts.push('high-fibre');
    }
    if (filters.dietary) parts.push(filters.dietary);
    if (filters.spicyFilter !== undefined) parts.push(filters.spicyFilter ? 'spicy' : 'mild');
    if (filters.mealSlot) parts.push(filters.mealSlot);

    const query = parts.length > 0 ? `Show ${parts.join(' ')} options` : 'Recommend meals for me';
    handleSend(query);
  };

  const handleSwitchUser = (newUserId: string) => {
    setUserId(newUserId);
    setIsTasteProfileOpen(false);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleUpdateCartQuantity = async (mealId: string, quantity: number) => {
    await updateCartQuantity(mealId, quantity);
  };

  const handleRemoveFromCart = async (mealId: string) => {
    await removeFromCart(mealId);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastFadeAnim = useRef(new Animated.Value(0)).current;
  const toastSlideAnim = useRef(new Animated.Value(-20)).current;
  const toastTimeoutRef = useRef<any>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastFadeAnim.setValue(0);
    toastSlideAnim.setValue(-20);
    Animated.parallel([
      Animated.timing(toastFadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(toastSlideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    toastTimeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastFadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(toastSlideAnim, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setToastMessage(null));
    }, 2500);
  }, [toastFadeAnim, toastSlideAnim]);

  const handleAddToCart = (mealId: string, quantity?: number) => {
    addToCart(mealId, quantity);
    showToast('Your meal is added to cart! 🛍️');
  };

  const activeFilterCount = [
    activeFilters.budgetCap !== undefined,
    activeFilters.wellness !== undefined,
    activeFilters.dietary !== undefined,
    activeFilters.spicyFilter !== undefined,
    activeFilters.mealSlot !== undefined,
  ].filter(Boolean).length;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Matching Reference Mockup */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              resetChat();
              setInput('');
            }}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.sparkleBadge}>
            <Text style={styles.sparkleEmoji}>✨</Text>
          </View>

          <View style={styles.headerTitles}>
            <Text style={styles.headerName}>Drop AI ✨</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online • Ready to help 🍽️</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* 🎮 Food Discovery Games Button */}
          <TouchableOpacity
            style={styles.gameHeaderBtn}
            activeOpacity={0.75}
            onPress={() => setIsGamesModalOpen(true)}
          >
            <Text style={styles.gameHeaderEmoji}>🎮</Text>
            <View style={styles.gameHeaderBadge}>
              <Text style={styles.gameHeaderBadgeText}>GAMES</Text>
            </View>
          </TouchableOpacity>

          {/* 3-Dots Menu */}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setIsMenuOpen((prev) => !prev)}
          >
            <Text style={styles.menuText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Popover Menu */}
      {isMenuOpen && (
        <View style={styles.popoverMenu}>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              setIsGamesModalOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.popoverItemText}>🎮 Discovery Games</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              setIsTasteProfileOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.popoverItemText}>🍽️ Taste Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              setIsFilterOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.popoverItemText}>🎛️ Filter Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popoverItem}
            onPress={() => {
              handleSend('Help me choose what to eat');
              setIsMenuOpen(false);
            }}
          >
            <Text style={styles.popoverItemText}>🔄 Start New Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Added to Cart Toast Popup */}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastPopup,
            {
              opacity: toastFadeAnim,
              transform: [{ translateY: toastSlideAnim }],
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.toastContent}>
            <Text style={styles.toastEmoji}>🛍️</Text>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Keyboard Avoiding Container */}
      <KeyboardAvoidingView
        style={[
          styles.keyboardContainer,
          Platform.OS === 'android' && { paddingBottom: keyboardHeight },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Scrollable Conversation Stream */}
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              scrollRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.length === 0 ? (
            /* PANEL 1: LAUNCH SCREEN */
            <MobileChatLaunchScreen onSelectPrompt={(p) => handleSend(p)} />
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const isAddToCartFlow =
                Boolean(msg.addedCartItem) ||
                Boolean(msg.addedCartItems && msg.addedCartItems.length > 0) ||
                msg.text.toLowerCase().includes('added to your cart') ||
                msg.text.toLowerCase().includes('added to cart') ||
                msg.text.toLowerCase().includes('to your bag') ||
                msg.text.toLowerCase().startsWith('added!') ||
                msg.text.toLowerCase().includes('added! ✅');

              const prevUserMsg = idx > 0 ? messages.slice(0, idx).reverse().find((m) => m.sender === 'user') : null;
              const isSidesOrDrinksRequest = prevUserMsg && /side|drink|dessert|soup|salad/i.test(prevUserMsg.text);

              const isSidesOrDrinksIntroText = !isUser && (
                /sides? to complement|drinks? to complement|fresh.*delicious sides|refreshing drinks|to complement your meal/i.test(msg.text || '') ||
                (Boolean(msg.recommendations && msg.recommendations.length > 0) && isSidesOrDrinksRequest)
              );

              const isAssistantThinking = !isUser && Boolean(msg.isStreaming) && (!msg.text || msg.text.trim().length === 0);

              if (isAssistantThinking) {
                return (
                  <View key={`thinking-${msg.id || idx}-${idx}`} style={[styles.msgRow, styles.msgAssistant]}>
                    <MobileThinkingBubble statusText={msg.statusText} />
                  </View>
                );
              }

              const shouldShowBubble = isUser
                ? Boolean(msg.text && msg.text.trim().length > 0)
                : Boolean(
                    msg.text &&
                    msg.text.trim().length > 0 &&
                    !isAddToCartFlow &&
                    !isSidesOrDrinksIntroText
                  );

              const hasOtherContent =
                isAddToCartFlow ||
                Boolean(msg.recommendations && msg.recommendations.length > 0) ||
                Boolean(msg.healthGoals && msg.healthGoals.length > 0) ||
                Boolean(msg.usualOrder) ||
                Boolean(msg.budgetBasket) ||
                Boolean(msg.dropForMe) ||
                Boolean(msg.weeklyPlan) ||
                Boolean(msg.gamePayload) ||
                Boolean(msg.inChatCart) ||
                Boolean(msg.quickOptions && msg.quickOptions.length > 0 && !isAddToCartFlow);

              if (!shouldShowBubble && !hasOtherContent) {
                return null;
              }

              return (
                <View
                  key={`msg-${msg.id || idx}-${idx}`}
                  style={[
                    styles.msgRow,
                    isUser ? styles.msgUser : styles.msgAssistant,
                  ]}
                >
                  {!isUser && (
                    <View style={styles.aiAvatar}>
                      <Text style={styles.aiAvatarText}>🤖</Text>
                    </View>
                  )}

                  <View style={styles.bubbleCol}>
                    {/* Main Bubble */}
                    {shouldShowBubble && (
                      <View
                        style={[
                          styles.bubble,
                          isUser ? styles.bubbleUser : styles.bubbleAssistant,
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            isUser
                              ? styles.bubbleTextUser
                              : styles.bubbleTextAssistant,
                          ]}
                        >
                          {msg.text}
                          {!isUser && msg.isStreaming ? (
                            <Text style={styles.cursorText}> ▮</Text>
                          ) : null}
                        </Text>
                      </View>
                    )}

                    {/* PANEL 2: HEALTH GOAL QUESTION CARDS */}
                    {!msg.isStreaming && msg.healthGoals && msg.healthGoals.length > 0 && (
                      <MobileQuickQuestions
                        goals={msg.healthGoals}
                        dismissPrompt={msg.dismissGoalPrompt}
                        onSelectGoal={(p) => handleSend(p)}
                      />
                    )}

                    {/* PANEL 4: INLINE ADDED CARD WITH STEPPER AND FOLLOW-UP CHIPS */}
                    {!msg.isStreaming && isAddToCartFlow && (
                      <MobileAddedCard
                        meal={msg.addedCartItem?.meal}
                        quantity={msg.addedCartItem?.quantity}
                        items={msg.addedCartItems}
                        onUpdateQuantity={(mealId, q) => {
                          handleUpdateCartQuantity(mealId, q);
                        }}
                        onSelectOption={(opt) => handleSend(opt)}
                      />
                    )}

                    {/* IN-CHAT CART CARD WIDGET */}
                    {!msg.isStreaming && msg.inChatCart && (
                      <MobileInChatCartCard
                        cart={cart}
                        onUpdateQuantity={(mealId, q) => {
                          handleUpdateCartQuantity(mealId, q);
                        }}
                        onRemoveItem={(mealId) => {
                          removeFromCart(mealId);
                        }}
                        onClearCart={() => {
                          clearCart();
                        }}
                        onCheckout={() => {
                          if (cart && cart.items.length > 0) {
                            setConfirmModal({
                              visible: true,
                              total: cartTotal,
                              summary: cart.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
                            });
                          }
                        }}
                        onOpenCartDrawer={() => setIsCartOpen(true)}
                      />
                    )}

                    {/* PANEL 3: MEAL RECOMMENDATIONS (HORIZONTAL SCROLL WITH STAGGER) */}
                    {!msg.isStreaming && msg.recommendations && msg.recommendations.length > 0 && (
                      <View style={styles.recsSection}>
                        <View style={styles.recsHeader}>
                          <Text style={styles.recsSparkle}>✨</Text>
                          <Text style={styles.recsTitle}>
                            Curated meals ({msg.recommendations.length})
                          </Text>
                        </View>

                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={styles.recsScroll}
                        >
                          {msg.recommendations.map((rec, index) => (
                            <MobileMealCard
                              key={`rec-${rec.meal.id}-${index}`}
                              recommendation={rec}
                              index={index}
                              onAddToCart={handleAddToCart}
                            />
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* USUAL ORDER REORDER CARD */}
                    {!msg.isStreaming && msg.usualOrder && (
                      <View style={styles.usualCard}>
                        <View style={styles.usualTop}>
                          <Text style={styles.usualTitle}>
                            {msg.usualOrder.items[0]?.mealName || 'Chicken Biryani'}
                          </Text>
                          <Text style={styles.usualPrice}>
                            ${msg.usualOrder.total.toFixed(0)}
                          </Text>
                        </View>
                        <Text style={styles.usualDetail}>
                          🏢 Curtin Campus Hub · Tomorrow, 5–7 PM
                        </Text>
                        <TouchableOpacity
                          style={styles.usualAddBtn}
                          onPress={() => {
                            msg.usualOrder!.items.forEach((it) =>
                              handleAddToCart(it.mealId, it.quantity)
                            );
                          }}
                        >
                          <Text style={styles.usualAddBtnText}>Add to cart</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* BUNDLE BASKET ($20 DROP) */}
                    {!msg.isStreaming && msg.budgetBasket && (
                      <View style={styles.bundleCard}>
                        <Text style={styles.bundleTitle}>
                          Your ${msg.budgetBasket.budgetCap || 20} Drop
                        </Text>
                        {msg.budgetBasket.items.map((it, idx) => (
                          <View key={`basket-${it.mealId || it.name}-${idx}`} style={styles.bundleRow}>
                            <Text style={styles.bundleItemName}>{it.name}</Text>
                            <Text style={styles.bundleItemPrice}>
                              ${it.price.toFixed(0)}
                            </Text>
                          </View>
                        ))}
                        <View style={styles.bundleTotalRow}>
                          <Text style={styles.bundleTotalLabel}>Total</Text>
                          <Text style={styles.bundleTotalVal}>
                            ${msg.budgetBasket.total.toFixed(0)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.bundleBtn}
                          onPress={() => {
                            msg.budgetBasket!.items.forEach((it) =>
                              handleAddToCart(it.mealId)
                            );
                            setIsCartOpen(true);
                          }}
                        >
                          <Text style={styles.bundleBtnText}>Order Now ➔</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* DROP FOR ME COMBO WIDGET */}
                    {!msg.isStreaming && msg.dropForMe && (
                      <MobileDropForMeWidget
                        drop={msg.dropForMe}
                        onAddToCart={(mId) => handleAddToCart(mId)}
                        onActionPrompt={(p) => handleSend(p)}
                      />
                    )}

                    {/* WEEKLY MEAL PLAN */}
                    {!msg.isStreaming && msg.weeklyPlan && (
                      <MobileWeeklyPlan
                        plan={msg.weeklyPlan}
                        onQuickAction={(act) => handleSend(act)}
                      />
                    )}

                    {/* 🎮 IN-CHAT FULL-SCREEN GAME LAUNCH CARD */}
                    {!msg.isStreaming && msg.gamePayload && (
                      <MobileInChatGameCard
                        payload={msg.gamePayload}
                        onLaunchGame={() => setActiveGamePayload(msg.gamePayload || null)}
                      />
                    )}

                    {/* SUGGESTION PILLS */}
                    {!msg.isStreaming &&
                      msg.quickOptions &&
                      !msg.healthGoals &&
                      !isAddToCartFlow && (
                        <View style={styles.chipsRow}>
                          {msg.quickOptions.map((opt, i) => (
                            <TouchableOpacity
                              key={`opt-${opt}-${i}`}
                              style={styles.chip}
                              onPress={() => handleSend(opt)}
                            >
                              <Text style={styles.chipText}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                  </View>
                </View>
              );
            })
          )}

          {isLoading && !messages.some((m) => m.sender === 'assistant' && (m.isStreaming || (m.statusText && !m.text))) && (
            <View style={[styles.msgRow, styles.msgAssistant]}>
              <MobileThinkingBubble statusText="Thinking…" />
            </View>
          )}
        </ScrollView>

        {/* PANEL 4: STICKY FLOATING CART BANNER */}
        {cartItemCount > 0 && (
          <MobileFloatingCartBar
            itemCount={cartItemCount}
            total={cartTotal}
            onPress={() => setIsCartOpen(true)}
          />
        )}

        {/* ACTIVE FILTER CHIPS BAR */}
        {activeFilterCount > 0 && (
          <View style={styles.activeFiltersBar}>
            <Text style={styles.activeFilterTitle}>⚡ Filters:</Text>
            {activeFilters.budgetCap && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>
                  &lt;${activeFilters.budgetCap}
                </Text>
              </View>
            )}
            {activeFilters.wellness && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>
                  {activeFilters.wellness}
                </Text>
              </View>
            )}
            {activeFilters.dietary && (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText}>
                  {activeFilters.dietary}
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setActiveFilters({})}>
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* BOTTOM PINNED INPUT BAR */}
        <View style={styles.inputContainer}>
          {/* Filter Sliders Button */}
          <TouchableOpacity
            style={[
              styles.filterBtn,
              activeFilterCount > 0 && styles.filterBtnActive,
            ]}
            onPress={() => setIsFilterOpen(true)}
          >
            <Text style={styles.filterBtnIcon}>🎛️</Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Ask Drop AI..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

          {/* Voice Prompt Mic Button */}
          <TouchableOpacity
            style={styles.micBtn}
            onPress={() => handleSend('Something spicy under $15')}
          >
            <Text style={styles.micIcon}>🎙️</Text>
          </TouchableOpacity>

          {/* Circular Green Send Button */}
          <TouchableOpacity
            style={[
              styles.sendCircleBtn,
              (!input.trim() || isLoading) && styles.sendCircleBtnDisabled,
            ]}
            onPress={() => handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Text style={styles.sendCircleBtnText}>➔</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* DRAWERS & MODALS */}
      <MobileCartDrawer
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setConfirmModal({
            visible: true,
            total: cartTotal,
            summary: cart?.items.map((i) => `${i.quantity}x ${i.meal.name}`).join(', '),
          });
        }}
      />

      <MobileFilterModal
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={activeFilters}
        onApply={handleApplyFilters}
      />

      <MobileTasteProfileModal
        visible={isTasteProfileOpen}
        onClose={() => setIsTasteProfileOpen(false)}
        userId={userId}
        onSwitchUser={handleSwitchUser}
        userProfile={userProfile}
      />

      <MobileOrderConfirmModal
        visible={confirmModal.visible}
        onClose={() => setConfirmModal({ visible: false, total: 0 })}
        total={confirmModal.total}
        summaryText={confirmModal.summary}
        onConfirm={confirmOrder}
      />

      <MobileGamesModal
        visible={isGamesModalOpen}
        onClose={() => setIsGamesModalOpen(false)}
        onSelectGame={(prompt, payload) => {
          if (payload) {
            setActiveGamePayload(payload);
          }
          handleSend(prompt);
        }}
      />

      {/* 🎮 DEDICATED FULL-SCREEN GAME MODAL (Hides chat input, mic, and bottom tabs) */}
      <MobileGameFullScreenModal
        visible={!!activeGamePayload}
        payload={activeGamePayload}
        onClose={() => setActiveGamePayload(null)}
        onAddToCart={(mealId) => {
          handleAddToCart(mealId);
          setActiveGamePayload(null);
        }}
        onSendMessage={(prompt) => {
          setActiveGamePayload(null);
          handleSend(prompt);
        }}
        onPreferencesDiscovered={(signals) => {
          fetch(`${activeBaseUrl}/api/preferences/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              preferences: {
                favoriteCuisines: signals.likedCuisines,
                spicyPreference: signals.spicyLoved ? 'spicy' : 'mild',
              },
            }),
          }).catch(() => {});
        }}
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  backBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sparkleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleEmoji: {
    fontSize: 16,
  },
  headerTitles: {
    justifyContent: 'center',
  },
  headerName: {
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
  gameHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  gameHeaderEmoji: {
    fontSize: 16,
  },
  gameHeaderBadge: {
    backgroundColor: '#0D7844',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  gameHeaderBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  menuBtn: {
    padding: 6,
  },
  menuText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4B5563',
  },
  popoverMenu: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
    width: 190,
  },
  popoverItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  popoverItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
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
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  bubbleCol: {
    maxWidth: '85%',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: '#0D7844',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  bubbleAssistant: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
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
    color: '#111827',
  },
  cursorText: {
    color: '#0D7844',
    fontWeight: '900',
    fontSize: 14,
  },
  statusMsgText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  recsSection: {
    marginTop: 10,
    width: '100%',
  },
  recsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  recsSparkle: {
    fontSize: 14,
  },
  recsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  recsScroll: {
    paddingVertical: 4,
  },
  usualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  usualTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usualTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  usualPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D7844',
  },
  usualDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  usualAddBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  usualAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bundleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  bundleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  bundleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  bundleItemName: {
    fontSize: 13,
    color: '#374151',
  },
  bundleItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  bundleTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 6,
  },
  bundleTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  bundleTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D7844',
  },
  bundleBtn: {
    backgroundColor: '#0D7844',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  bundleBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 13,
  },
  activeFiltersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  activeFilterTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D7844',
  },
  activeFilterTag: {
    backgroundColor: '#E8F5EE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeFilterTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0D7844',
  },
  clearFiltersText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#E8F5EE',
  },
  filterBtnIcon: {
    fontSize: 16,
  },
  filterCountBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0D7844',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  textInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F9FAFB',
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  micBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 18,
  },
  sendCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0D7844',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCircleBtnDisabled: {
    opacity: 0.35,
  },
  sendCircleBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  toastPopup: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 95 : 75,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  toastEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
