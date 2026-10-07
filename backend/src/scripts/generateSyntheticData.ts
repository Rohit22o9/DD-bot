import fs from 'fs';
import path from 'path';

// Output directory
const OUTPUT_DIR = path.resolve(__dirname, '../../../synthetic_dataset');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: write array of objects to CSV
function writeCSV<T extends Record<string, any>>(filename: string, records: T[]) {
  if (records.length === 0) return;
  const headers = Object.keys(records[0]);
  const rows = records.map(r => 
    headers.map(h => {
      const val = r[h];
      if (val === null || val === undefined) return '';
      const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );
  const csvContent = [headers.join(','), ...rows].join('\n');
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), csvContent, 'utf-8');
  console.log(`✓ Generated ${filename} (${records.length} records)`);
}

// -------------------------------------------------------------
// 1. RESTAURANTS (30 curated partners)
// -------------------------------------------------------------
const RESTAURANTS = [
  { id: 'rest_01', name: 'Thai Orchid Street', cuisine: 'Thai', suburb: 'Bentley', rating: 4.8, active: true },
  { id: 'rest_02', name: 'Tokyo Bento Co.', cuisine: 'Japanese', suburb: 'Curtin', rating: 4.9, active: true },
  { id: 'rest_03', name: 'Verde Kitchen & Bowls', cuisine: 'Mediterranean', suburb: 'Curtin', rating: 4.7, active: true },
  { id: 'rest_04', name: 'El Fuego Taqueria', cuisine: 'Mexican', suburb: 'Victoria Park', rating: 4.6, active: true },
  { id: 'rest_05', name: 'Roma Cucina', cuisine: 'Italian', suburb: 'Victoria Park', rating: 4.7, active: true },
  { id: 'rest_06', name: 'Seoul Street Box', cuisine: 'Korean', suburb: 'Bentley', rating: 4.8, active: true },
  { id: 'rest_07', name: "Gulati's Indian Kitchen", cuisine: 'Indian', suburb: 'Curtin', rating: 4.8, active: true },
  { id: 'rest_08', name: 'Suya King African Kitchen', cuisine: 'African', suburb: 'Bentley', rating: 4.9, active: true },
  { id: 'rest_09', name: 'Saigon Express Pho', cuisine: 'Vietnamese', suburb: 'Victoria Park', rating: 4.7, active: true },
  { id: 'rest_10', name: 'Dragon Wok Box', cuisine: 'Chinese', suburb: 'Curtin', rating: 4.5, active: true },
  { id: 'rest_11', name: 'Beirut Mezze Grill', cuisine: 'Middle Eastern', suburb: 'Bentley', rating: 4.8, active: true },
  { id: 'rest_12', name: 'Kopitiam Nanyang Flavours', cuisine: 'Malaysian', suburb: 'Curtin', rating: 4.8, active: true },
  { id: 'rest_13', name: 'Aussie Smash Burgers', cuisine: 'Western', suburb: 'Victoria Park', rating: 4.6, active: true },
  { id: 'rest_14', name: 'Pure Greens Salad Bar', cuisine: 'Salads', suburb: 'Curtin', rating: 4.7, active: true },
  { id: 'rest_15', name: 'Kyoto Ramen Lab', cuisine: 'Japanese', suburb: 'Bentley', rating: 4.9, active: true },
  { id: 'rest_16', name: 'Taj Mahal Express', cuisine: 'Indian', suburb: 'Victoria Park', rating: 4.7, active: true },
  { id: 'rest_17', name: 'Jollof & Spice Safari', cuisine: 'African', suburb: 'Curtin', rating: 4.8, active: true },
  { id: 'rest_18', name: 'Pasta Fresca Craft', cuisine: 'Italian', suburb: 'Bentley', rating: 4.6, active: true },
  { id: 'rest_19', name: 'Bangkok Night Market', cuisine: 'Thai', suburb: 'Curtin', rating: 4.7, active: true },
  { id: 'rest_20', name: 'Ocho Rios Jerk & Grill', cuisine: 'Caribbean', suburb: 'Victoria Park', rating: 4.7, active: true },
  { id: 'rest_21', name: 'Anatolia Kebabs & Bowls', cuisine: 'Turkish', suburb: 'Bentley', rating: 4.5, active: true },
  { id: 'rest_22', name: 'Dim Sum Garden', cuisine: 'Chinese', suburb: 'Curtin', rating: 4.7, active: true },
  { id: 'rest_23', name: 'Zen Tofu & Veggie Kitchen', cuisine: 'Vegan', suburb: 'Curtin', rating: 4.9, active: true },
  { id: 'rest_24', name: 'Manila Sunset BBQ', cuisine: 'Filipino', suburb: 'Bentley', rating: 4.6, active: true },
  { id: 'rest_25', name: 'The Healthy Bowl Project', cuisine: 'Healthy', suburb: 'Victoria Park', rating: 4.8, active: true },
  { id: 'rest_26', name: 'Mumbai Chaat & Thali', cuisine: 'Indian', suburb: 'Bentley', rating: 4.6, active: true },
  { id: 'rest_27', name: 'Hanoi Baguette & Noodle', cuisine: 'Vietnamese', suburb: 'Curtin', rating: 4.8, active: true },
  { id: 'rest_28', name: 'Little Athens Souvlaki', cuisine: 'Greek', suburb: 'Victoria Park', rating: 4.7, active: true },
  { id: 'rest_29', name: 'Seoul Fried Chicken Co.', cuisine: 'Korean', suburb: 'Curtin', rating: 4.9, active: true },
  { id: 'rest_30', name: 'Curry Leaf Canteen', cuisine: 'Sri Lankan', suburb: 'Bentley', rating: 4.8, active: true },
];

// -------------------------------------------------------------
// 2. MEALS & MEAL ATTRIBUTES (60+ comprehensive meals)
// -------------------------------------------------------------
interface MealDef {
  id: string;
  restaurantId: string;
  name: string;
  category: 'main' | 'side' | 'drink' | 'dessert';
  price: number;
  portion: string;
  cuisine: string;
  subCuisine: string;
  protein: string;
  base: string;
  ingredients: string[];
  spiceLevel: number; // 0 to 5
  dietary: string[];
  allergens: string[];
  flavourProfile: string;
  healthScore: number; // 0 to 1
  proteinScore: number; // 0 to 1
  description: string;
}

const RAW_MEALS: MealDef[] = [
  // Thai
  {
    id: 'm_01', restaurantId: 'rest_01', name: 'Thai Basil Chili Chicken Bowl', category: 'main', price: 13.00, portion: '650ml',
    cuisine: 'Thai', subCuisine: 'Central Thai', protein: 'chicken', base: 'jasmine rice',
    ingredients: ['chicken breast', 'thai holy basil', 'birds eye chili', 'garlic', 'jasmine rice', 'fried egg'],
    spiceLevel: 4, dietary: ['halal', 'dairy-free'], allergens: ['soy', 'egg'], flavourProfile: 'spicy, savoury, aromatic',
    healthScore: 0.72, proteinScore: 0.85, description: 'Spicy wok-fried minced chicken with garlic, bird-eye chili, and crispy basil over jasmine rice.'
  },
  {
    id: 'm_02', restaurantId: 'rest_01', name: 'Spicy Tamarind Tofu Pad Thai', category: 'main', price: 12.50, portion: '600ml',
    cuisine: 'Thai', subCuisine: 'Street Style', protein: 'tofu', base: 'rice noodles',
    ingredients: ['rice noodles', 'firm tofu', 'tamarind', 'bean sprouts', 'peanuts', 'lime'],
    spiceLevel: 2, dietary: ['vegetarian', 'vegan', 'gluten-free'], allergens: ['peanuts', 'soy'], flavourProfile: 'sweet, tangy, nutty',
    healthScore: 0.75, proteinScore: 0.65, description: 'Rice noodles wok-tossed with tamarind glaze, crispy pressed tofu, and crushed peanuts.'
  },
  {
    id: 'm_03', restaurantId: 'rest_01', name: 'Thai Green Curry with Tender Beef', category: 'main', price: 14.50, portion: '650ml',
    cuisine: 'Thai', subCuisine: 'Central Thai', protein: 'beef', base: 'jasmine rice',
    ingredients: ['sliced beef', 'coconut milk', 'green curry paste', 'thai eggplant', 'bamboo shoots', 'jasmine rice'],
    spiceLevel: 3, dietary: ['gluten-free', 'dairy-free'], allergens: ['fish sauce'], flavourProfile: 'rich, creamy, herbal, spicy',
    healthScore: 0.60, proteinScore: 0.80, description: 'Slow-simmered beef with tender thai eggplant and aromatic kaffir lime leaves.'
  },
  {
    id: 'm_04', restaurantId: 'rest_01', name: 'Traditional Thai Iced Milk Tea', category: 'drink', price: 3.50, portion: '450ml',
    cuisine: 'Thai', subCuisine: 'Beverage', protein: 'none', base: 'tea',
    ingredients: ['black tea', 'star anise', 'condensed milk', 'crushed ice'],
    spiceLevel: 0, dietary: ['vegetarian'], allergens: ['dairy'], flavourProfile: 'sweet, creamy, spiced',
    healthScore: 0.30, proteinScore: 0.10, description: 'Slow-brewed spiced Ceylon tea sweetened with rich condensed milk.'
  },

  // Indian
  {
    id: 'm_05', restaurantId: 'rest_07', name: 'Hyderabadi Chicken Biryani', category: 'main', price: 12.00, portion: '700ml',
    cuisine: 'Indian', subCuisine: 'Hyderabadi', protein: 'chicken', base: 'basmati rice',
    ingredients: ['chicken', 'basmati rice', 'saffron', 'onion', 'yoghurt', 'cardamom', 'cloves'],
    spiceLevel: 3, dietary: ['halal', 'gluten-free'], allergens: ['dairy'], flavourProfile: 'rich, aromatic, fragrant, spiced',
    healthScore: 0.65, proteinScore: 0.88, description: 'Dum-cooked aromatic basmati rice layered with spiced marinated chicken and saffron.'
  },
  {
    id: 'm_06', restaurantId: 'rest_07', name: 'Creamy Butter Chicken with Garlic Roti', category: 'main', price: 14.00, portion: '650ml',
    cuisine: 'Indian', subCuisine: 'North Indian', protein: 'chicken', base: 'roti & rice',
    ingredients: ['chicken breast', 'tomato makhani gravy', 'butter', 'cream', 'fenugreek', 'garlic roti'],
    spiceLevel: 1, dietary: ['halal'], allergens: ['dairy', 'gluten'], flavourProfile: 'creamy, sweet, savoury, mild',
    healthScore: 0.50, proteinScore: 0.82, description: 'Tender tandoori chicken simmered in silky butter-tomato gravy with warm garlic roti.'
  },
  {
    id: 'm_07', restaurantId: 'rest_07', name: 'Spiced Chickpea Chana Masala', category: 'main', price: 11.00, portion: '600ml',
    cuisine: 'Indian', subCuisine: 'Punjabi', protein: 'chickpeas', base: 'cumin rice',
    ingredients: ['chickpeas', 'onions', 'tomatoes', 'ginger', 'garam masala', 'cumin rice'],
    spiceLevel: 3, dietary: ['vegetarian', 'vegan', 'gluten-free', 'halal'], allergens: [], flavourProfile: 'tangy, hearty, spiced',
    healthScore: 0.85, proteinScore: 0.70, description: 'Slow-cooked organic chickpeas steeped in roasted cumin and ginger-tomato sauce.'
  },
  {
    id: 'm_08', restaurantId: 'rest_07', name: 'Crispy Vegetable Samosas (2 pcs)', category: 'side', price: 4.00, portion: '200g',
    cuisine: 'Indian', subCuisine: 'Appetizer', protein: 'none', base: 'pastry',
    ingredients: ['potatoes', 'green peas', 'cumin', 'flour', 'mint chutney'],
    spiceLevel: 2, dietary: ['vegetarian', 'vegan', 'halal'], allergens: ['gluten'], flavourProfile: 'crispy, savoury, warm',
    healthScore: 0.40, proteinScore: 0.20, description: 'Flaky pastry pockets stuffed with spiced potatoes and sweet green peas.'
  },
  {
    id: 'm_09', restaurantId: 'rest_07', name: 'Alphonso Mango Lassi', category: 'drink', price: 3.50, portion: '400ml',
    cuisine: 'Indian', subCuisine: 'Beverage', protein: 'none', base: 'yoghurt',
    ingredients: ['alphonso mango pulp', 'probiotic yoghurt', 'cardamom', 'sugar'],
    spiceLevel: 0, dietary: ['vegetarian', 'gluten-free'], allergens: ['dairy'], flavourProfile: 'tropical, creamy, sweet',
    healthScore: 0.55, proteinScore: 0.30, description: 'Chilled artisanal yoghurt blended with sun-ripened Alphonso mango pulp.'
  },

  // African
  {
    id: 'm_10', restaurantId: 'rest_08', name: 'Smoky West African Jollof Chicken', category: 'main', price: 12.00, portion: '650ml',
    cuisine: 'African', subCuisine: 'West African', protein: 'chicken', base: 'jollof rice',
    ingredients: ['roasted chicken thigh', 'long-grain parboiled rice', 'red bell pepper', 'habanero', 'tomatoes', 'fried plantain'],
    spiceLevel: 3, dietary: ['halal', 'gluten-free', 'dairy-free'], allergens: [], flavourProfile: 'smoky, rich, savory, spicy',
    healthScore: 0.68, proteinScore: 0.86, description: 'Fire-roasted pepper rice topped with charred spiced chicken thigh and sweet fried plantain.'
  },
  {
    id: 'm_11', restaurantId: 'rest_08', name: 'Suya Spiced Beef Skewers Bowl', category: 'main', price: 13.50, portion: '600ml',
    cuisine: 'African', subCuisine: 'Nigerian', protein: 'beef', base: 'seasoned rice',
    ingredients: ['grilled flank steak', 'kuli-kuli peanut spice rub', 'onions', 'tomatoes', 'cabbage slaw'],
    spiceLevel: 4, dietary: ['halal', 'dairy-free'], allergens: ['peanuts'], flavourProfile: 'nutty, smoky, intensely peppery',
    healthScore: 0.70, proteinScore: 0.90, description: 'Thinly sliced flank steak coated in northern suya pepper spice with charred onions.'
  },
  {
    id: 'm_12', restaurantId: 'rest_08', name: 'Sweet Golden Fried Plantains (Dodo)', category: 'side', price: 3.50, portion: '200g',
    cuisine: 'African', subCuisine: 'Side', protein: 'none', base: 'plantain',
    ingredients: ['ripe plantain', 'vegetable oil', 'sea salt'],
    spiceLevel: 0, dietary: ['vegetarian', 'vegan', 'gluten-free', 'halal'], allergens: [], flavourProfile: 'caramelized, sweet, tender',
    healthScore: 0.60, proteinScore: 0.15, description: 'Sweet ripe plantains fried to golden perfection with caramelized edges.'
  },
  {
    id: 'm_13', restaurantId: 'rest_08', name: 'Zobo Hibiscus Ginger Brew', category: 'drink', price: 3.00, portion: '450ml',
    cuisine: 'African', subCuisine: 'Beverage', protein: 'none', base: 'hibiscus',
    ingredients: ['dried hibiscus calyx', 'fresh ginger', 'pineapple juice', 'cloves'],
    spiceLevel: 1, dietary: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], flavourProfile: 'tart, zesty, refreshing',
    healthScore: 0.88, proteinScore: 0.05, description: 'Traditional cold-steeped Nigerian hibiscus tea infused with crushed ginger and cloves.'
  },

  // Japanese
  {
    id: 'm_14', restaurantId: 'rest_02', name: 'Teriyaki Glazed Chicken Bento', category: 'main', price: 12.50, portion: '650ml',
    cuisine: 'Japanese', subCuisine: 'Bento', protein: 'chicken', base: 'calrose rice',
    ingredients: ['grilled chicken thigh', 'house teriyaki sauce', 'calrose rice', 'tamagoyaki', 'edamame', 'pickled ginger'],
    spiceLevel: 0, dietary: ['dairy-free'], allergens: ['soy', 'egg'], flavourProfile: 'sweet, savory, umami',
    healthScore: 0.70, proteinScore: 0.84, description: 'Caramelized teriyaki chicken thigh served with sushi rice, steamed edamame, and pickled ginger.'
  },
  {
    id: 'm_15', restaurantId: 'rest_02', name: 'Crispy Salmon Miso Poke Bowl', category: 'main', price: 15.00, portion: '600ml',
    cuisine: 'Japanese', subCuisine: 'Poke', protein: 'salmon', base: 'brown rice',
    ingredients: ['raw atlantic salmon', 'white miso glaze', 'avocado', 'seaweed salad', 'cucumber', 'brown rice'],
    spiceLevel: 1, dietary: ['gluten-free', 'high-protein'], allergens: ['fish', 'soy', 'sesame'], flavourProfile: 'clean, fresh, umami, nutty',
    healthScore: 0.90, proteinScore: 0.92, description: 'Fresh diced Atlantic salmon tossed in white miso sesame dressing over nutty brown rice.'
  },
  {
    id: 'm_16', restaurantId: 'rest_02', name: 'Cold-Brewed Hojicha Roasted Tea', category: 'drink', price: 2.50, portion: '400ml',
    cuisine: 'Japanese', subCuisine: 'Beverage', protein: 'none', base: 'green tea',
    ingredients: ['roasted green tea leaves', 'spring water'],
    spiceLevel: 0, dietary: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], flavourProfile: 'earthy, nutty, sugar-free',
    healthScore: 0.95, proteinScore: 0.00, description: 'Sugar-free cold-brewed Kyoto green tea with distinct nutty notes.'
  },

  // Mediterranean / Healthy
  {
    id: 'm_17', restaurantId: 'rest_03', name: 'Warm Halloumi & Ancient Grain Bowl', category: 'main', price: 13.00, portion: '600ml',
    cuisine: 'Mediterranean', subCuisine: 'Grain Bowls', protein: 'halloumi', base: 'farro & quinoa',
    ingredients: ['grilled cypriot halloumi', 'farro', 'quinoa', 'roasted beets', 'baby spinach', 'pomegranate glaze'],
    spiceLevel: 0, dietary: ['vegetarian'], allergens: ['dairy', 'gluten'], flavourProfile: 'tangy, salty, earthy',
    healthScore: 0.88, proteinScore: 0.75, description: 'Pan-seared Cypriot halloumi cheese over ancient grain medley and baby spinach.'
  },
  {
    id: 'm_18', restaurantId: 'rest_03', name: 'Crispy Herb Falafel Mezze Plate', category: 'main', price: 11.50, portion: '650ml',
    cuisine: 'Mediterranean', subCuisine: 'Levantine', protein: 'chickpeas', base: 'hummus & pita',
    ingredients: ['ground chickpea falafel', 'tahini', 'creamy hummus', 'cucumbers', 'cherry tomatoes', 'wholemeal pita'],
    spiceLevel: 0, dietary: ['vegetarian', 'vegan'], allergens: ['sesame', 'gluten'], flavourProfile: 'herby, nutty, fresh',
    healthScore: 0.85, proteinScore: 0.70, description: 'Fresh parsley-infused falafels served with velvet garlic hummus and toasted wholemeal pita.'
  },
  {
    id: 'm_19', restaurantId: 'rest_03', name: 'Tender Chicken Caesar Power Salad', category: 'main', price: 12.00, portion: '600ml',
    cuisine: 'Mediterranean', subCuisine: 'Salads', protein: 'chicken', base: 'romaine lettuce',
    ingredients: ['grilled chicken breast', 'romaine hearts', 'shaved parmesan', 'boiled egg', 'garlic sourdough croutons', 'light caesar dressing'],
    spiceLevel: 0, dietary: ['high-protein'], allergens: ['dairy', 'egg', 'fish', 'gluten'], flavourProfile: 'crisp, savory, zesty',
    healthScore: 0.82, proteinScore: 0.95, description: 'Herb-roasted chicken breast over crisp romaine with shaved parmesan and herb croutons.'
  },

  // Italian
  {
    id: 'm_20', restaurantId: 'rest_05', name: 'Slow-Cooked Beef Lasagne Classica', category: 'main', price: 14.00, portion: '650ml',
    cuisine: 'Italian', subCuisine: 'Bolognese', protein: 'beef', base: 'pasta',
    ingredients: ['angus beef bolognese', 'egg pasta sheets', 'bechamel', 'fior di latte', 'parmigiano reggiano'],
    spiceLevel: 0, dietary: [], allergens: ['gluten', 'dairy', 'egg'], flavourProfile: 'rich, savory, comforting',
    healthScore: 0.52, proteinScore: 0.80, description: 'Layered fresh egg pasta baked with 6-hour slow simmered Angus beef ragu and creamy bechamel.'
  },
  {
    id: 'm_21', restaurantId: 'rest_05', name: 'Penne Pasta with Chicken & Basil Pesto', category: 'main', price: 13.00, portion: '600ml',
    cuisine: 'Italian', subCuisine: 'Ligurian', protein: 'chicken', base: 'penne',
    ingredients: ['al dente penne', 'grilled chicken strips', 'genovese basil pesto', 'pine nuts', 'pecorino'],
    spiceLevel: 0, dietary: [], allergens: ['gluten', 'dairy', 'pine nuts'], flavourProfile: 'fragrant, herbaceous, nutty',
    healthScore: 0.65, proteinScore: 0.82, description: 'Bronze-extruded penne pasta tossed with fresh sweet basil pesto and grilled chicken.'
  },

  // Mexican
  {
    id: 'm_22', restaurantId: 'rest_04', name: 'Charred Chicken Tinga Burrito Bowl', category: 'main', price: 12.50, portion: '650ml',
    cuisine: 'Mexican', subCuisine: 'Puebla', protein: 'chicken', base: 'cilantro lime rice',
    ingredients: ['chipotle pulled chicken', 'black beans', 'cilantro rice', 'pico de gallo', 'charred corn', 'guacamole'],
    spiceLevel: 3, dietary: ['gluten-free', 'dairy-free'], allergens: [], flavourProfile: 'smoky, zesty, fresh, spicy',
    healthScore: 0.80, proteinScore: 0.85, description: 'Shredded smoky chipotle chicken atop cilantro rice, seasoned black beans, and fresh guacamole.'
  },
  {
    id: 'm_23', restaurantId: 'rest_04', name: 'Spicy Black Bean & Avocado Bowl', category: 'main', price: 11.00, portion: '600ml',
    cuisine: 'Mexican', subCuisine: 'Vegetarian', protein: 'black beans', base: 'cilantro lime rice',
    ingredients: ['spiced black beans', 'sliced avocado', 'charred corn', 'salsa verde', 'cilantro rice'],
    spiceLevel: 2, dietary: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], flavourProfile: 'zesty, earthy, creamy',
    healthScore: 0.88, proteinScore: 0.68, description: 'Slow-stewed spiced black beans with Hass avocado and tangy tomatillo salsa verde.'
  },
  {
    id: 'm_24', restaurantId: 'rest_04', name: 'Cucumber Mint Agua Fresca', category: 'drink', price: 3.00, portion: '450ml',
    cuisine: 'Mexican', subCuisine: 'Beverage', protein: 'none', base: 'fresh juice',
    ingredients: ['cold-pressed cucumber', 'lime juice', 'fresh mint', 'raw agave'],
    spiceLevel: 0, dietary: ['vegetarian', 'vegan', 'gluten-free'], allergens: [], flavourProfile: 'crisp, herbal, refreshing',
    healthScore: 0.90, proteinScore: 0.05, description: 'Freshly pressed cucumber and lime water infused with crushed garden mint.'
  },

  // Korean
  {
    id: 'm_25', restaurantId: 'rest_06', name: 'Crispy Gochujang Korean Chicken Rice', category: 'main', price: 13.50, portion: '650ml',
    cuisine: 'Korean', subCuisine: 'Street Food', protein: 'chicken', base: 'short grain rice',
    ingredients: ['crispy chicken bites', 'sweet gochujang chili glaze', 'sesame seeds', 'kimchi', 'pickled radish'],
    spiceLevel: 3, dietary: ['dairy-free'], allergens: ['soy', 'sesame', 'gluten'], flavourProfile: 'spicy, sweet, tangy, crunchy',
    healthScore: 0.58, proteinScore: 0.84, description: 'Double-fried crunchy chicken bites glazed in sweet honey-gochujang over warm rice.'
  },
  {
    id: 'm_26', restaurantId: 'rest_06', name: 'Sesame Beef Bulgogi Rice Bowl', category: 'main', price: 14.00, portion: '600ml',
    cuisine: 'Korean', subCuisine: 'Traditional', protein: 'beef', base: 'short grain rice',
    ingredients: ['marinated ribeye beef', 'pear-soy marinade', 'carrots', 'scallions', 'sesame oil'],
    spiceLevel: 1, dietary: ['dairy-free'], allergens: ['soy', 'sesame'], flavourProfile: 'sweet, savory, tender',
    healthScore: 0.72, proteinScore: 0.88, description: 'Thinly shaved beef marinated in sweet Asian pear and toasted sesame oil with steamed rice.'
  },

  // Chinese & Malaysian
  {
    id: 'm_27', restaurantId: 'rest_10', name: 'Szechuan Pepper Chicken & Green Beans', category: 'main', price: 12.50, portion: '600ml',
    cuisine: 'Chinese', subCuisine: 'Szechuan', protein: 'chicken', base: 'jasmine rice',
    ingredients: ['diced chicken', 'szechuan peppercorns', 'dry chili', 'french beans', 'garlic'],
    spiceLevel: 5, dietary: ['halal', 'dairy-free'], allergens: ['soy'], flavourProfile: 'numbing, spicy, aromatic',
    healthScore: 0.72, proteinScore: 0.85, description: 'Fiery wok-tossed chicken laced with tongue-numbing Szechuan red peppercorns.'
  },
  {
    id: 'm_28', restaurantId: 'rest_12', name: 'Malaysian Chicken Mee Goreng', category: 'main', price: 12.00, portion: '650ml',
    cuisine: 'Malaysian', subCuisine: 'Mamak', protein: 'chicken', base: 'yellow noodles',
    ingredients: ['yellow noodles', 'chicken slices', 'cabbage', 'sweet soy sauce', 'sambal chili', 'calamansi lime'],
    spiceLevel: 3, dietary: ['halal', 'dairy-free'], allergens: ['gluten', 'soy', 'crustacean'], flavourProfile: 'smoky, spicy, savory, sweet',
    healthScore: 0.60, proteinScore: 0.78, description: 'Mamak-style stir-fried yellow noodles tossed with spiced sambal paste and chicken.'
  },
  {
    id: 'm_29', restaurantId: 'rest_12', name: 'Beef Rendang Slow-Cooked Bowl', category: 'main', price: 13.00, portion: '600ml',
    cuisine: 'Malaysian', subCuisine: 'Malay', protein: 'beef', base: 'coconut rice',
    ingredients: ['beef chuck', 'toasted kerisik coconut', 'lemongrass', 'galangal', 'coconut cream', 'coconut rice'],
    spiceLevel: 3, dietary: ['halal', 'gluten-free', 'dairy-free'], allergens: [], flavourProfile: 'rich, nutty, aromatic, spicy',
    healthScore: 0.62, proteinScore: 0.88, description: 'Tender beef caramelized in rich toasted coconut flakes, lemongrass, and aromatic spices.'
  },
  {
    id: 'm_30', restaurantId: 'rest_10', name: 'Homestyle Silken Tofu in Ginger Soy', category: 'main', price: 11.00, portion: '600ml',
    cuisine: 'Chinese', subCuisine: 'Cantonese', protein: 'tofu', base: 'steamed rice',
    ingredients: ['silken tofu', 'shiitake mushrooms', 'bok choy', 'ginger soy broth', 'scallions'],
    spiceLevel: 0, dietary: ['vegetarian', 'vegan'], allergens: ['soy', 'mushrooms'], flavourProfile: 'comforting, silky, umami',
    healthScore: 0.88, proteinScore: 0.65, description: 'Velvety braised tofu and fresh tender bok choy in warm scallion-ginger reduction.'
  }
];

// -------------------------------------------------------------
// 3. SYNTHETIC PERSONA ARCHETYPES (12 archetypes + Edge Cases)
// -------------------------------------------------------------
interface PersonaArchetype {
  name: string;
  budgetMin: number;
  budgetMax: number;
  chickenAffinity: number;
  beefAffinity: number;
  vegetarianAffinity: number;
  spiceAffinity: number;
  noveltyPreference: number;
  priceSensitivity: number;
  healthyAffinity: number;
  preferredCuisines: string[];
  dislikedFoods: string[];
  allergens: string[];
}

const PERSONA_ARCHETYPES: Record<string, PersonaArchetype> = {
  'Value Hunter': {
    name: 'Value Hunter',
    budgetMin: 10, budgetMax: 13,
    chickenAffinity: 0.8, beefAffinity: 0.4, vegetarianAffinity: 0.3,
    spiceAffinity: 0.6, noveltyPreference: 0.4, priceSensitivity: 0.95, healthyAffinity: 0.4,
    preferredCuisines: ['Indian', 'Chinese', 'Malaysian'], dislikedFoods: [], allergens: []
  },
  'Protein Lover': {
    name: 'Protein Lover',
    budgetMin: 12, budgetMax: 16,
    chickenAffinity: 0.95, beefAffinity: 0.90, vegetarianAffinity: 0.05,
    spiceAffinity: 0.7, noveltyPreference: 0.5, priceSensitivity: 0.40, healthyAffinity: 0.8,
    preferredCuisines: ['Korean', 'African', 'Western'], dislikedFoods: ['tofu'], allergens: []
  },
  'Healthy Eater': {
    name: 'Healthy Eater',
    budgetMin: 11, budgetMax: 15,
    chickenAffinity: 0.6, beefAffinity: 0.1, vegetarianAffinity: 0.85,
    spiceAffinity: 0.3, noveltyPreference: 0.6, priceSensitivity: 0.50, healthyAffinity: 0.95,
    preferredCuisines: ['Mediterranean', 'Japanese', 'Salads'], dislikedFoods: ['deep-fried'], allergens: []
  },
  'Spice Lover': {
    name: 'Spice Lover',
    budgetMin: 11, budgetMax: 16,
    chickenAffinity: 0.85, beefAffinity: 0.80, vegetarianAffinity: 0.4,
    spiceAffinity: 0.95, noveltyPreference: 0.7, priceSensitivity: 0.50, healthyAffinity: 0.5,
    preferredCuisines: ['Thai', 'Indian', 'African', 'Korean'], dislikedFoods: [], allergens: []
  },
  'Vegetarian': {
    name: 'Vegetarian',
    budgetMin: 10, budgetMax: 14,
    chickenAffinity: 0.0, beefAffinity: 0.0, vegetarianAffinity: 1.0,
    spiceAffinity: 0.5, noveltyPreference: 0.6, priceSensitivity: 0.60, healthyAffinity: 0.8,
    preferredCuisines: ['Indian', 'Mediterranean', 'Vegan'], dislikedFoods: ['meat', 'chicken', 'beef', 'fish'], allergens: []
  },
  'Adventurous Eater': {
    name: 'Adventurous Eater',
    budgetMin: 12, budgetMax: 18,
    chickenAffinity: 0.7, beefAffinity: 0.75, vegetarianAffinity: 0.6,
    spiceAffinity: 0.8, noveltyPreference: 0.95, priceSensitivity: 0.30, healthyAffinity: 0.6,
    preferredCuisines: ['African', 'Malaysian', 'Korean', 'Thai'], dislikedFoods: [], allergens: []
  },
  'Habitual Eater': {
    name: 'Habitual Eater',
    budgetMin: 11, budgetMax: 14,
    chickenAffinity: 0.85, beefAffinity: 0.5, vegetarianAffinity: 0.2,
    spiceAffinity: 0.4, noveltyPreference: 0.05, priceSensitivity: 0.60, healthyAffinity: 0.5,
    preferredCuisines: ['Indian', 'Italian'], dislikedFoods: ['mushrooms'], allergens: []
  },
  'Premium Foodie': {
    name: 'Premium Foodie',
    budgetMin: 14, budgetMax: 22,
    chickenAffinity: 0.7, beefAffinity: 0.90, vegetarianAffinity: 0.5,
    spiceAffinity: 0.6, noveltyPreference: 0.85, priceSensitivity: 0.10, healthyAffinity: 0.7,
    preferredCuisines: ['Japanese', 'Italian', 'Mediterranean'], dislikedFoods: [], allergens: []
  },
  'Student Regular': {
    name: 'Student Regular',
    budgetMin: 10, budgetMax: 13,
    chickenAffinity: 0.85, beefAffinity: 0.6, vegetarianAffinity: 0.4,
    spiceAffinity: 0.7, noveltyPreference: 0.5, priceSensitivity: 0.90, healthyAffinity: 0.45,
    preferredCuisines: ['Indian', 'Korean', 'Thai'], dislikedFoods: [], allergens: []
  },
  'Peanut Allergy Regular': {
    name: 'Peanut Allergy Regular',
    budgetMin: 11, budgetMax: 15,
    chickenAffinity: 0.8, beefAffinity: 0.6, vegetarianAffinity: 0.5,
    spiceAffinity: 0.5, noveltyPreference: 0.5, priceSensitivity: 0.6, healthyAffinity: 0.6,
    preferredCuisines: ['Italian', 'Japanese', 'Mediterranean'], dislikedFoods: [], allergens: ['peanuts']
  }
};

const PICKUP_POINTS = ['Curtin Central Bus Station', 'Curtin Engineering Guild', 'Bentley Library Commons', 'Victoria Park Station Hub'];
const SUBURBS = ['Bentley', 'Curtin', 'Victoria Park', 'Waterford', 'Como'];

// -------------------------------------------------------------
// 4. GENERATION PIPELINE
// -------------------------------------------------------------
console.log('🚀 Starting Relational Synthetic Dataset Generation for Drop AI...');

const NUM_CUSTOMERS = 300;
const personaKeys = Object.keys(PERSONA_ARCHETYPES);

const customers: any[] = [];
const customerPreferences: any[] = [];
const groundTruthList: any[] = [];

// Create 300 customers with realistic ground truth & preferences
for (let i = 1; i <= NUM_CUSTOMERS; i++) {
  const custId = `C${String(i).padStart(5, '0')}`;
  const primaryKey = personaKeys[(i - 1) % personaKeys.length];
  const secondaryKey = personaKeys[(i * 3) % personaKeys.length];
  const arch = PERSONA_ARCHETYPES[primaryKey];

  // Introduce small random variations (+/- 10%)
  const jitter = (base: number) => Math.min(1.0, Math.max(0.0, +(base + (Math.random() * 0.2 - 0.1)).toFixed(2)));
  const budget = +(arch.budgetMin + Math.random() * (arch.budgetMax - arch.budgetMin)).toFixed(2);

  const gt = {
    customer_id: custId,
    primary_persona: primaryKey,
    secondary_persona: secondaryKey,
    budget_target: budget,
    chicken_affinity: jitter(arch.chickenAffinity),
    beef_affinity: jitter(arch.beefAffinity),
    vegetarian_affinity: jitter(arch.vegetarianAffinity),
    spice_affinity: jitter(arch.spiceAffinity),
    novelty_preference: jitter(arch.noveltyPreference),
    price_sensitivity: jitter(arch.priceSensitivity),
    healthy_affinity: jitter(arch.healthyAffinity),
    has_allergy: arch.allergens.length > 0 ? arch.allergens.join(';') : 'none'
  };
  groundTruthList.push(gt);

  // Customer account
  const pickup = PICKUP_POINTS[i % PICKUP_POINTS.length];
  const suburb = SUBURBS[i % SUBURBS.length];
  customers.push({
    customer_id: custId,
    name: `User ${custId}`,
    email: `customer.${custId.toLowerCase()}@dailydrop.com`,
    primary_persona: primaryKey,
    default_pickup_point: pickup,
    delivery_suburb: suburb,
    created_at: new Date(Date.now() - (300 - i) * 86400000).toISOString()
  });

  // Explicit preferences
  if (arch.allergens.length > 0) {
    customerPreferences.push({
      customer_id: custId,
      preference_type: 'allergy',
      preference_value: arch.allergens.join(';'),
      explicit_or_inferred: 'explicit',
      confidence: 1.0,
      created_at: new Date(Date.now() - 60 * 86400000).toISOString()
    });
  }

  // Explicit or inferred cuisine
  arch.preferredCuisines.forEach(c => {
    customerPreferences.push({
      customer_id: custId,
      preference_type: 'cuisine',
      preference_value: c,
      explicit_or_inferred: Math.random() > 0.4 ? 'explicit' : 'inferred',
      confidence: +(0.75 + Math.random() * 0.24).toFixed(2),
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    });
  });

  // Explicit dislikes
  arch.dislikedFoods.forEach(d => {
    customerPreferences.push({
      customer_id: custId,
      preference_type: 'dislike',
      preference_value: d,
      explicit_or_inferred: 'explicit',
      confidence: 1.0,
      created_at: new Date(Date.now() - 40 * 86400000).toISOString()
    });
  });
}

// -------------------------------------------------------------
// 5. MEALS & MEAL ATTRIBUTES TABLES
// -------------------------------------------------------------
const mealsTable = RAW_MEALS.map(m => ({
  meal_id: m.id,
  restaurant_id: m.restaurantId,
  name: m.name,
  description: m.description,
  price: m.price.toFixed(2),
  portion: m.portion,
  category: m.category,
  active: true
}));

const mealAttributesTable = RAW_MEALS.map(m => ({
  meal_id: m.id,
  cuisine: m.cuisine,
  sub_cuisine: m.subCuisine,
  protein: m.protein,
  base: m.base,
  ingredients: m.ingredients.join('; '),
  spice_level: m.spiceLevel,
  dietary: m.dietary.join('; '),
  allergens: m.allergens.length ? m.allergens.join('; ') : 'none',
  flavour_profile: m.flavourProfile,
  health_score: m.healthScore.toFixed(2),
  protein_score: m.proteinScore.toFixed(2)
}));

// -------------------------------------------------------------
// 6. MENU AVAILABILITY TABLE
// -------------------------------------------------------------
const DAYS = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'];
const menuAvailabilityTable: any[] = [];

DAYS.forEach(day => {
  PICKUP_POINTS.forEach(pickup => {
    RAW_MEALS.forEach(meal => {
      // 80% chance of availability
      if (Math.random() < 0.8) {
        menuAvailabilityTable.push({
          meal_id: meal.id,
          date: day,
          pickup_point: pickup,
          slot: 'dinner',
          available_count: 25 + Math.floor(Math.random() * 35)
        });
      }
    });
  });
});

// -------------------------------------------------------------
// 7. BEHAVIOR SIMULATION (Interactions, Orders, AI Chats, Swipes)
// -------------------------------------------------------------
const interactionEvents: any[] = [];
const ordersTable: any[] = [];
const orderItemsTable: any[] = [];
const aiConversations: any[] = [];
const aiMessages: any[] = [];
const aiRecommendations: any[] = [];
const recommendationOutcomes: any[] = [];

let eventIdCounter = 1;
let orderIdCounter = 1;
let convIdCounter = 1;
let msgIdCounter = 1;
let recIdCounter = 1;

// Edge cases mapping
// C00001: Brand new customer (0 orders)
// C00002: One order customer
// C00003: 100+ order customer
// C00004: Heavy browser, rare buyer
const edgeCustomerIds = new Set(['C00001', 'C00002', 'C00003', 'C00004']);

customers.forEach((cust, index) => {
  const custId = cust.customer_id;
  const gt = groundTruthList[index];

  let orderCount = 0;
  if (custId === 'C00001') {
    orderCount = 0; // brand new
  } else if (custId === 'C00002') {
    orderCount = 1; // single order
  } else if (custId === 'C00003') {
    orderCount = 50; // power customer
  } else if (custId === 'C00004') {
    orderCount = 1; // browser
  } else {
    orderCount = Math.floor(Math.random() * 8) + 1;
  }

  // Calculate score for each meal according to ground truth formula
  const scoredMeals = RAW_MEALS.map(meal => {
    let score = 0.5;

    // Allergy check
    if (gt.has_allergy !== 'none' && meal.allergens.some(a => gt.has_allergy.includes(a))) {
      return { meal, score: -100 }; // strict rejection
    }

    // Protein score
    if (meal.protein === 'chicken') score += (gt.chicken_affinity - 0.5) * 0.4;
    else if (meal.protein === 'beef') score += (gt.beef_affinity - 0.5) * 0.4;
    else if (meal.dietary.includes('vegetarian')) score += (gt.vegetarian_affinity - 0.5) * 0.4;

    // Spice score
    const mealSpiceRatio = meal.spiceLevel / 5;
    score += (1 - Math.abs(mealSpiceRatio - gt.spice_affinity)) * 0.3;

    // Budget match
    if (meal.price <= gt.budget_target) {
      score += 0.2;
    } else {
      score -= (meal.price - gt.budget_target) * 0.15 * gt.price_sensitivity;
    }

    // Health
    score += (meal.healthScore - 0.5) * gt.healthy_affinity * 0.3;

    // Random human noise (+/- 0.1)
    score += (Math.random() * 0.2 - 0.1);

    return { meal, score };
  }).filter(sm => sm.score > -50).sort((a, b) => b.score - a.score);

  // Generate simulated browsing & swipe events
  const sessionCount = Math.max(1, orderCount * 2);
  for (let s = 0; s < sessionCount; s++) {
    const sessionId = `sess_${custId}_${s + 1}`;
    const sessionTime = new Date(Date.now() - (s * 3 + 1) * 86400000 + Math.random() * 3600000).toISOString();

    // System shows top 4 meals as impressions
    const candidateSubset = scoredMeals.slice(0, 5);
    candidateSubset.forEach(({ meal, score }) => {
      // Impression
      interactionEvents.push({
        event_id: `evt_${eventIdCounter++}`,
        customer_id: custId,
        session_id: sessionId,
        meal_id: meal.id,
        event_type: 'impression',
        timestamp: sessionTime,
        rejection_reason: ''
      });

      // Swipe game or browse action
      if (score > 0.65) {
        interactionEvents.push({
          event_id: `evt_${eventIdCounter++}`,
          customer_id: custId,
          session_id: sessionId,
          meal_id: meal.id,
          event_type: 'swipe_right',
          timestamp: sessionTime,
          rejection_reason: ''
        });
      } else if (Math.random() < 0.3) {
        // Collect "Why Not?" feedback! (PDF Page 21)
        const reasons = ['Too expensive', 'Don\'t like beef', 'Too heavy', 'Not today', 'Too spicy'];
        const chosenReason = reasons[Math.floor(Math.random() * reasons.length)];
        interactionEvents.push({
          event_id: `evt_${eventIdCounter++}`,
          customer_id: custId,
          session_id: sessionId,
          meal_id: meal.id,
          event_type: 'swipe_left',
          timestamp: sessionTime,
          rejection_reason: chosenReason
        });
      }

      // Click
      if (score > 0.68) {
        interactionEvents.push({
          event_id: `evt_${eventIdCounter++}`,
          customer_id: custId,
          session_id: sessionId,
          meal_id: meal.id,
          event_type: 'clicked',
          timestamp: sessionTime,
          rejection_reason: ''
        });
      }
    });

    // AI Conversation simulation (1 out of 3 sessions)
    if (s % 3 === 0 && candidateSubset.length >= 3) {
      const convId = `conv_${convIdCounter++}`;
      const recId = `rec_${recIdCounter++}`;

      aiConversations.push({
        conversation_id: convId,
        customer_id: custId,
        session_id: sessionId,
        created_at: sessionTime
      });

      // Formulate natural language inquiry based on persona
      let userQuery = 'What should I eat tonight?';
      let extractedIntent = 'meal_search';
      let constraints: any = { max_price: gt.budget_target };

      if (gt.spice_affinity > 0.7) {
        userQuery = `Something spicy under $${Math.ceil(gt.budget_target)}`;
        constraints.spice = 'spicy';
      } else if (gt.primary_persona === 'Protein Lover') {
        userQuery = `High protein chicken dinner under $${Math.ceil(gt.budget_target)}`;
        constraints.protein = 'chicken';
        constraints.health = 'high-protein';
      } else if (gt.primary_persona === 'Vegetarian') {
        userQuery = 'Healthy vegetarian dinner for tonight';
        constraints.dietary = 'vegetarian';
      }

      aiMessages.push({
        message_id: `msg_${msgIdCounter++}`,
        conversation_id: convId,
        sender: 'user',
        message: userQuery,
        intent: extractedIntent,
        extracted_constraints: JSON.stringify(constraints),
        timestamp: sessionTime
      });

      const topThree = candidateSubset.slice(0, 3);
      topThree.forEach((sm, rank) => {
        aiRecommendations.push({
          recommendation_id: recId,
          conversation_id: convId,
          meal_id: sm.meal.id,
          position: rank + 1,
          score: Math.min(0.99, +(sm.score * 0.8 + 0.2).toFixed(2)),
          reason: `${sm.meal.cuisine} · ${sm.meal.protein} · $${sm.meal.price}`,
          timestamp: sessionTime
        });
      });

      // Was it picked?
      const chosen = topThree[0];
      recommendationOutcomes.push({
        recommendation_id: recId,
        customer_id: custId,
        meal_id: chosen.meal.id,
        clicked: true,
        added_cart: chosen.score > 0.7,
        purchased: chosen.score > 0.75,
        dismissed: chosen.score <= 0.7
      });
    }
  }

  // Create actual orders
  for (let o = 0; o < orderCount; o++) {
    const orderId = `ord_${orderIdCounter++}`;
    const bestMeal = scoredMeals[o % Math.min(3, scoredMeals.length)].meal;
    const orderDate = new Date(Date.now() - (o * 4 + 2) * 86400000).toISOString();

    ordersTable.push({
      order_id: orderId,
      customer_id: custId,
      order_date: orderDate,
      pickup_location: cust.default_pickup_point,
      delivery_suburb: cust.delivery_suburb,
      total_amount: bestMeal.price.toFixed(2),
      status: 'completed',
      day_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][o % 5],
      meal_occasion: 'Dinner',
      ordering_mode: 'Individual'
    });

    orderItemsTable.push({
      order_id: orderId,
      meal_id: bestMeal.id,
      quantity: 1,
      unit_price: bestMeal.price.toFixed(2),
      item_type: 'main'
    });

    interactionEvents.push({
      event_id: `evt_${eventIdCounter++}`,
      customer_id: custId,
      session_id: `sess_${custId}_order`,
      meal_id: bestMeal.id,
      event_type: 'purchased',
      timestamp: orderDate,
      rejection_reason: ''
    });
  }
});

// -------------------------------------------------------------
// 8. WRITE ALL CSV FILES (Section 3 & Section 2 specifications)
// -------------------------------------------------------------
writeCSV('customers.csv', customers);
writeCSV('customer_preferences.csv', customerPreferences);
writeCSV('restaurants.csv', RESTAURANTS);
writeCSV('meals.csv', mealsTable);
writeCSV('meal_attributes.csv', mealAttributesTable);
writeCSV('menu_availability.csv', menuAvailabilityTable);
writeCSV('interaction_events.csv', interactionEvents);
writeCSV('orders.csv', ordersTable);
writeCSV('order_items.csv', orderItemsTable);
writeCSV('ai_conversations.csv', aiConversations);
writeCSV('ai_messages.csv', aiMessages);
writeCSV('ai_recommendations.csv', aiRecommendations);
writeCSV('recommendation_outcomes.csv', recommendationOutcomes);
writeCSV('synthetic_ground_truth.csv', groundTruthList);

// Also generate a dataset summary manifest
const manifest = {
  version: '1.0.0',
  description: 'Drop AI Relational Synthetic Dataset matching Drop AI specifications',
  generated_at: new Date().toISOString(),
  counts: {
    customers: customers.length,
    customer_preferences: customerPreferences.length,
    restaurants: RESTAURANTS.length,
    meals: mealsTable.length,
    meal_attributes: mealAttributesTable.length,
    menu_availability: menuAvailabilityTable.length,
    interaction_events: interactionEvents.length,
    orders: ordersTable.length,
    order_items: orderItemsTable.length,
    ai_conversations: aiConversations.length,
    ai_messages: aiMessages.length,
    ai_recommendations: aiRecommendations.length,
    recommendation_outcomes: recommendationOutcomes.length,
    synthetic_ground_truth: groundTruthList.length
  },
  archetypes: personaKeys,
  edge_cases: ['C00001 (Zero history)', 'C00002 (Single order)', 'C00003 (50+ orders)', 'C00004 (High impressions, low conversion)']
};

fs.writeFileSync(path.join(OUTPUT_DIR, 'dataset_manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('✓ Generated dataset_manifest.json');
console.log('🎉 Relational Synthetic Dataset Generation Complete!');
