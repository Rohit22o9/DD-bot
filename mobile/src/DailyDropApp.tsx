import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DropAIScreen } from './DropAIScreen';
import { MobileOrdersView } from './components/MobileOrdersView';
import { MobileExploreView } from './components/MobileExploreView';
import { MobileRewardsView } from './components/MobileRewardsView';
import { MobileProfileView } from './components/MobileProfileView';
import { MobileBottomNavBar, MobileTab } from './components/MobileBottomNavBar';
import { MobileCartDrawer } from './components/MobileCartDrawer';
import { MobileTasteProfileModal } from './components/MobileTasteProfileModal';
import { Cart, UserProfile } from './types';

export interface DailyDropAppProps {
  apiBaseUrl?: string;
  initialUserId?: string;
}

export const DailyDropApp: React.FC<DailyDropAppProps> = ({
  apiBaseUrl = 'https://dd-bot-hx7u.onrender.com',
  initialUserId = 'user_alex',
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('chat');
  const [userId, setUserId] = useState<string>(initialUserId);
  const [cart, setCart] = useState<Cart | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTasteModalOpen, setIsTasteModalOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: any) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e?.endCoordinates?.height || 0);
    };
    const onHide = () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    };

    const showSub1 = Keyboard.addListener('keyboardDidShow', onShow);
    const hideSub1 = Keyboard.addListener('keyboardDidHide', onHide);
    let showSub2: any;
    let hideSub2: any;
    if (Platform.OS === 'ios') {
      showSub2 = Keyboard.addListener('keyboardWillShow', onShow);
      hideSub2 = Keyboard.addListener('keyboardWillHide', onHide);
    }

    return () => {
      showSub1.remove();
      hideSub1.remove();
      showSub2?.remove();
      hideSub2?.remove();
    };
  }, []);

  const cartItemCount = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;

  // Handle switching to chat tab with a predefined prompt
  const handleStartChat = (prompt: string) => {
    setActivePrompt(prompt);
    setActiveTab('chat');
  };

  const handleAddToCart = async (mealId: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, quantity: 1 }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (e) {
      console.warn('Failed to add to cart:', e);
    }
  };

  const handleUpdateCartQuantity = async (mealId: string, quantity: number) => {
    // 1. Try server
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/${userId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || data);
        return;
      }
    } catch (e) {
      console.warn('Failed to update cart quantity on server:', e);
    }

    // 2. Local fallback
    setCart((prev) => {
      const existing = prev?.items || [];
      const updatedItems = existing
        .map((it) => (it.mealId === mealId ? { ...it, quantity } : it))
        .filter((it) => it.quantity > 0);
      const subtotal = Math.round(updatedItems.reduce((s, i) => s + i.meal.price * i.quantity, 0) * 100) / 100;
      const deliveryFee = updatedItems.length > 0 ? 2.5 : 0;
      return {
        items: updatedItems,
        subtotal,
        deliveryFee,
        estimatedTax: 0,
        total: Math.round((subtotal + deliveryFee) * 100) / 100,
        currency: 'USD',
      };
    });
  };

  const handleRemoveFromCart = async (mealId: string) => {
    // 1. Try server
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/${userId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || data);
        return;
      }
    } catch (e) {
      console.warn('Failed to remove item from cart on server:', e);
    }

    // 2. Local fallback
    setCart((prev) => {
      const existing = prev?.items || [];
      const updatedItems = existing.filter((it) => it.mealId !== mealId);
      const subtotal = Math.round(updatedItems.reduce((s, i) => s + i.meal.price * i.quantity, 0) * 100) / 100;
      const deliveryFee = updatedItems.length > 0 ? 2.5 : 0;
      return {
        items: updatedItems,
        subtotal,
        deliveryFee,
        estimatedTax: 0,
        total: Math.round((subtotal + deliveryFee) * 100) / 100,
        currency: 'USD',
      };
    });
  };

  const handleClearCart = async () => {
    // 1. Try server
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/${userId}/clear`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || data);
        return;
      }
    } catch (e) {
      console.warn('Failed to clear cart on server:', e);
    }

    // 2. Local fallback
    setCart({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      estimatedTax: 0,
      total: 0,
      currency: 'USD',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main View Area */}
      <View style={styles.content}>
        {/* TAB 1: DROP AI (Conversational AI Assistant) */}
        <View style={[styles.tabScreen, activeTab === 'chat' && styles.tabScreenActive]}>
          <DropAIScreen
            apiBaseUrl={apiBaseUrl}
            initialUserId={userId}
            activePrompt={activePrompt}
            onClearActivePrompt={() => setActivePrompt('')}
            onCartUpdated={setCart}
            onProfileUpdated={setUserProfile}
            isKeyboardVisible={isKeyboardVisible}
            keyboardHeight={keyboardHeight}
          />
        </View>

        {/* TAB 2: ORDERS (Re-order usual & Order Tracking) */}
        {activeTab === 'orders' && (
          <MobileOrdersView
            onStartChat={handleStartChat}
            onOpenCart={() => setIsCartOpen(true)}
            cart={cart}
          />
        )}

        {/* TAB 3: EXPLORE (Menu categories & meals) */}
        {activeTab === 'explore' && (
          <MobileExploreView
            onStartChat={handleStartChat}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* TAB 4: REWARDS (Streak & points) */}
        {activeTab === 'rewards' && (
          <MobileRewardsView onStartChat={handleStartChat} />
        )}

        {/* TAB 5: PROFILE (Taste profile & persona switcher) */}
        {activeTab === 'profile' && (
          <MobileProfileView
            currentUserId={userId}
            onUserChange={setUserId}
            userProfile={userProfile}
            onOpenTasteModal={() => setIsTasteModalOpen(true)}
            onStartChat={handleStartChat}
          />
        )}
      </View>

      {/* Global Bottom Tab Navigation Bar (hidden when keyboard is open) */}
      {!isKeyboardVisible && (
        <MobileBottomNavBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cartCount={cartItemCount}
        />
      )}

      {/* Slide-Up Cart Drawer */}
      <MobileCartDrawer
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          handleStartChat('Checkout and confirm my order');
        }}
      />

      {/* Taste Profile Modal */}
      {userProfile && (
        <MobileTasteProfileModal
          visible={isTasteModalOpen}
          onClose={() => setIsTasteModalOpen(false)}
          userProfile={userProfile}
          userId={userId}
          onSwitchUser={(newId) => {
            setUserId(newId);
            setIsTasteModalOpen(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabScreen: {
    display: 'none',
    flex: 1,
  },
  tabScreenActive: {
    display: 'flex',
  },
});
