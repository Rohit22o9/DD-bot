import { Meal, Recommendation } from './types';
import { REAL_DAILY_DROP_MEALS } from './realDailyDropMeals';

export const MOCK_MOBILE_MEALS: Meal[] = [
  ...REAL_DAILY_DROP_MEALS,
  {
    id: 'meal_thai_basil',
    name: 'Thai Basil Chicken',
    description: 'Wok-tossed minced chicken with fresh Thai holy basil, garlic, and birds eye chillies over jasmine rice.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 13.0,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Thai',
    category: 'main',
    dietaryTags: ['High Protein', 'Spicy', 'Dairy-Free'],
    ingredients: ['Chicken', 'Thai Basil', 'Chilli', 'Garlic', 'Jasmine Rice'],
    spicyLevel: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 520,
    proteinGrams: 36,
    nutrition: {
      calories: 520,
      proteinGrams: 36,
      fibreGrams: 4,
      sodiumMg: 710,
      saturatedFatGrams: 3.5,
      carbsGrams: 48,
      sugarGrams: 3,
    },
    healthFlags: {
      highProtein: true,
      dairyFree: true,
    },
    displayBadges: ['💪 36g Protein', '🌶️ Spicy Kick'],
  },
  {
    id: 'meal_quinoa_bowl',
    name: 'Grilled Chicken Quinoa Bowl',
    description: 'Herb-marinated chicken breast over organic tri-color quinoa, roasted cherry tomatoes, cucumbers, and lemon-tahini drizzle.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'main',
    dietaryTags: ['Heart Healthy', 'High Protein', 'Low Sodium'],
    ingredients: ['Chicken Breast', 'Quinoa', 'Cucumber', 'Tomato', 'Lemon-Tahini'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 460,
    proteinGrams: 38,
    nutrition: {
      calories: 460,
      proteinGrams: 38,
      fibreGrams: 8,
      sodiumMg: 420,
      saturatedFatGrams: 2.1,
      carbsGrams: 42,
      sugarGrams: 3,
    },
    healthFlags: {
      heartHealthy: true,
      diabetesFriendly: true,
      highProtein: true,
      lowSodium: true,
      antiInflammatory: true,
      weightManagement: true,
      glutenFree: true,
    },
    displayBadges: ['❤️ Heart Healthy', '💪 38g Protein', '🧂 Low Sodium'],
  },
  {
    id: 'meal_salmon_bowl',
    name: 'Salmon Teriyaki & Brown Rice',
    description: 'Atlantic salmon fillet glazed with house teriyaki sauce, steamed broccoli, and toasted sesame brown rice.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 14.5,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'main',
    dietaryTags: ['Omega-3', 'High Protein', 'Anti-Inflammatory'],
    ingredients: ['Atlantic Salmon', 'Brown Rice', 'Broccoli', 'Teriyaki', 'Sesame'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 510,
    proteinGrams: 34,
    nutrition: {
      calories: 510,
      proteinGrams: 34,
      fibreGrams: 7,
      sodiumMg: 560,
      saturatedFatGrams: 2.8,
      carbsGrams: 45,
      sugarGrams: 4,
    },
    healthFlags: {
      heartHealthy: true,
      antiInflammatory: true,
      highProtein: true,
      diabetesFriendly: true,
      weightManagement: true,
    },
    displayBadges: ['❤️ Heart Healthy', '💪 34g Protein', '🫐 Anti-Inflammatory'],
  },
  {
    id: 'meal_biryani',
    name: 'Hyderabadi Chicken Biryani',
    description: 'Fragrant basmati rice layered with spiced tender chicken, saffron, caramelised onions, and cooling mint raita.',
    restaurantId: 'rest_biryani',
    restaurantName: 'Deccan Spice Hub',
    price: 14.0,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indian',
    category: 'main',
    dietaryTags: ['Halal', 'High Protein', 'Aromatic'],
    ingredients: ['Chicken', 'Basmati Rice', 'Saffron', 'Mint', 'Yogurt'],
    spicyLevel: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 620,
    proteinGrams: 32,
    nutrition: {
      calories: 620,
      proteinGrams: 32,
      fibreGrams: 5,
      sodiumMg: 690,
      saturatedFatGrams: 4.2,
      carbsGrams: 65,
      sugarGrams: 4,
    },
    healthFlags: {
      highProtein: true,
    },
    displayBadges: ['🍗 Tender Chicken', '🌾 Fragrant Basmati'],
  },
  {
    id: 'meal_halloumi_bowl',
    name: 'Grilled Halloumi Green Bowl',
    description: 'Golden grilled halloumi cheese, roasted sweet potato, baby spinach, avocado, and pomegranate vinaigrette.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 12.5,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'main',
    dietaryTags: ['Vegetarian', 'High Fibre', 'Diabetes Friendly'],
    ingredients: ['Halloumi', 'Sweet Potato', 'Spinach', 'Avocado', 'Pomegranate'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 440,
    proteinGrams: 22,
    nutrition: {
      calories: 440,
      proteinGrams: 22,
      fibreGrams: 9,
      sodiumMg: 490,
      saturatedFatGrams: 3.2,
      carbsGrams: 28,
      sugarGrams: 4,
    },
    healthFlags: {
      diabetesFriendly: true,
      antiInflammatory: true,
      weightManagement: true,
      lowCarb: true,
    },
    displayBadges: ['📉 Diabetes Friendly', '🌾 9g Fibre', '⚖️ Under 450 kcal'],
  },
  {
    id: 'meal_beef_rendang',
    name: 'Indonesian Beef Rendang',
    description: 'Slow-braised tender beef in coconut milk, lemongrass, galangal, kaffir lime, and aromatic spices with jasmine rice.',
    restaurantId: 'rest_nusantara',
    restaurantName: 'Nusantara Kitchen',
    price: 13.5,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indonesian',
    category: 'main',
    dietaryTags: ['Halal', 'High Protein', 'Rich & Comforting'],
    ingredients: ['Beef', 'Coconut Milk', 'Lemongrass', 'Galangal', 'Chilli', 'Rice'],
    spicyLevel: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 580,
    proteinGrams: 36,
    nutrition: {
      calories: 580,
      proteinGrams: 36,
      fibreGrams: 4,
      sodiumMg: 680,
      saturatedFatGrams: 5.5,
      carbsGrams: 50,
      sugarGrams: 3,
    },
    healthFlags: {
      highProtein: true,
      dairyFree: true,
    },
    displayBadges: ['💪 36g Protein', '🥥 Slow Cooked'],
  },
  {
    id: 'meal_jollof_chicken',
    name: 'Jollof Rice & Roasted Chicken',
    description: 'Smoky West African tomato and bell pepper rice served with spiced grilled chicken leg and fried sweet plantains.',
    restaurantId: 'rest_suya',
    restaurantName: 'Suya King African Kitchen',
    price: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
    cuisine: 'African',
    category: 'main',
    dietaryTags: ['Halal', 'High Protein', 'Bold Flavours'],
    ingredients: ['Chicken', 'Jollof Rice', 'Habanero', 'Tomato', 'Plantain'],
    spicyLevel: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 610,
    proteinGrams: 38,
    nutrition: {
      calories: 610,
      proteinGrams: 38,
      fibreGrams: 6,
      sodiumMg: 640,
      saturatedFatGrams: 3.8,
      carbsGrams: 62,
      sugarGrams: 4,
    },
    healthFlags: {
      highProtein: true,
    },
    displayBadges: ['💪 38g Protein', '🔥 Grilled Suya'],
  },
  {
    id: 'meal_lentil_curry',
    name: 'Creamy Coconut Lentil Curry',
    description: 'Slow-simmered golden lentils with turmeric, roasted cumin, coconut cream, wilted spinach, and warm flatbread.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indian',
    category: 'main',
    dietaryTags: ['Vegan', 'High Fibre', 'Gluten Free'],
    ingredients: ['Yellow Lentils', 'Coconut Milk', 'Spinach', 'Turmeric', 'Cumin'],
    spicyLevel: 1,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 390,
    proteinGrams: 18,
    nutrition: {
      calories: 390,
      proteinGrams: 18,
      fibreGrams: 11,
      sodiumMg: 380,
      saturatedFatGrams: 2.1,
      carbsGrams: 46,
      sugarGrams: 3,
    },
    healthFlags: {
      heartHealthy: true,
      diabetesFriendly: true,
      lowSodium: true,
      antiInflammatory: true,
      weightManagement: true,
      glutenFree: true,
    },
    displayBadges: ['❤️ Heart Healthy', '🧂 Low Sodium', '🌾 11g Fibre'],
  },
  {
    id: 'meal_herb_chicken',
    name: 'Herb Grilled Chicken & Charred Greens',
    description: 'Tender garlic & thyme chicken breast served with charred broccoli florets, zucchini ribbons, and extra virgin olive oil.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 13.5,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'main',
    dietaryTags: ['Low Carb', 'High Protein', 'Keto', 'Heart Healthy'],
    ingredients: ['Chicken Breast', 'Broccoli', 'Zucchini', 'Olive Oil', 'Garlic', 'Thyme'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 430,
    proteinGrams: 44,
    nutrition: {
      calories: 430,
      proteinGrams: 44,
      fibreGrams: 7,
      sodiumMg: 380,
      saturatedFatGrams: 2.4,
      carbsGrams: 11,
      sugarGrams: 2,
    },
    healthFlags: {
      heartHealthy: true,
      lowCarb: true,
      highProtein: true,
      lowSodium: true,
      weightManagement: true,
      diabetesFriendly: true,
      antiInflammatory: true,
      glutenFree: true,
    },
    displayBadges: ['🥑 Low Carb / Keto', '💪 44g Protein', '❤️ Heart Healthy'],
  },
  {
    id: 'meal_steamed_barramundi',
    name: 'Steamed Barramundi & Bok Choy',
    description: 'Wild sea barramundi fillet gently steamed with ginger, scallions, baby bok choy, and a splash of light sesame broth.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 14.5,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Asian',
    category: 'main',
    dietaryTags: ['Heart Healthy', 'Low Sodium', 'Anti-Inflammatory', 'High Protein'],
    ingredients: ['Barramundi', 'Bok Choy', 'Ginger', 'Scallions', 'Sesame'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 395,
    proteinGrams: 39,
    nutrition: {
      calories: 395,
      proteinGrams: 39,
      fibreGrams: 6,
      sodiumMg: 350,
      saturatedFatGrams: 1.8,
      carbsGrams: 9,
      sugarGrams: 2,
    },
    healthFlags: {
      heartHealthy: true,
      lowSodium: true,
      antiInflammatory: true,
      highProtein: true,
      lowCarb: true,
      weightManagement: true,
      diabetesFriendly: true,
      glutenFree: true,
    },
    displayBadges: ['❤️ Heart Healthy', '🧂 Low Sodium', '💪 39g Protein'],
  },
  {
    id: 'meal_mango_lassi',
    name: 'Alphonso Mango Lassi',
    description: 'Chilled creamy yogurt drink blended with sweet Alphonso mango pulp and a touch of fragrant green cardamom.',
    restaurantId: 'rest_biryani',
    restaurantName: 'Deccan Spice Hub',
    price: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indian',
    category: 'drink',
    dietaryTags: ['Vegetarian', 'Cooling'],
    ingredients: ['Yogurt', 'Mango', 'Cardamom', 'Milk'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 180,
    proteinGrams: 6,
    nutrition: {
      calories: 180,
      proteinGrams: 6,
      fibreGrams: 1,
      sodiumMg: 65,
      saturatedFatGrams: 1.8,
      carbsGrams: 32,
      sugarGrams: 28,
    },
  },
  // --- SIDES ---
  {
    id: 'meal_garlic_naan',
    name: 'Garlic Butter Naan',
    description: 'Fresh tandoor-baked flatbread brushed with roasted garlic butter and fresh coriander.',
    restaurantId: 'rest_biryani',
    restaurantName: 'Deccan Spice Hub',
    price: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indian',
    category: 'side',
    dietaryTags: ['Vegetarian', 'Tandoor Fresh'],
    ingredients: ['Wheat Flour', 'Garlic', 'Butter', 'Coriander'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 220,
    proteinGrams: 5,
    nutrition: {
      calories: 220,
      proteinGrams: 5,
      fibreGrams: 2,
      sodiumMg: 310,
      saturatedFatGrams: 2.8,
      carbsGrams: 38,
      sugarGrams: 2,
    },
  },
  {
    id: 'meal_edamame',
    name: 'Sea Salt & Garlic Edamame',
    description: 'Warm steamed young soybeans tossed with Maldon sea salt and garlic oil.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'side',
    dietaryTags: ['Vegan', 'High Protein', 'Gluten Free'],
    ingredients: ['Soybeans', 'Sea Salt', 'Garlic Oil'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 140,
    proteinGrams: 11,
    nutrition: {
      calories: 140,
      proteinGrams: 11,
      fibreGrams: 5,
      sodiumMg: 240,
      saturatedFatGrams: 0.6,
      carbsGrams: 10,
      sugarGrams: 2,
    },
  },
  {
    id: 'meal_dumplings',
    name: 'Steamed Chicken Dumplings (5pcs)',
    description: 'Delicate handmade dumplings filled with seasoned minced chicken, scallions, and ginger with sesame dipping sauce.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Asian',
    category: 'side',
    dietaryTags: ['High Protein', 'Steamed'],
    ingredients: ['Chicken', 'Scallions', 'Ginger', 'Sesame', 'Pastry'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 260,
    proteinGrams: 16,
    nutrition: {
      calories: 260,
      proteinGrams: 16,
      fibreGrams: 2,
      sodiumMg: 420,
      saturatedFatGrams: 1.8,
      carbsGrams: 28,
      sugarGrams: 2,
    },
  },
  {
    id: 'meal_spring_rolls',
    name: 'Crispy Veg Spring Rolls (3pcs)',
    description: 'Golden fried pastry rolls stuffed with shredded vegetables and vermicelli, served with sweet chilli sauce.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Thai',
    category: 'side',
    dietaryTags: ['Vegetarian', 'Crunchy'],
    ingredients: ['Cabbage', 'Carrot', 'Vermicelli', 'Chilli Dip'],
    spicyLevel: 1,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 210,
    proteinGrams: 4,
    nutrition: {
      calories: 210,
      proteinGrams: 4,
      fibreGrams: 3,
      sodiumMg: 320,
      saturatedFatGrams: 1.4,
      carbsGrams: 27,
      sugarGrams: 3,
    },
  },

  // --- DRINKS ---
  {
    id: 'meal_matcha_latte',
    name: 'Iced Ceremonial Matcha Latte',
    description: 'Japanese stone-ground Uji matcha whisked with creamy oat milk and lightly sweetened with organic agave.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'drink',
    dietaryTags: ['Vegan', 'Antioxidants'],
    ingredients: ['Matcha', 'Oat Milk', 'Agave'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 130,
    proteinGrams: 3,
    nutrition: {
      calories: 130,
      proteinGrams: 3,
      fibreGrams: 1,
      sodiumMg: 85,
      saturatedFatGrams: 0.5,
      carbsGrams: 18,
      sugarGrams: 12,
    },
  },
  {
    id: 'meal_coconut_water',
    name: 'Fresh Coconut Water',
    description: '100% natural, electrolyte-rich pure coconut water served chilled with fresh mint.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'drink',
    dietaryTags: ['Vegan', 'Hydrating', 'No Added Sugar'],
    ingredients: ['Coconut Water', 'Mint'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 60,
    proteinGrams: 1,
    nutrition: {
      calories: 60,
      proteinGrams: 1,
      fibreGrams: 0,
      sodiumMg: 35,
      saturatedFatGrams: 0,
      carbsGrams: 14,
      sugarGrams: 11,
    },
  },
  {
    id: 'meal_lime_soda',
    name: 'Sparkling Lime & Mint Cooler',
    description: 'Zesty fresh lime juice, crushed garden mint, and effervescent sparkling soda water.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'drink',
    dietaryTags: ['Vegan', 'Low Calorie', 'Refreshing'],
    ingredients: ['Lime', 'Mint', 'Sparkling Soda'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 35,
    proteinGrams: 0,
    nutrition: {
      calories: 35,
      proteinGrams: 0,
      fibreGrams: 0,
      sodiumMg: 20,
      saturatedFatGrams: 0,
      carbsGrams: 8,
      sugarGrams: 6,
    },
  },

  // --- DESSERTS ---
  {
    id: 'meal_mango_sticky_rice',
    name: 'Mango Sticky Rice',
    description: 'Warm coconut milk-infused glutinous sweet rice topped with ripe sweet mango slices and toasted sesame.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Thai',
    category: 'dessert',
    dietaryTags: ['Vegetarian', 'Gluten Free'],
    ingredients: ['Sticky Rice', 'Mango', 'Coconut Cream', 'Sesame'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 320,
    proteinGrams: 4,
    nutrition: {
      calories: 320,
      proteinGrams: 4,
      fibreGrams: 2,
      sodiumMg: 75,
      saturatedFatGrams: 4.2,
      carbsGrams: 58,
      sugarGrams: 26,
    },
  },
  {
    id: 'meal_matcha_mochi',
    name: 'Matcha & Sesame Mochi (2pcs)',
    description: 'Chewy Japanese rice cakes filled with premium green tea ice cream and roasted black sesame.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1763469024755-a19c6a13ef11?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'dessert',
    dietaryTags: ['Vegetarian', 'Artisanal'],
    ingredients: ['Rice Flour', 'Matcha', 'Sesame', 'Cream'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 190,
    proteinGrams: 3,
    nutrition: {
      calories: 190,
      proteinGrams: 3,
      fibreGrams: 2,
      sodiumMg: 45,
      saturatedFatGrams: 1.4,
      carbsGrams: 36,
      sugarGrams: 18,
    },
  },
  {
    id: 'meal_chia_pudding',
    name: 'Coconut Chia Seed Pudding',
    description: 'Vanilla chia seed pudding set in coconut cream, crowned with mixed wild berry compote.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'dessert',
    dietaryTags: ['Vegan', 'High Fibre', 'Superfood'],
    ingredients: ['Chia Seeds', 'Coconut Milk', 'Berries', 'Vanilla'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 210,
    proteinGrams: 5,
    nutrition: {
      calories: 210,
      proteinGrams: 5,
      fibreGrams: 8,
      sodiumMg: 40,
      saturatedFatGrams: 3.2,
      carbsGrams: 22,
      sugarGrams: 12,
    },
  },

  // --- SOUPS & SALADS ---
  {
    id: 'meal_miso_soup',
    name: 'Classic Tofu Miso Soup',
    description: 'Traditional fermented soybean broth with silken tofu cubes, wakame seaweed, and sliced spring onion.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 3.5,
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'side',
    dietaryTags: ['Vegetarian', 'Gut Friendly'],
    ingredients: ['Miso', 'Silken Tofu', 'Wakame', 'Scallions'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 85,
    proteinGrams: 6,
    nutrition: {
      calories: 85,
      proteinGrams: 6,
      fibreGrams: 2,
      sodiumMg: 490,
      saturatedFatGrams: 0.5,
      carbsGrams: 8,
      sugarGrams: 2,
    },
  },
  {
    id: 'meal_tom_yum_soup',
    name: 'Fragrant Lemongrass Tom Yum Soup',
    description: 'Hot and sour Thai broth with lemongrass, kaffir lime, galangal, straw mushrooms, and fresh coriander.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Thai',
    category: 'side',
    dietaryTags: ['Spicy', 'Dairy-Free'],
    ingredients: ['Lemongrass', 'Lime Leaf', 'Galangal', 'Mushrooms', 'Chilli'],
    spicyLevel: 2,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 110,
    proteinGrams: 4,
    nutrition: {
      calories: 110,
      proteinGrams: 4,
      fibreGrams: 2,
      sodiumMg: 520,
      saturatedFatGrams: 0.4,
      carbsGrams: 11,
      sugarGrams: 3,
    },
  },
  {
    id: 'meal_garden_salad',
    name: 'Crisp Garden Green Salad',
    description: 'Mixed baby greens, shaved radish, cherry tomatoes, and cucumber with light lemon-herb vinaigrette.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 4.0,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Mediterranean',
    category: 'side',
    dietaryTags: ['Vegan', 'Low Calorie', 'Gluten Free'],
    ingredients: ['Mixed Greens', 'Tomato', 'Cucumber', 'Radish', 'Vinaigrette'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 75,
    proteinGrams: 2,
    nutrition: {
      calories: 75,
      proteinGrams: 2,
      fibreGrams: 4,
      sodiumMg: 140,
      saturatedFatGrams: 0.4,
      carbsGrams: 10,
      sugarGrams: 3,
    },
  },

  // --- ADDITIONAL BUDGET-FRIENDLY MAINS (UNDER $12) ---
  {
    id: 'meal_egg_fried_rice',
    name: 'Wok Egg & Scallion Fried Rice',
    description: 'Wok-charred jasmine rice tossed with farm eggs, toasted garlic, sweet soy, and crisp spring onions.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 9.0,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Asian',
    category: 'main',
    dietaryTags: ['Vegetarian', 'Budget Friendly'],
    ingredients: ['Jasmine Rice', 'Eggs', 'Scallions', 'Soy Sauce', 'Garlic'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 450,
    proteinGrams: 16,
    nutrition: {
      calories: 450,
      proteinGrams: 16,
      fibreGrams: 3,
      sodiumMg: 560,
      saturatedFatGrams: 2.2,
      carbsGrams: 65,
      sugarGrams: 2,
    },
  },
  {
    id: 'meal_tofu_pad_thai',
    name: 'Street-Style Tofu Pad Thai',
    description: 'Classic wok rice noodles with organic pressed tofu, crunchy bean sprouts, crushed peanuts, and tangy tamarind.',
    restaurantId: 'rest_thai',
    restaurantName: 'Thai Orchid Street',
    price: 11.0,
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Thai',
    category: 'main',
    dietaryTags: ['Vegetarian', 'High Fibre'],
    ingredients: ['Rice Noodles', 'Tofu', 'Bean Sprouts', 'Tamarind', 'Peanuts'],
    spicyLevel: 1,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 490,
    proteinGrams: 20,
    nutrition: {
      calories: 490,
      proteinGrams: 20,
      fibreGrams: 7,
      sodiumMg: 590,
      saturatedFatGrams: 2.5,
      carbsGrams: 64,
      sugarGrams: 8,
    },
  },
  {
    id: 'meal_chickpea_curry',
    name: 'Spiced Chickpea & Spinach Stew',
    description: 'Hearty slow-cooked chickpeas in spiced tomato sauce with wilted English spinach and steamed basmati rice.',
    restaurantId: 'rest_verde',
    restaurantName: 'Verde Kitchen & Bowls',
    price: 10.5,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Indian',
    category: 'main',
    dietaryTags: ['Vegan', 'High Protein', 'Gluten Free'],
    ingredients: ['Chickpeas', 'Spinach', 'Tomato', 'Cumin', 'Basmati Rice'],
    spicyLevel: 1,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 420,
    proteinGrams: 19,
    nutrition: {
      calories: 420,
      proteinGrams: 19,
      fibreGrams: 10,
      sodiumMg: 390,
      saturatedFatGrams: 1.5,
      carbsGrams: 52,
      sugarGrams: 4,
    },
    healthFlags: {
      heartHealthy: true,
      diabetesFriendly: true,
      lowSodium: true,
      antiInflammatory: true,
      weightManagement: true,
      glutenFree: true,
    },
    displayBadges: ['❤️ Heart Healthy', '🧂 Low Sodium', '🌾 10g Fibre'],
  },
  {
    id: 'meal_chicken_teriyaki_don',
    name: 'Chicken Teriyaki Rice Bowl',
    description: 'Glazed grilled chicken thigh slices over steamed Japanese rice with sweet pickled ginger and sesame.',
    restaurantId: 'rest_tokyo',
    restaurantName: 'Tokyo Bento Co.',
    price: 11.5,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    cuisine: 'Japanese',
    category: 'main',
    dietaryTags: ['High Protein', 'Savory'],
    ingredients: ['Chicken Thigh', 'Teriyaki Glaze', 'Japanese Rice', 'Ginger'],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    calories: 510,
    proteinGrams: 32,
    nutrition: {
      calories: 510,
      proteinGrams: 32,
      fibreGrams: 4,
      sodiumMg: 610,
      saturatedFatGrams: 2.8,
      carbsGrams: 55,
      sugarGrams: 5,
    },
    healthFlags: {
      highProtein: true,
    },
    displayBadges: ['💪 32g Protein', '🍱 Tokyo Style'],
  },
];

export type HealthCategory =
  | 'heart_healthy'
  | 'diabetes_friendly'
  | 'high_protein'
  | 'low_carb'
  | 'low_sodium'
  | 'anti_inflammatory'
  | 'weight_management';

/**
 * TIER 1: INTERNAL QUALIFICATION CRITERIA
 * Behind-the-scenes logic Drop AI uses to verify eligibility for each health category.
 * Evaluates defined nutritional thresholds, healthy ingredient attributes, and data model flags.
 * (NOT displayed directly to customers)
 */
export function qualifyMealHealth(meal: Meal, category: HealthCategory): boolean {
  if (meal.category !== 'main') return false;

  // 1. Direct model healthFlags verification (primary system truth)
  if (meal.healthFlags) {
    if (category === 'heart_healthy' && meal.healthFlags.heartHealthy !== undefined) {
      return meal.healthFlags.heartHealthy;
    }
    if (category === 'diabetes_friendly' && meal.healthFlags.diabetesFriendly !== undefined) {
      return meal.healthFlags.diabetesFriendly;
    }
    if (category === 'high_protein' && meal.healthFlags.highProtein !== undefined) {
      return meal.healthFlags.highProtein;
    }
    if (category === 'low_carb' && meal.healthFlags.lowCarb !== undefined) {
      return meal.healthFlags.lowCarb;
    }
    if (category === 'low_sodium' && meal.healthFlags.lowSodium !== undefined) {
      return meal.healthFlags.lowSodium;
    }
    if (category === 'anti_inflammatory' && meal.healthFlags.antiInflammatory !== undefined) {
      return meal.healthFlags.antiInflammatory;
    }
    if (category === 'weight_management' && meal.healthFlags.weightManagement !== undefined) {
      return meal.healthFlags.weightManagement;
    }
  }

  // 2. Deterministic qualification rule fallback on structured nutrition
  const n = meal.nutrition;
  switch (category) {
    case 'heart_healthy':
      // Lower saturated fat (<=3.5g), lower sodium (<=650mg), fibre & healthy fats
      if (n) {
        return (n.saturatedFatGrams ?? 0) <= 3.5 && (n.sodiumMg ?? 999) <= 650;
      }
      return meal.dietaryTags.some(
        (t) => t.toLowerCase().includes('heart') || t.toLowerCase().includes('omega-3')
      );

    case 'diabetes_friendly':
      // Balanced complex carbs (<=55g), fibre >=6g, low added sugar (<=5g)
      if (n) {
        return (n.sugarGrams ?? 0) <= 5 && (n.fibreGrams ?? 0) >= 6 && (n.carbsGrams ?? 0) <= 55;
      }
      return meal.dietaryTags.some(
        (t) => t.toLowerCase().includes('diabetes') || t.toLowerCase().includes('fibre')
      );

    case 'high_protein':
      // 30g+ protein per meal
      if (n) return n.proteinGrams >= 30;
      return (meal.proteinGrams ?? 0) >= 30;

    case 'low_carb':
      // Net carbs <= 25g
      if (n) return (n.carbsGrams ?? 0) <= 25;
      return meal.dietaryTags.some(
        (t) => t.toLowerCase().includes('low carb') || t.toLowerCase().includes('keto')
      );

    case 'low_sodium':
      // Sodium <= 450mg
      if (n) return (n.sodiumMg ?? 999) <= 450;
      return meal.dietaryTags.some((t) => t.toLowerCase().includes('low sodium'));

    case 'anti_inflammatory':
      // Antioxidant & plant-rich whole foods, Omega-3, extra virgin olive oil
      return (
        meal.dietaryTags.some(
          (t) => t.toLowerCase().includes('anti-inflammatory') || t.toLowerCase().includes('omega-3')
        ) ||
        meal.ingredients.some((ing) =>
          ['salmon', 'turmeric', 'spinach', 'quinoa', 'barramundi', 'chia'].some((w) =>
            ing.toLowerCase().includes(w)
          )
        )
      );

    case 'weight_management':
      // Calorie-conscious (<=520 kcal), protein >=22g, fibre >=5g for fullness
      if (n) return n.calories <= 520 && n.proteinGrams >= 22;
      return (meal.calories ?? 999) <= 520;
  }
}

/**
 * TIER 2: INTERNAL RECOMMENDATION SIGNALS (RANKING)
 * Helps Drop AI decide which qualifying meal to present first:
 * - Health criteria match depth (saturated fat, sodium, protein compliance)
 * - User taste preferences (favorite cuisines, liked proteins)
 * - Preferred price ceiling
 * - Novelty (session deduplication / not eaten recently)
 */
export function rankQualifiedMeals(
  meals: Meal[],
  category: HealthCategory,
  userPreferences?: { favoriteCuisines?: string[]; maxPrice?: number },
  excludeMealIds: Set<string> | string[] = new Set()
): Recommendation[] {
  const excludeSet = excludeMealIds instanceof Set ? excludeMealIds : new Set(excludeMealIds);

  // Filter candidate pool to only qualified meals
  const qualified = meals.filter((m) => qualifyMealHealth(m, category));
  const pool = qualified.length > 0 ? qualified : meals.filter((m) => m.category === 'main');

  const scored = pool.map((meal) => {
    let score = 75; // Baseline qualification match
    const reasons: string[] = [];

    // Category-specific compliance signals
    switch (category) {
      case 'heart_healthy':
        reasons.push('✓ Heart-healthy certified');
        if (meal.nutrition?.sodiumMg && meal.nutrition.sodiumMg <= 420) {
          score += 10;
          reasons.push(`✓ Low sodium (${meal.nutrition.sodiumMg}mg)`);
        }
        if (meal.nutrition?.fibreGrams && meal.nutrition.fibreGrams >= 8) {
          score += 8;
          reasons.push(`✓ High fibre (${meal.nutrition.fibreGrams}g)`);
        }
        break;

      case 'diabetes_friendly':
        reasons.push('✓ Low glycemic impact');
        if (meal.nutrition?.fibreGrams && meal.nutrition.fibreGrams >= 8) {
          score += 10;
          reasons.push(`✓ High fibre (${meal.nutrition.fibreGrams}g)`);
        }
        break;

      case 'high_protein':
        const pG = meal.nutrition?.proteinGrams || meal.proteinGrams || 34;
        reasons.push(`✓ High protein (${pG}g)`);
        if (pG >= 38) score += 10;
        break;

      case 'low_carb':
        const carbs = meal.nutrition?.carbsGrams || 11;
        reasons.push(`✓ Only ${carbs}g net carbs`);
        score += 10;
        break;

      case 'low_sodium':
        const sod = meal.nutrition?.sodiumMg || 380;
        reasons.push(`✓ Low sodium (${sod}mg)`);
        score += 10;
        break;

      case 'anti_inflammatory':
        reasons.push('✓ Rich in Omega-3 & antioxidants');
        score += 10;
        break;

      case 'weight_management':
        const cals = meal.nutrition?.calories || meal.calories || 430;
        reasons.push(`✓ Calorie-conscious (${cals} kcal)`);
        score += 10;
        break;
    }

    // Personalization signal: User favorite cuisine
    if (
      userPreferences?.favoriteCuisines?.some(
        (c) => c.toLowerCase() === meal.cuisine.toLowerCase()
      )
    ) {
      score += 8;
      reasons.push(`✓ Matches your favorite ${meal.cuisine} cuisine`);
    }

    // Personalization signal: Price preference
    if (userPreferences?.maxPrice && meal.price <= userPreferences.maxPrice) {
      score += 6;
    }

    // Novelty signal: strongly deprioritize meals already displayed in this session
    if (excludeSet.has(meal.id)) {
      score -= 30;
    }

    return {
      meal,
      score: Math.min(score, 99),
      reasons: reasons.slice(0, 2),
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}

const MEAT_AND_SEAFOOD_KEYWORDS = [
  'chicken',
  'beef',
  'pork',
  'salmon',
  'barramundi',
  'fish',
  'seafood',
  'shrimp',
  'prawn',
  'lamb',
  'turkey',
  'bacon',
  'meat',
  'rendang',
  'biryani',
];

export function isVegetarianMeal(meal: Meal): boolean {
  const tags = meal.dietaryTags.map((t) => t.toLowerCase());
  const isTaggedVeg = tags.includes('vegetarian') || tags.includes('vegan');
  const fullText = (meal.name + ' ' + meal.description + ' ' + meal.ingredients.join(' ')).toLowerCase();
  const hasMeat = MEAT_AND_SEAFOOD_KEYWORDS.some((kw) => fullText.includes(kw));
  return isTaggedVeg && !hasMeat;
}

export function isVeganMeal(meal: Meal): boolean {
  if (!isVegetarianMeal(meal)) return false;
  const tags = meal.dietaryTags.map((t) => t.toLowerCase());
  if (!tags.includes('vegan')) return false;
  const fullText = (meal.name + ' ' + meal.description + ' ' + meal.ingredients.join(' ')).toLowerCase();
  const animalDairy = ['egg', 'eggs', 'dairy', 'milk', 'cheese', 'halloumi', 'yogurt', 'butter', 'ghee', 'cream'];
  return !animalDairy.some((kw) => fullText.includes(kw));
}

export function isHalalMeal(meal: Meal): boolean {
  const tags = meal.dietaryTags.map((t) => t.toLowerCase());
  if (tags.includes('halal') || isVegetarianMeal(meal)) {
    const fullText = (meal.name + ' ' + meal.description + ' ' + meal.ingredients.join(' ')).toLowerCase();
    return !['pork', 'bacon', 'alcohol', 'wine', 'beer'].some((kw) => fullText.includes(kw));
  }
  return false;
}

export function isGlutenFreeMeal(meal: Meal): boolean {
  const tags = meal.dietaryTags.map((t) => t.toLowerCase());
  const taggedGf = tags.some((t) => t.includes('gluten free') || t.includes('gluten-free')) || !!meal.healthFlags?.glutenFree;
  const fullText = (meal.name + ' ' + meal.description + ' ' + meal.ingredients.join(' ')).toLowerCase();
  const glutenKw = ['wheat flour', 'naan', 'pastry', 'dumpling', 'spring roll'];
  if (glutenKw.some((kw) => fullText.includes(kw) && !fullText.includes('rice noodle'))) return false;
  return taggedGf;
}

export function isDairyFreeMeal(meal: Meal): boolean {
  const tags = meal.dietaryTags.map((t) => t.toLowerCase());
  const taggedDf = tags.some((t) => t.includes('dairy-free') || t.includes('dairy free') || t.includes('vegan')) || !!meal.healthFlags?.dairyFree;
  const fullText = (meal.name + ' ' + meal.description + ' ' + meal.ingredients.join(' ')).toLowerCase();
  const dairyKw = ['milk', 'cheese', 'halloumi', 'butter', 'yogurt', 'cream', 'ghee'];
  return taggedDf && !dairyKw.some((kw) => fullText.includes(kw));
}

export function getMockRecommendations(
  query: string,
  excludeIds: string[] = []
): Recommendation[] {
  const q = query.toLowerCase();

  // 1. Detect Dietary Requirements (100% Strict Hard Constraints)
  const isVegetarianReq =
    q.includes('vegetarian') ||
    q.includes('🌱 vegetarian') ||
    q.includes('pure veg') ||
    q.includes('meatless') ||
    q.includes('no meat') ||
    q.includes('meat free') ||
    q.includes('meat-free') ||
    q === 'veg' ||
    q === '🌱 veg';

  const isVeganReq =
    q.includes('vegan') ||
    q.includes('plant-based') ||
    q.includes('plant based');

  const isHalalReq = q.includes('halal');
  const isGlutenFreeReq =
    q.includes('gluten free') ||
    q.includes('gluten-free') ||
    q.includes('celiac') ||
    q.includes('no gluten');
  const isDairyFreeReq =
    q.includes('dairy-free') ||
    q.includes('dairy free') ||
    q.includes('no dairy') ||
    q.includes('lactose');

  // 2. Detect Protein Requirements
  const isChickenReq =
    (q.includes('chicken') || q.includes('🍗 chicken')) && !isVegetarianReq && !isVeganReq;
  const isBeefReq =
    (q.includes('beef') || q.includes('rendang')) && !isVegetarianReq && !isVeganReq;
  const isSeafoodReq =
    (q.includes('salmon') ||
      q.includes('fish') ||
      q.includes('seafood') ||
      q.includes('barramundi')) &&
    !isVegetarianReq &&
    !isVeganReq;
  const isTofuReq = q.includes('tofu');

  // 3. Detect Budget Cap
  const budgetMatch = q.match(/under\s*\$?(\d+)/i);
  const maxBudget = budgetMatch ? parseFloat(budgetMatch[1]) : undefined;

  // 4. Detect Category
  const isSideReq =
    q.includes('side') ||
    q.includes('appetizer') ||
    q.includes('starter') ||
    q.includes('spring roll') ||
    q.includes('dumpling') ||
    q.includes('naan') ||
    q.includes('edamame');
  const isDrinkReq =
    q.includes('drink') ||
    q.includes('beverage') ||
    q.includes('cooler') ||
    q.includes('lassi') ||
    q.includes('latte') ||
    q.includes('soda') ||
    q.includes('water');
  const isDessertReq =
    q.includes('dessert') ||
    q.includes('desert') ||
    q.includes('sweet') ||
    q.includes('pudding') ||
    q.includes('mochi') ||
    q.includes('sticky rice');

  // 5. Detect Spiciness
  const isSpicyReq =
    q.includes('spicy') || q.includes('hot') || q.includes('chilli') || q.includes('chili');
  const isMildReq =
    q.includes('mild') || q.includes('not spicy') || q.includes('non-spicy');

  // 6. Detect Cuisines
  const isChineseReq = q.includes('chinese') || q.includes('china') || q.includes('dim sum') || q.includes('mapo') || q.includes('fried rice');
  const isKoreanReq = q.includes('korean') || q.includes('korea') || q.includes('bibimbap') || q.includes('bulgogi') || q.includes('jjajang') || q.includes('jajangmyeon');
  const isItalianReq = q.includes('italian') || q.includes('pasta') || q.includes('spaghetti') || q.includes('rigatoni') || q.includes('carbonara');
  const isThaiReq = q.includes('thai');
  const isIndianReq = q.includes('indian') || q.includes('punjabi') || q.includes('biryani') || q.includes('curry') || q.includes('dal') || q.includes('thali');
  const isJapaneseReq = q.includes('japanese') || q.includes('ramen') || q.includes('teriyaki');
  const isMalaysianReq = q.includes('malaysian') || q.includes('malaysia') || q.includes('nasi lemak');
  const isMedReq = q.includes('mediterranean');
  const isAfricanReq = q.includes('african');

  // Candidate pool from active meals
  let pool = [...MOCK_MOBILE_MEALS];

  // =========================================================================
  // HARD DIETARY CONSTRAINTS (Never violated under any condition)
  // =========================================================================
  if (isVeganReq) {
    pool = pool.filter(isVeganMeal);
  } else if (isVegetarianReq) {
    pool = pool.filter(isVegetarianMeal);
  }

  if (isHalalReq) {
    pool = pool.filter(isHalalMeal);
  }
  if (isGlutenFreeReq) {
    pool = pool.filter(isGlutenFreeMeal);
  }
  if (isDairyFreeReq) {
    pool = pool.filter(isDairyFreeMeal);
  }

  // =========================================================================
  // PROTEIN CONSTRAINTS
  // =========================================================================
  if (isChickenReq) {
    pool = pool.filter((m) =>
      (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes('chicken')
    );
  } else if (isBeefReq) {
    pool = pool.filter((m) =>
      (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes('beef')
    );
  } else if (isSeafoodReq) {
    pool = pool.filter((m) =>
      ['salmon', 'barramundi', 'fish', 'seafood', 'squid'].some((k) =>
        (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes(k)
      )
    );
  } else if (isTofuReq) {
    pool = pool.filter((m) =>
      (m.name + ' ' + m.ingredients.join(' ')).toLowerCase().includes('tofu')
    );
  }

  // =========================================================================
  // CATEGORY CONSTRAINTS
  // =========================================================================
  if (isSideReq) {
    const sides = pool.filter((m) => m.category === 'side');
    if (sides.length > 0) pool = sides;
  } else if (isDrinkReq) {
    const drinks = pool.filter((m) => m.category === 'drink');
    if (drinks.length > 0) pool = drinks;
  } else if (isDessertReq) {
    const desserts = pool.filter((m) => m.category === 'dessert');
    if (desserts.length > 0) pool = desserts;
  } else {
    // Default to main dishes if available
    const mains = pool.filter((m) => m.category === 'main');
    if (mains.length > 0) pool = mains;
  }

  // =========================================================================
  // BUDGET CONSTRAINTS
  // =========================================================================
  if (maxBudget) {
    const underBudget = pool.filter((m) => m.price <= maxBudget);
    if (underBudget.length > 0) {
      pool = underBudget;
    }
  }

  // =========================================================================
  // CUISINE CONSTRAINTS
  // =========================================================================
  if (isChineseReq) {
    const ch = pool.filter((m) => m.cuisine.toLowerCase().includes('chinese'));
    if (ch.length > 0) pool = ch;
  } else if (isKoreanReq) {
    const kor = pool.filter((m) => m.cuisine.toLowerCase() === 'korean');
    if (kor.length > 0) pool = kor;
  } else if (isItalianReq) {
    const it = pool.filter((m) => m.cuisine.toLowerCase() === 'italian');
    if (it.length > 0) pool = it;
  } else if (isThaiReq) {
    const thai = pool.filter((m) => m.cuisine.toLowerCase() === 'thai');
    if (thai.length > 0) pool = thai;
  } else if (isIndianReq) {
    const ind = pool.filter((m) => m.cuisine.toLowerCase().includes('indian') || m.cuisine.toLowerCase().includes('punjabi'));
    if (ind.length > 0) pool = ind;
  } else if (isJapaneseReq) {
    const jap = pool.filter((m) => m.cuisine.toLowerCase() === 'japanese');
    if (jap.length > 0) pool = jap;
  } else if (isMalaysianReq) {
    const mal = pool.filter((m) => m.cuisine.toLowerCase() === 'malaysian');
    if (mal.length > 0) pool = mal;
  } else if (isMedReq) {
    const med = pool.filter((m) => m.cuisine.toLowerCase() === 'mediterranean');
    if (med.length > 0) pool = med;
  } else if (isAfricanReq) {
    const afr = pool.filter((m) => m.cuisine.toLowerCase() === 'african');
    if (afr.length > 0) pool = afr;
  }

  // =========================================================================
  // SPICINESS CONSTRAINTS
  // =========================================================================
  if (isSpicyReq) {
    const spicy = pool.filter((m) => m.spicyLevel > 0);
    if (spicy.length > 0) pool = spicy;
  } else if (isMildReq) {
    const mild = pool.filter((m) => m.spicyLevel === 0);
    if (mild.length > 0) pool = mild;
  }

  // Health categories
  if (q.includes('heart')) {
    const heart = pool.filter((m) => qualifyMealHealth(m, 'heart_healthy'));
    if (heart.length > 0) pool = heart;
  } else if (q.includes('diabetes')) {
    const diab = pool.filter((m) => qualifyMealHealth(m, 'diabetes_friendly'));
    if (diab.length > 0) pool = diab;
  } else if (q.includes('protein')) {
    const highP = pool.filter(
      (m) => (m.nutrition?.proteinGrams || m.proteinGrams || 0) >= 30
    );
    if (highP.length > 0) pool = highP;
  } else if (q.includes('low carb') || q.includes('keto')) {
    const lowC = pool.filter((m) => qualifyMealHealth(m, 'low_carb'));
    if (lowC.length > 0) pool = lowC;
  } else if (q.includes('low sodium')) {
    const lowS = pool.filter((m) => qualifyMealHealth(m, 'low_sodium'));
    if (lowS.length > 0) pool = lowS;
  } else if (q.includes('weight') || q.includes('calorie')) {
    const weight = pool.filter((m) => qualifyMealHealth(m, 'weight_management'));
    if (weight.length > 0) pool = weight;
  }

  // Safety fallback: NEVER violate dietary safety!
  if (pool.length === 0) {
    if (isVeganReq) {
      pool = MOCK_MOBILE_MEALS.filter(isVeganMeal);
    } else if (isVegetarianReq) {
      pool = MOCK_MOBILE_MEALS.filter(isVegetarianMeal);
    } else if (isHalalReq) {
      pool = MOCK_MOBILE_MEALS.filter(isHalalMeal);
    } else if (isChickenReq) {
      pool = MOCK_MOBILE_MEALS.filter((m) =>
        m.name.toLowerCase().includes('chicken')
      );
    } else {
      pool = MOCK_MOBILE_MEALS.filter((m) => m.category === 'main');
    }
  }

  // Novelty deduplication if ample pool exists
  const unshown = pool.filter((m) => !excludeIds.includes(m.id));
  const finalCandidates = unshown.length >= 2 ? unshown : pool;

  return finalCandidates.map((meal, index) => {
    const reasons: string[] = [];

    if (isVegetarianReq || isVegetarianMeal(meal)) {
      reasons.push('✓ 100% Vegetarian certified');
    }
    if (isVeganReq || isVeganMeal(meal)) {
      reasons.push('✓ 100% Plant-Based & Vegan');
    }
    if (isHalalReq || isHalalMeal(meal)) {
      reasons.push('✓ Halal certified ingredients');
    }
    if (isGlutenFreeReq || isGlutenFreeMeal(meal)) {
      reasons.push('✓ Gluten-Free recipe');
    }
    if (isChickenReq) {
      reasons.push('✓ Tender lean chicken');
    }
    if (maxBudget && meal.price <= maxBudget) {
      reasons.push(`✓ Under $${maxBudget} ($${meal.price.toFixed(2)})`);
    }
    if (meal.spicyLevel > 0 && isSpicyReq) {
      reasons.push('✓ Spicy kick');
    }

    if (reasons.length === 0) {
      reasons.push('✓ Matched to your taste profile');
      reasons.push('✓ Freshly prepped on Daily Drop');
    } else if (reasons.length === 1) {
      reasons.push('✓ Top rated on Daily Drop');
    }

    return {
      meal,
      score: 98 - index * 2,
      reasons: reasons.slice(0, 2),
    };
  });
}
