# Drop AI — Personal Food Assistant for Daily Drop

Drop AI is a production-oriented personal food assistant prototype built for **Daily Drop**. It is engineered to drastically reduce customer decision fatigue across four primary food ordering jobs:
1. **FIND** — Intent-driven search by budget, protein, cuisine, dietary tags, and delivery slots.
2. **CHOOSE** — Contextual meal recommendations with transparent match percentages, breakdown rationale, and conversational quick branches.
3. **BUILD** — Automated combo drops (e.g. "$20 Dinner Drop" consisting of main + side + drink) and multi-day meal planners (Monday–Friday dinner plans under budget).
4. **ORDER** — Effortless "Order my usual" re-ordering and cart preparation with **strict explicit confirmation safety** before final checkout.

> [!IMPORTANT]
> **Standalone Prototype with Decoupled Integration Layer:**
> Drop AI is built as a self-contained system with zero hard dependencies on Daily Drop's proprietary source code or production databases. It provides a clean integration interface layer (`src/integrations/dailydrop/`) and `MockDailyDropAPI`. When ready, the Daily Drop engineering team can seamlessly substitute this with `RealDailyDropAPI` without altering the AI orchestrator or tool abstraction layers.

---

## 1. Project Structure

```text
DD AI agent/
├── .env.example                     # Environment configuration template
├── package.json                     # Root orchestrator scripts
├── README.md                        # Complete documentation & handover guide
├── INTEGRATION_GUIDE.md             # Integration guide for Daily Drop tech team
│
├── backend/                         # Node.js + Express + TypeScript Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── types/index.ts           # Shared data models (Meal, Restaurant, User, Order, Cart)
│   │   ├── integrations/dailydrop/  # Integration Layer for Daily Drop APIs
│   │   │   ├── interfaces.ts        # DailyDropMealsAPI, OrdersAPI, CartAPI, UserAPI
│   │   │   ├── mockData.ts          # 25+ curated meals, 6 restaurants, realistic order history
│   │   │   ├── MockDailyDropAPI.ts  # In-memory implementation of Daily Drop interfaces
│   │   │   └── index.ts
│   │   ├── ai/
│   │   │   ├── providers/           # AI Provider Abstraction Layer
│   │   │   │   ├── AIProvider.ts    # Provider interface
│   │   │   │   ├── OpenAIProvider.ts# Production OpenAI API client
│   │   │   │   └── HybridRuleProvider.ts # Deterministic offline NLP fallback
│   │   │   ├── tools/               # Tool Abstraction Layer (MCP Compatible)
│   │   │   │   └── ToolRegistry.ts  # searchMeals, getMeal, getCart, buildMealPlan, etc.
│   │   │   ├── orchestrator/
│   │   │   │   ├── Orchestrator.ts  # DropAIOrchestrator core engine
│   │   │   │   ├── RecommendationEngine.ts # Transparent scoring & reason generator
│   │   │   │   └── SafetyValidator.ts     # Explicit allergy exclusion & order safety
│   │   │   └── mcp/                 # Model Context Protocol Adapter
│   │   │       ├── mcpSchemas.ts    # Standard JSON Schema MCP tool definitions
│   │   │       └── mcpAdapter.ts    # MCP tool dispatcher
│   │   ├── routes/                  # REST API Controllers
│   │   │   ├── chatRoutes.ts        # POST /api/chat
│   │   │   ├── mealRoutes.ts        # GET /api/meals
│   │   │   ├── cartRoutes.ts        # GET, POST /api/cart
│   │   │   ├── preferenceRoutes.ts  # GET, POST, DELETE /api/preferences
│   │   │   ├── orderRoutes.ts       # GET /api/orders, POST /api/orders/confirm
│   │   │   ├── mealPlanRoutes.ts    # POST /api/meal-plan
│   │   │   └── mcpRoutes.ts         # GET, POST /api/mcp
│   │   ├── app.ts                   # Express application
│   │   └── server.ts                # Server startup entrypoint
│   └── tests/
│       ├── tools.test.ts            # Unit tests for all 11 core tools & safety guards
│       └── conversations.test.ts    # 21 realistic conversational integration tests
│
└── mobile/                          # React Native (Expo) Mobile App (TypeScript)
    ├── package.json
    ├── app.json
    ├── tsconfig.json
    ├── App.tsx                      # Root Mobile Entrypoint
    └── src/
        ├── types.ts                 # Mobile data types
        ├── useDropAI.ts             # Custom networking and conversational state hook
        ├── DropAIScreen.tsx         # Full 4-Panel AI Chat Screen (standalone embeddable)
        ├── DailyDropApp.tsx         # Full 5-Tab Daily Drop Mobile App Shell
        └── components/
            ├── MobileBottomNavBar.tsx       # Bottom navigation tabs with cart counter
            ├── MobileOrdersView.tsx         # Fast 1-tap re-order & active drop tracker
            ├── MobileExploreView.tsx        # Categories, search, meal discovery
            ├── MobileRewardsView.tsx        # Streaks, points, unlockable perks
            ├── MobileProfileView.tsx        # Persona switcher, taste preferences, guardrails
            ├── MobileDropForMeWidget.tsx    # Safe, Adventure, Budget, Healthy combos
            ├── MobileWeeklyPlan.tsx         # Mon–Fri dinner meal planner
            ├── MobileCartDrawer.tsx         # Slide-up bag modal & checkout flow
            ├── MobileTasteProfileModal.tsx  # Taste profile editor modal
            ├── MobileMealCard.tsx           # High-res food cards with add-to-cart
            ├── MobileAddedCard.tsx          # Inline confirmation card with stepper
            ├── MobileQuickQuestions.tsx     # Health goal vertical cards
            └── MobileChatLaunchScreen.tsx   # Panel 1 hero launch screen
```

---

## 2. How to Run Locally

### Prerequisites
- Node.js `v18+` or `v24+`
- npm `v9+` or `v11+`
- Physical iOS/Android phone with **Expo Go** app, or Android/iOS Simulator

### Step 1: Install Dependencies
From the repository root:
```bash
npm run install:all
```

### Step 2: Start the Backend Server
```bash
npm run dev:backend
```
The backend initializes on `http://localhost:5000` (and on your local Wi-Fi IP for physical phones).

### Step 3: Start the React Native Mobile App
```bash
npm run dev:mobile
```
Open **Expo Go** on your phone and scan the QR code displayed in the terminal!

### Running Automated Tests
To run all 44 automated backend tests:
```bash
npm test
```

---

## 3. Environment Variables

Copy `.env.example` to `.env` in `backend/` or your system environment:
```env
# Optional: Provide OpenAI API key for production LLM calls.
# If omitted, Drop AI automatically runs in high-speed offline mode using HybridRuleProvider.
OPENAI_API_KEY=

# Model to use (gpt-4o-mini, gpt-4o, etc.)
AI_MODEL=gpt-4o-mini

# Server Port
PORT=5000

# Client base URL
API_BASE_URL=http://localhost:5000
```

---

## 4. API Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Main conversational Drop AI orchestration endpoint |
| `GET` | `/api/meals` | Search meals with query, cuisine, maxPrice, slot, and day filters |
| `GET` | `/api/meals/:id` | Get details for a specific meal |
| `GET` | `/api/preferences/:userId` | Get explicit user profile and preference memory |
| `POST` | `/api/preferences/:userId` | Add or update a preference (cuisine, dislike, allergy) |
| `DELETE` | `/api/preferences/:userId` | Remove an explicit preference item |
| `GET` | `/api/cart/:userId` | Fetch current draft cart |
| `POST` | `/api/cart/:userId/add` | Add meal to draft cart |
| `POST` | `/api/cart/:userId/remove` | Remove meal from cart |
| `POST` | `/api/cart/:userId/clear` | Clear draft cart |
| `GET` | `/api/orders/:userId` | Retrieve user order history |
| `GET` | `/api/orders/:userId/usual` | Retrieve past habitual order |
| `POST` | `/api/orders/:userId/confirm` | **Explicit confirmation** checkout endpoint |
| `POST` | `/api/meal-plan/:userId` | Generate or modify a 5-day meal plan |
| `GET` | `/api/mcp/tools` | Enumerate available tools in Model Context Protocol (MCP) format |
| `POST` | `/api/mcp/call` | Invoke an MCP tool call |

---

## 5. Tool Definitions

Drop AI provides clean interfaces for 14 primary tools:

1. **`searchMeals(filters)`** — Query meals by cuisine, price limit, day, meal slot, and dietary requirements.
2. **`getMeal(id)`** — Fetch meal recipe, ingredients, allergen tags, and pricing.
3. **`getRestaurant(id)`** — Fetch restaurant rating, operating hours, delivery fees, and minimum orders.
4. **`checkAvailability(mealId, day, slot)`** — Verify scheduling availability for requested slot.
5. **`getUserProfile(userId)`** — Fetch customer name, preferences, and account metadata.
6. **`getUserPreferences(userId)`** — Retrieve explicit dietary constraints, dislikes, and declared allergies.
7. **`getOrderHistory(userId, limit)`** — Retrieve recent completed transactions.
8. **`getFavoriteMeals(userId)`** — Rank meals by order frequency.
9. **`getCart(userId)`** — Retrieve draft shopping cart with fees and tax.
10. **`addToCart(userId, mealId, quantity, slot, date)`** — Add meal to draft basket.
11. **`removeFromCart(userId, mealId)`** — Remove item from cart.
12. **`updateCart(userId, mealId, quantity)`** — Update item count.
13. **`calculateCartTotal(items)`** — Compute subtotals, delivery fee, and taxes.
14. **`buildMealPlan(userId, options)`** — Compose balanced 5-day Monday–Friday meal plan under target budget ($65).
15. **`buildBudgetBasket(userId, budgetCap, slot)`** — Compose 3-item combo (Main + Side + Drink) under specified budget cap ($20).

---

## 6. Mock Data Format

### Meal Object
```json
{
  "id": "meal_thai_basil_chicken",
  "name": "Thai Basil Chicken",
  "description": "Wok-seared minced chicken with bird’s eye chili, holy basil, garlic, and jasmine rice.",
  "restaurantId": "rest_thai",
  "restaurantName": "Thai Orchid Street",
  "price": 13.00,
  "imageUrl": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80",
  "cuisine": "Thai",
  "category": "main",
  "dietaryTags": ["halal", "dairy-free", "high-protein"],
  "ingredients": ["chicken", "thai basil", "bird eye chili", "garlic", "jasmine rice", "soy sauce", "egg"],
  "spicyLevel": 2,
  "availableDays": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  "availableSlots": ["lunch", "dinner"],
  "active": true,
  "calories": 640,
  "proteinGrams": 38
}
```

### Recommendation Output with Transparent Scoring
```json
{
  "meal": { /* Meal object */ },
  "score": 93,
  "reasons": [
    "✓ Under $15 ($13.00)",
    "✓ Spicy",
    "✓ Similar to meals you liked",
    "✓ Quality chicken"
  ]
}
```

---

## 7. Integration Guide for Daily Drop Backend Team

To connect Drop AI to Daily Drop's live backend APIs, implement the interfaces located in `src/integrations/dailydrop/interfaces.ts`:

1. Create `RealDailyDropAPI.ts` implementing:
   - `DailyDropMealsAPI`
   - `DailyDropRestaurantAPI`
   - `DailyDropUserAPI`
   - `DailyDropOrdersAPI`
   - `DailyDropCartAPI`
   - `DailyDropAvailabilityAPI`
2. Wire HTTP requests from `RealDailyDropAPI` to your internal microservices (e.g. Menu Service, User Service, Cart Service).
3. In `backend/src/ai/tools/ToolRegistry.ts`, inject `RealDailyDropAPI`:
   ```ts
   import { RealDailyDropAPI } from '../integrations/dailydrop/RealDailyDropAPI';
   
   const realAPI = new RealDailyDropAPI({ baseUrl: process.env.DAILY_DROP_INTERNAL_API_URL });
   export const toolRegistry = new ToolRegistry(realAPI, realAPI, realAPI, realAPI, realAPI, realAPI);
   ```
4. No modifications are required in `Orchestrator.ts`, `RecommendationEngine.ts`, or the frontend!

---

## 8. Model Context Protocol (MCP) Integration Plan

Drop AI is designed to function as an MCP Tool Server out-of-the-box.
- Schema definitions conforming to the MCP Specification are defined in `src/mcp/mcpSchemas.ts`.
- The MCP tool router is implemented in `src/mcp/mcpAdapter.ts`.
- To expose Drop AI tools to Claude Desktop or external AI agents:
  1. Add an MCP Stdio or SSE transport in `backend/src/mcp/mcpServer.ts`.
  2. Map incoming `tools/list` to `mcpAdapter.listTools()`.
  3. Map incoming `tools/call` to `mcpAdapter.callTool(name, arguments)`.
  4. Endpoints `/api/mcp/tools` and `/api/mcp/call` already allow HTTP-based MCP tool interrogation.

---

## 9. Security Considerations

1. **Client Isolation**: API keys (such as `OPENAI_API_KEY`) and internal database tokens are strictly stored on the backend in environment variables. No secrets are ever exposed in frontend bundles.
2. **Explicit Medical Allergy Safeguards**:
   - The assistant **never infers medical allergies or restrictions** from casual chat history.
   - Only explicitly declared allergies (stored in `preferences.allergies` or entered by the user) are used to enforce safety filtering.
   - Any meal matching a declared allergen or disliked ingredient is strictly excluded from candidate sets before recommendation scoring.
3. **Explicit Order Confirmation**:
   - The assistant is architecturally forbidden from finalizing an order autonomously.
   - An order requires an explicit confirmation payload (`isConfirmed: true`) with user consent before transitioning from a draft cart into a live order.

---

## 10. Example Requests & Responses

### Example 1: Decision Fatigue ("I don't know what to eat")
**User Request:**
```json
{ "userId": "user_alex", "message": "I don't know what to eat." }
```
**Drop AI Response:**
```json
{
  "job": "CHOOSE",
  "message": "You've been having a lot of chicken and rice lately. Want something different?",
  "quickOptions": [
    "Something different",
    "Healthy",
    "Spicy",
    "Surprise me"
  ]
}
```

---

### Example 2: Parameter Extraction & Ranking ("Find chicken meal under $15 for dinner")
**User Request:**
```json
{ "userId": "user_alex", "message": "Find me a filling chicken meal under $15 for tomorrow dinner." }
```
**Drop AI Response:**
```json
{
  "job": "FIND",
  "message": "Found delicious chicken dinners under $15:",
  "recommendations": [
    {
      "meal": {
        "id": "meal_thai_basil_chicken",
        "name": "Thai Basil Chicken",
        "price": 13.00,
        "restaurantName": "Thai Orchid Street"
      },
      "score": 93,
      "reasons": ["✓ Under $15 ($13.00)", "✓ Spicy", "✓ Similar to meals you liked", "✓ Quality chicken"]
    },
    {
      "meal": {
        "id": "meal_teriyaki_chicken_bowl",
        "name": "Glazed Chicken Teriyaki Bowl",
        "price": 13.50,
        "restaurantName": "Tokyo Bento Co."
      },
      "score": 88,
      "reasons": ["✓ Under $15 ($13.50)", "✓ Quality chicken", "✓ From favorite spot (Tokyo Bento Co.)"]
    }
  ],
  "quickOptions": ["Add to cart", "Show more", "Under $12"]
}
```

---

### Example 3: Re-ordering ("Order my usual")
**User Request:**
```json
{ "userId": "user_alex", "message": "Order my usual." }
```
**Drop AI Response:**
```json
{
  "job": "ORDER",
  "message": "Your usual is available tomorrow.\nTotal: $20.43. Ready to draft to your cart?",
  "usualOrder": {
    "restaurantName": "Thai Orchid Street",
    "items": [
      { "mealName": "Thai Basil Chicken", "price": 13.00, "quantity": 1 },
      { "mealName": "Traditional Thai Iced Tea", "price": 3.00, "quantity": 1 }
    ],
    "total": 20.43
  },
  "confirmationRequired": true,
  "confirmationDetails": {
    "action": "PLACE_ORDER",
    "total": 20.43,
    "summary": "1x Thai Basil Chicken, 1x Traditional Thai Iced Tea"
  },
  "quickOptions": ["Add to cart", "Edit items"]
}
```

---

### Example 4: Basket Construction ("$20 Drop")
**User Request:**
```json
{ "userId": "user_alex", "message": "I've got $20. Make me a good dinner." }
```
**Drop AI Response:**
```json
{
  "job": "BUILD",
  "message": "Your $20 Drop\n• Thai Basil Chicken — $13.00\n• Crispy Veggie Spring Rolls (3x) — $4.00\n• Traditional Thai Iced Tea — $3.00\n\nTotal — $20.00",
  "budgetBasket": {
    "budgetCap": 20,
    "total": 20.00,
    "items": [
      { "category": "Meal", "name": "Thai Basil Chicken", "price": 13.00, "mealId": "meal_thai_basil_chicken" },
      { "category": "Side", "name": "Crispy Veggie Spring Rolls (3x)", "price": 4.00, "mealId": "side_spring_rolls" },
      { "category": "Drink", "name": "Traditional Thai Iced Tea", "price": 3.00, "mealId": "drink_thai_iced_tea" }
    ]
  },
  "quickOptions": ["Add all to cart", "Swap side", "Swap drink"]
}
```

---

### Example 5: Weekly Meal Planner ("Sort my dinners Monday-Friday. Keep it under $65.")
**User Request:**
```json
{ "userId": "user_alex", "message": "Sort my dinners Monday-Friday. Keep it under $65." }
```
**Drop AI Response:**
```json
{
  "job": "BUILD",
  "message": "Here is your curated Monday–Friday dinner plan under $65.00. Total: $64.50.",
  "weeklyPlan": {
    "targetBudget": 65.00,
    "actualTotal": 64.50,
    "days": [
      { "day": "Monday", "meal": { "name": "Thai Basil Chicken", "price": 13.00 } },
      { "day": "Tuesday", "meal": { "name": "Glazed Chicken Teriyaki Bowl", "price": 13.50 } },
      { "day": "Wednesday", "meal": { "name": "Chipotle Lime Chicken Bowl", "price": 12.50 } },
      { "day": "Thursday", "meal": { "name": "Crispy Falafel & Tahini Bowl", "price": 12.00 } },
      { "day": "Friday", "meal": { "name": "Spicy Chicken Katsu Curry", "price": 13.50 } }
    ]
  },
  "quickOptions": [
    "Change Wednesday",
    "Make Friday vegetarian",
    "Remove salads",
    "Keep everything under $60"
  ]
}
```
