import { GroceryItem, GroceryOrderList } from '../types';

export const GROCERY_CATALOG: GroceryItem[] = [
  // 🥛 DAIRY & EGGS
  {
    id: 'groc_milk_01',
    name: 'Whole Organic Milk',
    category: 'dairy',
    price: 3.49,
    unit: '1 Gallon',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Clover Valley',
  },
  {
    id: 'groc_eggs_02',
    name: 'Farm Fresh Brown Eggs',
    category: 'dairy',
    price: 4.29,
    unit: '12 Pack (Grade A)',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Pasture Ridge',
  },
  {
    id: 'groc_yogurt_03',
    name: 'Greek Yogurt Plain 0%',
    category: 'dairy',
    price: 4.99,
    unit: '32 oz Tub',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Oikos Pure',
  },
  {
    id: 'groc_butter_04',
    name: 'European Unsalted Butter',
    category: 'dairy',
    price: 3.89,
    unit: '250g (8 oz)',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Golden Meadow',
  },
  {
    id: 'groc_cheese_05',
    name: 'Sharp Cheddar Cheese Block',
    category: 'dairy',
    price: 4.5,
    unit: '8 oz Block',
    imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Cabot Reserve',
  },
  {
    id: 'groc_oatmilk_06',
    name: 'Barista Oat Milk',
    category: 'dairy',
    price: 4.19,
    unit: '1 Quart (32 oz)',
    imageUrl: 'https://images.unsplash.com/photo-1568651318090-0f2b33dc4627?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Oatly Creamy',
  },
  {
    id: 'groc_paneer_32',
    name: 'Fresh Malai Paneer',
    category: 'dairy',
    price: 4.99,
    unit: '400g Block',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Dairy Craft',
  },

  // 🥦 FRESH PRODUCE & VEGGIES
  {
    id: 'groc_tomatoes_07',
    name: 'Vine-Ripened Roma Tomatoes',
    category: 'produce',
    price: 2.79,
    unit: '1 lb (approx. 4 pcs)',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Valley Harvest',
  },
  {
    id: 'groc_avocados_08',
    name: 'Ripe Hass Avocados',
    category: 'produce',
    price: 3.99,
    unit: '3 Pack',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Sun Tropics',
  },
  {
    id: 'groc_spinach_09',
    name: 'Organic Baby Spinach',
    category: 'produce',
    price: 3.29,
    unit: '5 oz Clamshell',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Earthbound Greens',
  },
  {
    id: 'groc_bananas_10',
    name: 'Sweet Cavendish Bananas',
    category: 'produce',
    price: 1.89,
    unit: '1 Bunch (approx. 5 pcs)',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Fair Trade',
  },
  {
    id: 'groc_apples_11',
    name: 'Crisp Honeycrisp Apples',
    category: 'produce',
    price: 4.49,
    unit: '2 lbs Bag',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Orchard Select',
  },
  {
    id: 'groc_garlic_12',
    name: 'Fresh Garlic Bulbs',
    category: 'produce',
    price: 1.49,
    unit: '3 Pack Bulbs',
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Local Roots',
  },
  {
    id: 'groc_onions_13',
    name: 'Sweet Yellow Onions',
    category: 'produce',
    price: 2.29,
    unit: '2 lbs Mesh Bag',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Valley Harvest',
  },
  {
    id: 'groc_potatoes_29',
    name: 'Russet Baking Potatoes',
    category: 'produce',
    price: 2.99,
    unit: '3 lbs Bag',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Farm Crisp',
  },
  {
    id: 'groc_lemons_14',
    name: 'Juicy Eureka Lemons',
    category: 'produce',
    price: 2.49,
    unit: '4 Pack',
    imageUrl: 'https://images.unsplash.com/photo-1533083451535-642c6a932377?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Citrus Grove',
  },
  {
    id: 'groc_peppers_31',
    name: 'Tricolor Bell Peppers',
    category: 'produce',
    price: 3.49,
    unit: '3 Pack',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Sunshine Farms',
  },

  // 🍞 BAKERY & BREADS
  {
    id: 'groc_sourdough_15',
    name: 'Artisan Sourdough Boule',
    category: 'bakery',
    price: 4.99,
    unit: '1 Loaf (Baked Daily)',
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Hearth & Stone Bakery',
  },
  {
    id: 'groc_wheatbread_16',
    name: '100% Whole Wheat Sliced Bread',
    category: 'bakery',
    price: 3.49,
    unit: '20 oz Loaf',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Nature Harvest',
  },
  {
    id: 'groc_bagels_17',
    name: 'New York Style Plain Bagels',
    category: 'bakery',
    price: 3.99,
    unit: '6 Pack Bag',
    imageUrl: 'https://images.unsplash.com/photo-1585478259715-876a6a81ae08?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Empire Bakery',
  },

  // 🥫 PANTRY & ESSENTIALS
  {
    id: 'groc_oliveoil_18',
    name: 'Extra Virgin Olive Oil',
    category: 'pantry',
    price: 8.99,
    unit: '500 ml Glass Bottle',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Terra D’Oro',
  },
  {
    id: 'groc_pasta_19',
    name: 'Bronze-Cut Penne Rigate Pasta',
    category: 'pantry',
    price: 2.49,
    unit: '1 lb (500g)',
    imageUrl: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'De Cecco Italian',
  },
  {
    id: 'groc_sauce_20',
    name: 'San Marzano Marinara Sauce',
    category: 'pantry',
    price: 3.99,
    unit: '24 oz Jar',
    imageUrl: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Rao’s Traditional',
  },
  {
    id: 'groc_rice_21',
    name: 'Aromatic Basmati Rice',
    category: 'pantry',
    price: 5.49,
    unit: '2 lbs Bag',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Royal Reserve',
  },
  {
    id: 'groc_oats_22',
    name: 'Old Fashioned Rolled Oats',
    category: 'pantry',
    price: 3.79,
    unit: '32 oz Canister',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Bob’s Mill',
  },
  {
    id: 'groc_honey_23',
    name: 'Raw Organic Wildflower Honey',
    category: 'pantry',
    price: 6.99,
    unit: '16 oz Glass Jar',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Bee Pure Apiaries',
  },

  // 🥩 PROTEIN & DELI
  {
    id: 'groc_chicken_24',
    name: 'Free-Range Chicken Breast',
    category: 'meat',
    price: 8.49,
    unit: '1 lb (Skinless/Boneless)',
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Prairie Pride',
  },
  {
    id: 'groc_salmon_25',
    name: 'Fresh Atlantic Salmon Fillet',
    category: 'meat',
    price: 11.99,
    unit: '1 lb Fresh Cut',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Nordic Sea',
  },
  {
    id: 'groc_tofu_26',
    name: 'Organic High-Protein Extra Firm Tofu',
    category: 'meat',
    price: 2.99,
    unit: '14 oz Block',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Wildwood Organic',
  },

  // 🧃 BEVERAGES & SNACKS
  {
    id: 'groc_coffee_27',
    name: 'Single-Origin Ethiopian Coffee Beans',
    category: 'beverage',
    price: 9.99,
    unit: '12 oz Whole Bean',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Blue Sky Roasters',
  },
  {
    id: 'groc_orangejuice_28',
    name: 'Freshly Squeezed Orange Juice',
    category: 'beverage',
    price: 4.49,
    unit: '52 oz Bottle',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Sun Orchard',
  },
  {
    id: 'groc_tea_33',
    name: 'Organic Jasmine Green Tea',
    category: 'beverage',
    price: 4.29,
    unit: '20 Tea Bags',
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Pure Leaf',
  },
  {
    id: 'groc_cookies_34',
    name: 'Artisan Chocolate Chip Cookies',
    category: 'snack',
    price: 3.99,
    unit: '10 Pack Box',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Bakehouse Sweet',
  },
  {
    id: 'groc_chips_35',
    name: 'Sea Salt Kettle Cooked Potato Chips',
    category: 'snack',
    price: 2.99,
    unit: '8 oz Bag',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
    quantity: 1,
    checked: true,
    inStock: true,
    brand: 'Cape Cod Style',
  },
];

// Spoken word numbers to numeric values
const NUMBER_WORD_MAP: Record<string, number> = {
  one: 1,
  a: 1,
  an: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  dozen: 12,
  'half dozen': 6,
};

export function parseGroceryVoiceTranscript(transcript: string): GroceryOrderList {
  const clean = transcript.trim();
  const lower = clean.toLowerCase();

  // If transcript is generic ("I need to buy some groceries", "order groceries", "groceries please")
  const isGeneric =
    lower === 'i need to buy some groceries' ||
    lower === 'i need groceries' ||
    lower === 'buy groceries' ||
    lower === 'grocery' ||
    lower === 'groceries' ||
    lower === 'order groceries' ||
    lower === 'show groceries' ||
    lower === 'help me buy groceries' ||
    lower === 'weekly essentials';

  if (isGeneric) {
    const starterIds = [
      'groc_milk_01',
      'groc_eggs_02',
      'groc_sourdough_15',
      'groc_avocados_08',
      'groc_tomatoes_07',
      'groc_bananas_10',
      'groc_butter_04',
      'groc_yogurt_03',
    ];
    const starterItems = GROCERY_CATALOG.filter((i) => starterIds.includes(i.id)).map((i) => ({
      ...i,
      quantity: 1,
      checked: true,
    }));

    const subtotal = Math.round(starterItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
    return {
      id: `groc_list_${Date.now()}`,
      title: 'Weekly Fresh Essentials Basket',
      transcript: clean,
      items: starterItems,
      subtotal,
      estimatedDelivery: 'Today within 45 mins',
    };
  }

  // Check if user specifically requested a category
  if (lower.includes('dairy')) {
    const dairyItems = GROCERY_CATALOG.filter((i) => i.category === 'dairy').slice(0, 5).map((i) => ({ ...i, quantity: 1, checked: true }));
    const subtotal = Math.round(dairyItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
    return {
      id: `groc_list_${Date.now()}`,
      title: 'Dairy & Farm Fresh Essentials',
      transcript: clean,
      items: dairyItems,
      subtotal,
      estimatedDelivery: 'Today within 45 mins',
    };
  }
  if (lower.includes('produce') || lower.includes('vegetable') || lower.includes('veggie')) {
    const produceItems = GROCERY_CATALOG.filter((i) => i.category === 'produce').slice(0, 6).map((i) => ({ ...i, quantity: 1, checked: true }));
    const subtotal = Math.round(produceItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
    return {
      id: `groc_list_${Date.now()}`,
      title: 'Farm Fresh Produce',
      transcript: clean,
      items: produceItems,
      subtotal,
      estimatedDelivery: 'Today within 45 mins',
    };
  }
  if (lower.includes('bakery') || lower.includes('bread')) {
    const bakeryItems = GROCERY_CATALOG.filter((i) => i.category === 'bakery').map((i) => ({ ...i, quantity: 1, checked: true }));
    if (bakeryItems.length > 0 && (lower === 'bakery' || lower === 'bakery items' || lower === 'show bakery')) {
      const subtotal = Math.round(bakeryItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
      return {
        id: `groc_list_${Date.now()}`,
        title: 'Fresh Bakery & Artisan Breads',
        transcript: clean,
        items: bakeryItems,
        subtotal,
        estimatedDelivery: 'Today within 45 mins',
      };
    }
  }

  const matchedItems: GroceryItem[] = [];
  const matchedIds = new Set<string>();

  const itemKeywords: { [id: string]: string[] } = {
    groc_milk_01: ['milk', 'dairy', 'whole milk', 'organic milk', 'cow milk'],
    groc_eggs_02: ['egg', 'eggs', 'dozen eggs', 'brown eggs'],
    groc_yogurt_03: ['yogurt', 'yoghurt', 'greek yogurt', 'curd', 'dahi'],
    groc_butter_04: ['butter', 'unsalted butter', 'makkhan'],
    groc_cheese_05: ['cheese', 'cheddar', 'cheddar cheese', 'cheese block'],
    groc_oatmilk_06: ['oat milk', 'oatmilk', 'plant milk'],
    groc_paneer_32: ['paneer', 'cottage cheese'],
    groc_tomatoes_07: ['tomato', 'tomatoes', 'roma tomatoes', 'tamatar'],
    groc_avocados_08: ['avocado', 'avocados', 'hass avocado', 'guac'],
    groc_spinach_09: ['spinach', 'baby spinach', 'palak', 'greens'],
    groc_bananas_10: ['banana', 'bananas', 'kela'],
    groc_apples_11: ['apple', 'apples', 'honeycrisp', 'seb'],
    groc_garlic_12: ['garlic', 'garlic bulbs', 'lahsun'],
    groc_onions_13: ['onion', 'onions', 'yellow onions', 'pyaz'],
    groc_potatoes_29: ['potato', 'potatoes', 'russet potato', 'aloo'],
    groc_lemons_14: ['lemon', 'lemons', 'lime', 'nimbu'],
    groc_peppers_31: ['bell pepper', 'bell peppers', 'capsicum', 'pepper', 'peppers'],
    groc_sourdough_15: ['sourdough', 'sourdough bread', 'artisan bread'],
    groc_wheatbread_16: ['bread', 'wheat bread', 'sliced bread', 'brown bread', 'loaf'],
    groc_bagels_17: ['bagel', 'bagels'],
    groc_oliveoil_18: ['olive oil', 'oil', 'evoo', 'cooking oil'],
    groc_pasta_19: ['pasta', 'penne', 'spaghetti', 'noodles'],
    groc_sauce_20: ['pasta sauce', 'marinara', 'marinara sauce', 'tomato sauce'],
    groc_rice_21: ['rice', 'jasmine rice', 'basmati rice', 'chawal'],
    groc_oats_22: ['oats', 'rolled oats', 'oatmeal'],
    groc_honey_23: ['honey', 'wildflower honey', 'shahad'],
    groc_chicken_24: ['chicken', 'chicken breast', 'poultry'],
    groc_salmon_25: ['salmon', 'fish', 'salmon fillet'],
    groc_tofu_26: ['tofu', 'soy tofu'],
    groc_coffee_27: ['coffee', 'coffee beans', 'espresso'],
    groc_orangejuice_28: ['orange juice', 'oj', 'juice'],
    groc_tea_33: ['tea', 'green tea', 'chai'],
    groc_cookies_34: ['cookie', 'cookies', 'biscuit', 'biscuits'],
    groc_chips_35: ['chips', 'potato chips', 'crisps'],
  };

  // Extract explicit quantities like "2 packs of eggs", "3 avocados", "a loaf of bread", "two milks"
  for (const catalogItem of GROCERY_CATALOG) {
    const keywords = itemKeywords[catalogItem.id] || [catalogItem.name.toLowerCase()];

    for (const kw of keywords) {
      // Regex detects:
      // (1) digits: "2 eggs", "3 avocados", "2 packs of butter", "1 gallon milk"
      // (2) word numbers: "two eggs", "three bananas", "a loaf of bread", "a box of cookies"
      const quantityPattern = `(?:(?:(\\d+)|\\b(one|two|three|four|five|six|seven|eight|nine|ten|a dozen|half dozen|a couple of|a|an)\\b)\\s*(?:pack|packs|carton|cartons|loaf|loaves|lb|lbs|kg|bottle|bottles|box|boxes|bunch|bunches|gallon|gallons|bag|bags)?\\s*(?:of)?\\s*)?\\b${kw}\\b`;
      const regex = new RegExp(quantityPattern, 'i');
      const match = lower.match(regex);

      if (match && !matchedIds.has(catalogItem.id)) {
        let qty = 1;
        if (match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 24) qty = parsed;
        } else if (match[2]) {
          const word = match[2].toLowerCase();
          if (NUMBER_WORD_MAP[word]) qty = NUMBER_WORD_MAP[word];
        }

        matchedIds.add(catalogItem.id);
        matchedItems.push({
          ...catalogItem,
          quantity: qty,
          checked: true,
        });
        break;
      }
    }
  }

  // If nothing from catalog matched, synthesize custom grocery items based on what user asked for!
  if (matchedItems.length === 0) {
    const segments = clean
      .replace(/i need (to buy|some)?/gi, '')
      .replace(/can i get/gi, '')
      .replace(/buy/gi, '')
      .replace(/order/gi, '')
      .replace(/please/gi, '')
      .replace(/groceries( like|:)?/gi, '')
      .split(/,| and |&|\+/i)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);

    segments.forEach((seg, idx) => {
      let qty = 1;
      let itemName = seg;
      const numMatch = seg.match(/^(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s+(?:pack|packs|carton|cartons|bag|bags|box|boxes|bottle|bottles|of)?\s*(.+)$/i);
      if (numMatch) {
        const rawNum = numMatch[1].toLowerCase();
        if (/^\d+$/.test(rawNum)) qty = parseInt(rawNum, 10);
        else if (NUMBER_WORD_MAP[rawNum]) qty = NUMBER_WORD_MAP[rawNum];
        itemName = numMatch[2].trim();
      }

      if (itemName.length > 1) {
        matchedItems.push({
          id: `groc_custom_${idx}_${Date.now()}`,
          name: itemName.charAt(0).toUpperCase() + itemName.slice(1),
          category: 'pantry',
          price: 3.5,
          unit: '1 Standard Pack',
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
          quantity: qty,
          checked: true,
          inStock: true,
          brand: 'Daily Drop Market',
        });
      }
    });
  }

  const subtotal = Math.round(matchedItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  return {
    id: `groc_list_${Date.now()}`,
    title: `Voice Grocery Order (${matchedItems.length} items)`,
    transcript: clean,
    items: matchedItems,
    subtotal,
    estimatedDelivery: 'Today within 45 mins',
  };
}
