# 📱 Drop AI — React Native / Expo Mobile App

This directory contains the mobile application for **Drop AI**, built with **React Native** and **Expo**. It implements the exact 4-panel conversational flow and functionality from the Daily Drop reference design.

---

## 🚀 How to Run on Your Mobile Phone

### Step 1: Install Expo Go on Your Phone
- **iOS**: Download **Expo Go** from the Apple App Store.
- **Android**: Download **Expo Go** from Google Play Store.

### Step 2: Start the Backend (if not already running)
Ensure your backend server is running on port 5000:
```bash
npm run dev:backend
```

### Step 3: Start the Mobile App
From the root directory:
```bash
npm run dev:mobile
```
*Or navigate to the `mobile` folder and run:*
```bash
cd mobile
npx expo start
```

### Step 4: Open on Your Phone
1. A QR code will appear in your terminal.
2. Ensure your computer and your phone are connected to the **same Wi-Fi network**.
3. **iPhone**: Open the default Camera app and point it at the QR code ➔ tap the prompt to open in Expo Go.
4. **Android**: Open the **Expo Go** app ➔ tap **"Scan QR code"** and scan the terminal QR code.

---

## 📱 Supported Simulators & Emulators
- **Android Emulator**: Run `npx expo start --android` (connects via `http://10.0.2.2:5000`).
- **iOS Simulator**: Run `npx expo start --ios` (connects via `http://localhost:5000`).
- **Web Preview**: Run `npx expo start --web`.

---

## 🎨 Implemented Features & 4-Panel User Flow

### 1. Panel 1: Launch Screen
- **Mascot & Floating Doodles**: Chef mascot badge surrounded by floating food doodles (`🥟`, `🍜`, `🥗`, `💰`, `🍃`, `🍲`).
- **Heading**: *"What would you like to eat?"*
- **2x3 Action Cards Grid**:
  - `🍜 Help me choose`
  - `❤️ Eat healthier`
  - `💰 Best value`
  - `📅 Plan my meals`
  - `🔄 My favourites`
  - `🎲 Surprise me`
- **"Or try asking..." Pills**: Quick tap suggestions (`🌶️ Spicy under $15`, `💪 High protein`, `🥗 Something light`, `🍲 Comfort food`).

### 2. Panel 2: Quick Questions (Health & Dietary Goals)
- User bubble: *"I want something healthy"*
- Assistant question: *"Great choice! What matters most to you?"*
- 7 vertical health cards:
  - ❤️ Heart healthy
  - 🩸 Diabetes friendly
  - 💪 High protein
  - 🥑 Low carb / Keto
  - 🧂 Low sodium
  - 🌿 Anti-inflammatory
  - ⚖️ Weight loss
- Dismiss button: `⊗ Not sure, just show me healthy options`.

### 3. Panel 3: Meal Recommendations
- Horizontally scrollable meal showcase cards:
  - High-res food photos with squircle corners (16px radius).
  - Favorite Heart button (`♡` / `❤️`) with interactive state.
  - Meal title & price.
  - Dietary tag pills.
  - Solid dark green (`#0D7844`) **"Add to cart"** button (changes to `Added ✓`).

### 4. Panel 4: Continue Conversation & Sticky Floating Cart
- Inline Added Confirmation card:
  - Meal thumbnail, title, price.
  - Quantity stepper `[ - ] [ 1 ] [ + ]`.
  - Follow-up prompt: *"Would you like to add something else?"*
  - Follow-up chips: `🥤 Add a drink`, `🥟 Add a side`, `🍽️ Another meal`, `✅ I'm done`.
- **Sticky Bottom Floating Cart Banner**:
  - `🛒 1 meal · $12.00 | View cart ⌃`
  - Tap opens the full slide-up Bag modal with line items, quantity controls, and checkout flow.

---

## 🔧 Architecture & Tech Stack
- **Framework**: Expo SDK 52 + React Native 0.76 (TypeScript)
- **State & Networking**: Custom hook `useDropAI` connecting directly to Express backend SSE/REST endpoints.
- **Component Primitives**: Safe area layouts (`react-native-safe-area-context`), keyboard avoiding scroll views, native touchables, and native modals.
