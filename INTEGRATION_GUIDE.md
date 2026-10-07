# 📱 Daily Drop — Bot Integration Guide for Tech Team

Hi Dipan & Daily Drop Team! 👋

This guide explains how to integrate the **Drop AI Bot** into your existing **React Native** mobile application and connect it with your **Node.js + TypeScript + Express** backend.

---

## 🎯 Tech Stack Compatibility

| Component | Your Tech Stack | Drop AI Tech Stack | Compatibility |
| :--- | :--- | :--- | :--- |
| **Mobile App** | React Native | React Native (Expo / Bare RN, TypeScript) | 🟢 100% Match |
| **Backend** | Node TypeScript Express | Node TypeScript Express (TSX / ESM) | 🟢 100% Match |

---

## 🚀 Quick Start (Running Locally)

### 1. Start the Backend (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Mobile App
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with **Expo Go** on your iOS or Android phone, or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 📦 How to Integrate into Your React Native App

You have **two options** depending on how you want to embed the bot:

### Option A: Embed as a Dedicated Screen / Tab in Your React Navigation

If your app uses `@react-navigation/bottom-tabs` or `@react-navigation/native-stack`, you can directly import `<DropAIScreen />`:

```tsx
import React from 'react';
import { DropAIScreen } from './mobile/src/DropAIScreen';

export function DropAITabScreen() {
  return (
    <DropAIScreen
      apiBaseUrl="https://api.your-dailydrop-backend.com" // Or your backend URL
      initialUserId="user_alex"                          // Current logged-in user ID
    />
  );
}
```

### Option B: Use Headless Hook (`useDropAI`) in Your Custom UI

If you already have your own chat UI design and only want the AI logic, memory, streaming, and cart synchronization:

```tsx
import { useDropAI } from './mobile/src/useDropAI';

export function CustomChatScreen({ userId }: { userId: string }) {
  const {
    messages,        // Array of chat messages with structured attachments
    isLoading,       // Loading / streaming state
    cart,            // Synchronized cart state
    userProfile,     // Active user profile & taste preferences
    sendMessage,     // (text: string) => Promise<void>
    addToCart,       // (mealId: string, quantity?: number) => Promise<void>
    confirmOrder,    // () => Promise<void>
    resetChat,       // () => void
  } = useDropAI({
    apiBaseUrl: 'https://api.your-dailydrop-backend.com',
    userId,
  });

  // Render your custom chat UI using the messages and cart
}
```

### Option C: Run the Complete 5-Tab Standalone App

If you want to view or test the complete standalone mobile application with all 5 tabs (`Drop AI`, `Orders`, `Explore`, `Rewards`, `Profile`):

```tsx
import { DailyDropApp } from './mobile/src/DailyDropApp';

export default function App() {
  return (
    <DailyDropApp
      apiBaseUrl="http://10.86.31.27:5000"
      initialUserId="user_alex"
    />
  );
}
```

---

## 🧩 Mobile Components Included

All mobile components are located in `mobile/src/components/`:

| Component | Description |
| :--- | :--- |
| `DropAIScreen.tsx` | Full 4-panel conversational AI screen with launcher, quick questions, and meal cards |
| `MobileBottomNavBar.tsx` | 5-tab bottom navigation with live cart badge |
| `MobileOrdersView.tsx` | Fast 1-tap re-order usual meal ($12 Chicken Biryani), order tracker (#DD-8492), and history |
| `MobileExploreView.tsx` | Category filters (`Under $15`, `Spicy 🌶️`, `High-Protein`, `Vegetarian`), search, add to bag |
| `MobileRewardsView.tsx` | Loyalty streak (🔥 4 Days), points balance (340 pts), and voucher redemptions |
| `MobileProfileView.tsx` | Persona guardrail switcher (Alex, Sam, Jordan), allergen indicators, taste profile |
| `MobileDropForMeWidget.tsx` | Smart combo builder with Safe, Adventure, Budget, Healthy modes |
| `MobileWeeklyPlan.tsx` | Mon–Fri dinner meal planner widget under target budget |
| `MobileCartDrawer.tsx` | Slide-up cart sheet with item counters, clear cart, and checkout trigger |
| `MobileTasteProfileModal.tsx` | Modal to view and update user taste preferences and guardrails |
| `MobileOrderConfirmModal.tsx` | Explicit order confirmation modal with safety guardrails |

---

## 🔌 Backend Integration (Node.js + TypeScript + Express)

The backend is built with clean interfaces in `backend/src/integrations/dailydrop/interfaces.ts`:

```typescript
export interface DailyDropMealsAPI {
  searchMeals(filters?: MealSearchFilters): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | null>;
  getMealsByIds(ids: string[]): Promise<Meal[]>;
}

export interface DailyDropCartAPI {
  getCart(userId: string): Promise<Cart>;
  addToCart(userId: string, mealId: string, quantity?: number): Promise<Cart>;
  removeFromCart(userId: string, mealId: string): Promise<Cart>;
  updateQuantity(userId: string, mealId: string, quantity: number): Promise<Cart>;
  clearCart(userId: string): Promise<Cart>;
}

export interface DailyDropOrdersAPI {
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: Partial<Order>): Promise<Order>;
}
```

To connect your real database / microservices, simply create a class implementing these interfaces and inject it into the `ToolRegistry`:

```typescript
import { DailyDropMealsAPI, DailyDropCartAPI, ... } from './interfaces';

export class RealDailyDropAPI implements DailyDropMealsAPI, DailyDropCartAPI {
  // Plug in your PostgreSQL / MongoDB / Prisma client here
}
```

---

## 🧪 Testing & Verification

Run backend unit and integration tests (44 tests covering tools, conversation jobs, and safety guards):
```bash
npm test
```
Type check mobile app:
```bash
cd mobile && npx tsc --noEmit
```
Type check backend:
```bash
cd backend && npx tsc --noEmit
```
