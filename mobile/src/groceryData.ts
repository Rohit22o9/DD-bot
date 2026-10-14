import { GroceryItem, GroceryOrderList, Meal } from './types';

/**
 * 🛒 AUTHENTIC GROCERIES CATALOG
 * Directly sourced from `Groceries list.xlsx` (400 items across 12 authentic categories).
 * Every single item strictly originates from this official verified list.
 */
export const GROCERY_CATEGORIES: string[] = [
  "Rice & Grains",
  "Atta & Flours",
  "Dals & Pulses",
  "Spices & Masalas",
  "Cooking Oils & Ghee",
  "Fresh Vegetables",
  "Dairy & Refrigerated",
  "Snacks & Biscuits",
  "Tea, Coffee & Beverages",
  "Dry Fruits & Nuts",
  "Household Essentials",
  "Ready-to-Eat & Instant Foods"
];

export const GROCERY_CATALOG: GroceryItem[] = [
  {
    "id": "GRC001",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "India Gate",
    "price": 5.99,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC002",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "India Gate",
    "price": 16.99,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC003",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 4.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC004",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 5.99,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC005",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "MTR",
    "price": 3.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC006",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 22.99,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC007",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Rajdhani",
    "price": 3.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC008",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 3.49,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC009",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Organic Tattva",
    "price": 4.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC010",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Pillsbury",
    "price": 15.99,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC011",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 6.99,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC012",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 5.99,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC013",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 3.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC014",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 4.49,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC015",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 4.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC016",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 2.49,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC017",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 5.49,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC018",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 8.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC019",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 3.49,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC020",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 5.49,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC021",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gemini",
    "price": 22.99,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC022",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Fortune",
    "price": 3.99,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC023",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Gowardhan",
    "price": 9.99,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC024",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dhara",
    "price": 13.99,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC025",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Fresh Produce",
    "price": 2.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC026",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 3.49,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC027",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 10.99,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC028",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Fresh Produce",
    "price": 1.99,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC029",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 5.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC030",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Dairy Farmers",
    "price": 7.49,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC031",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 5.49,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC032",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 6.49,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC033",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Lurpak",
    "price": 12.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC034",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Haldiram's",
    "price": 3.99,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC035",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Smith's",
    "price": 4.49,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC036",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Sunfeast",
    "price": 5.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC037",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Britannia",
    "price": 2.49,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC038",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Bikaji",
    "price": 5.49,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC039",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Red Label",
    "price": 14.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC040",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Nescaf\u00e9",
    "price": 5.99,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC041",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Frooti",
    "price": 3.49,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC042",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Tata Sampann",
    "price": 15.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC043",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 4.49,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC044",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 4.49,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC045",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 4.99,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC046",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "Surf Excel",
    "price": 5.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC047",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Lux",
    "price": 6.99,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC048",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Sensodyne",
    "price": 6.99,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC049",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Maggi",
    "price": 2.99,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC050",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "MTR",
    "price": 8.99,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC051",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Lal Qilla",
    "price": 6.47,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC052",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "India Gate",
    "price": 18.35,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC053",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 8.09,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC054",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Tilda",
    "price": 4.31,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC055",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "MTR",
    "price": 6.47,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC056",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 24.83,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC057",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 5.93,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC058",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 2.69,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC059",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Organic Tattva",
    "price": 9.17,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC060",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Nature Fresh",
    "price": 5.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC061",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 7.55,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC062",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 4.31,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC063",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Daawat",
    "price": 5.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC064",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 3.23,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC065",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 8.09,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC066",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 2.69,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC067",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 5.93,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC068",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 9.17,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC069",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 6.47,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC070",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 5.93,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC071",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gemini",
    "price": 24.83,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC072",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dalda",
    "price": 4.31,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC073",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Gowardhan",
    "price": 10.79,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC074",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dhara",
    "price": 8.09,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC075",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 2.69,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC076",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 3.77,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC077",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 11.87,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC078",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 2.15,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC079",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 5.93,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC080",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Dairy Farmers",
    "price": 4.31,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC081",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Haldiram's",
    "price": 5.93,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC082",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 3.77,
    "unit": "400 g",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC083",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Lurpak",
    "price": 14.03,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC084",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Balaji",
    "price": 4.31,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC085",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Smith's",
    "price": 4.85,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC086",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Sunfeast",
    "price": 6.47,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC087",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Unibic",
    "price": 2.69,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC088",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Bikaji",
    "price": 5.93,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC089",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Red Label",
    "price": 16.19,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC090",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Davidoff",
    "price": 6.47,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC091",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Frooti",
    "price": 3.77,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC092",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Tata Sampann",
    "price": 17.27,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC093",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Nutraj",
    "price": 4.85,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC094",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 4.85,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC095",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 9.17,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC096",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "Persil",
    "price": 5.93,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC097",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Lux",
    "price": 7.55,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC098",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Sensodyne",
    "price": 7.55,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC099",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Knorr",
    "price": 3.23,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC100",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "MTR",
    "price": 5.39,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC101",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Lal Qilla",
    "price": 5.69,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC102",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 16.14,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC103",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 4.27,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC104",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Tilda",
    "price": 5.69,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC105",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 3.32,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC106",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 21.84,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC107",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 3.32,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC108",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Generic",
    "price": 3.32,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC109",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Organic Tattva",
    "price": 4.74,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC110",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Nature Fresh",
    "price": 15.19,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC111",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 6.64,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC112",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 5.69,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC113",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Daawat",
    "price": 3.32,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC114",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Generic",
    "price": 4.27,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC115",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 4.27,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC116",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 2.37,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC117",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Eastern",
    "price": 5.22,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC118",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 8.07,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC119",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 3.32,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC120",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "Generic",
    "price": 5.22,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC121",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gemini",
    "price": 21.84,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC122",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dalda",
    "price": 3.79,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC123",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Verka",
    "price": 9.49,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC124",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dhara",
    "price": 13.29,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC125",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 2.37,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC126",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 3.32,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC127",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 10.44,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC128",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 1.89,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC129",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 5.22,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC130",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Dairy Farmers",
    "price": 7.12,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC131",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Haldiram's",
    "price": 5.22,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC132",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Generic",
    "price": 6.17,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC133",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Lurpak",
    "price": 12.34,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC134",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Balaji",
    "price": 3.79,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC135",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Pringles",
    "price": 4.27,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC136",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Sunfeast",
    "price": 5.69,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC137",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Unibic",
    "price": 2.37,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC138",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Generic",
    "price": 5.22,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC139",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Red Label",
    "price": 14.24,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC140",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Davidoff",
    "price": 5.69,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC141",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Real",
    "price": 3.32,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC142",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Tata Sampann",
    "price": 15.19,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC143",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Nutraj",
    "price": 4.27,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC144",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Generic",
    "price": 4.27,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC145",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 4.74,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC146",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "Persil",
    "price": 5.22,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC147",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 6.64,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC148",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Sensodyne",
    "price": 6.64,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC149",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Knorr",
    "price": 2.84,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC150",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Generic",
    "price": 8.54,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC151",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Lal Qilla",
    "price": 6.71,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC152",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 19.03,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC153",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "Organic Tattva",
    "price": 8.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC154",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Tilda",
    "price": 4.47,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC155",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 6.71,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC156",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 25.75,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC157",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Fortune",
    "price": 6.15,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC158",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Generic",
    "price": 2.79,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC159",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 9.51,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC160",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Nature Fresh",
    "price": 5.59,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC161",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 7.83,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC162",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 4.47,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC163",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Daawat",
    "price": 5.59,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC164",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Generic",
    "price": 3.35,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC165",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 8.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC166",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 2.79,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC167",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Eastern",
    "price": 6.15,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC168",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 9.51,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC169",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 6.71,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC170",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "Generic",
    "price": 6.15,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC171",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Fortune",
    "price": 25.75,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC172",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Dalda",
    "price": 4.47,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC173",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Verka",
    "price": 11.19,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC174",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gulab",
    "price": 8.39,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC175",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 2.79,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC176",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 3.91,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC177",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Fresh Produce",
    "price": 12.31,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC178",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 2.23,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC179",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 6.15,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC180",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 4.47,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC181",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Haldiram's",
    "price": 6.15,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC182",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Generic",
    "price": 3.91,
    "unit": "400 g",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC183",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 14.55,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC184",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Balaji",
    "price": 4.47,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC185",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Pringles",
    "price": 5.03,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC186",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 6.71,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC187",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Unibic",
    "price": 2.79,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC188",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Generic",
    "price": 6.15,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC189",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Tata Tea Premium",
    "price": 16.79,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC190",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Davidoff",
    "price": 6.71,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC191",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Real",
    "price": 3.91,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC192",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 17.91,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC193",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Nutraj",
    "price": 5.03,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC194",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Generic",
    "price": 5.03,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC195",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Vim",
    "price": 9.51,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC196",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "Persil",
    "price": 6.15,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC197",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 7.83,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC198",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Colgate",
    "price": 7.83,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC199",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Knorr",
    "price": 3.35,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC200",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Generic",
    "price": 5.59,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC201",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 5.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC202",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 15.29,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC203",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "Organic Tattva",
    "price": 4.04,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC204",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 5.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC205",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 3.14,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC206",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 20.69,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC207",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 3.14,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC208",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Generic",
    "price": 3.14,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC209",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 4.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC210",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 14.39,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC211",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "Rajdhani",
    "price": 6.29,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC212",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 5.39,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC213",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 3.14,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC214",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Generic",
    "price": 4.04,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC215",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 4.04,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC216",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 2.24,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC217",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Eastern",
    "price": 4.94,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC218",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 7.64,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC219",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 3.14,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC220",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "Generic",
    "price": 4.94,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC221",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Fortune",
    "price": 20.69,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC222",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Engine",
    "price": 3.59,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC223",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Verka",
    "price": 8.99,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC224",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gulab",
    "price": 12.59,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC225",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 2.24,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC226",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 3.14,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC227",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Fresh Produce",
    "price": 9.89,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC228",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 1.79,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC229",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 4.94,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC230",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 6.74,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC231",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 4.94,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC232",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Generic",
    "price": 5.84,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC233",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 11.69,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC234",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Bikaji",
    "price": 3.59,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC235",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Pringles",
    "price": 4.04,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC236",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 5.39,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC237",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 2.24,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC238",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Generic",
    "price": 4.94,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC239",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Tata Tea Premium",
    "price": 13.49,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC240",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Bru",
    "price": 5.39,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC241",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Real",
    "price": 3.14,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC242",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 14.39,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC243",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 4.04,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC244",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Generic",
    "price": 4.04,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC245",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Vim",
    "price": 4.49,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC246",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "OMO",
    "price": 4.94,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC247",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Palmolive",
    "price": 6.29,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC248",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Colgate",
    "price": 6.29,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC249",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Indomie",
    "price": 2.69,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC250",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Generic",
    "price": 8.09,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC251",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 6.29,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC252",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 17.84,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC253",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "Organic Tattva",
    "price": 7.86,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC254",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 4.19,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC255",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Bambino",
    "price": 6.29,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC256",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 24.14,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC257",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 5.76,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC258",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Pillsbury",
    "price": 2.61,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC259",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 8.91,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC260",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 5.24,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC261",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 7.34,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC262",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 4.19,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC263",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 5.24,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC264",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 3.14,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC265",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 7.86,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC266",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 2.61,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC267",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 5.76,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC268",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 8.91,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC269",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 6.29,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC270",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 5.76,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC271",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Fortune",
    "price": 24.14,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC272",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Engine",
    "price": 4.19,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC273",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Patanjali",
    "price": 10.49,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC274",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Gulab",
    "price": 7.86,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC275",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 2.61,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC276",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 3.66,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC277",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Fresh Produce",
    "price": 11.54,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC278",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 2.09,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC279",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 5.76,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC280",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 4.19,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC281",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 5.76,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC282",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 3.66,
    "unit": "400 g",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC283",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Amul",
    "price": 13.64,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC284",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Bikaji",
    "price": 4.19,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC285",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Kettle",
    "price": 4.71,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC286",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 6.29,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC287",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 2.61,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC288",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Bikano",
    "price": 5.76,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC289",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Tata Tea Premium",
    "price": 15.74,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC290",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Bru",
    "price": 6.29,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC291",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Slice",
    "price": 3.66,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC292",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Happilo",
    "price": 16.79,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC293",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 4.71,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC294",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 4.71,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC295",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Vim",
    "price": 8.91,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC296",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "OMO",
    "price": 5.76,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC297",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Dettol",
    "price": 7.34,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC298",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Colgate",
    "price": 7.34,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC299",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Indomie",
    "price": 3.14,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC300",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Aachi",
    "price": 5.24,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC301",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 6.89,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC302",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 19.54,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC303",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "MTR",
    "price": 5.16,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC304",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Daawat",
    "price": 6.89,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC305",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Bambino",
    "price": 4.01,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC306",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Annapurna",
    "price": 26.44,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC307",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Tata Sampann",
    "price": 4.01,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC308",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Pillsbury",
    "price": 4.01,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC309",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Manna",
    "price": 5.74,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC310",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Aashirvaad",
    "price": 18.39,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC311",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 8.04,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC312",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 6.89,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC313",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Tata Sampann",
    "price": 4.01,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC314",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 5.16,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC315",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "TRS",
    "price": 5.16,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC316",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 2.86,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC317",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 6.31,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC318",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 9.76,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC319",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Everest",
    "price": 4.01,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC320",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 6.31,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC321",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Freedom",
    "price": 26.44,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC322",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Engine",
    "price": 4.59,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC323",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Patanjali",
    "price": 11.49,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC324",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Engine",
    "price": 16.09,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC325",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 2.86,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC326",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 4.01,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC327",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 12.64,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC328",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Market Fresh",
    "price": 2.29,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC329",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 6.31,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC330",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Devondale",
    "price": 8.61,
    "unit": "2 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC331",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 6.31,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC332",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 7.46,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC333",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Devondale",
    "price": 14.94,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC334",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Bikaji",
    "price": 4.59,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC335",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Kettle",
    "price": 5.16,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC336",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "McVitie's",
    "price": 6.89,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC337",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Parle",
    "price": 2.86,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC338",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Bikano",
    "price": 6.31,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC339",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Society Tea",
    "price": 17.24,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC340",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Bru",
    "price": 6.89,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC341",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Slice",
    "price": 4.01,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC342",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Nutraj",
    "price": 18.39,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC343",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 5.16,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC344",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 5.16,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC345",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Fairy",
    "price": 5.74,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC346",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "OMO",
    "price": 6.31,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC347",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Dettol",
    "price": 8.04,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC348",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Pepsodent",
    "price": 8.04,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC349",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Indomie",
    "price": 3.44,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC350",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Aachi",
    "price": 10.34,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC351",
    "name": "Basmati Rice",
    "category": "Rice & Grains",
    "brand": "Fortune",
    "price": 5.87,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC352",
    "name": "Sona Masoori Rice",
    "category": "Rice & Grains",
    "brand": "24 Mantra Organic",
    "price": 16.65,
    "unit": "5 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC353",
    "name": "Poha",
    "category": "Rice & Grains",
    "brand": "MTR",
    "price": 7.34,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC354",
    "name": "Brown Rice",
    "category": "Rice & Grains",
    "brand": "Generic",
    "price": 3.91,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC355",
    "name": "Rava (Semolina)",
    "category": "Rice & Grains",
    "brand": "Bambino",
    "price": 5.87,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC356",
    "name": "Whole Wheat Atta",
    "category": "Atta & Flours",
    "brand": "Annapurna",
    "price": 22.53,
    "unit": "10 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC357",
    "name": "Besan (Gram Flour)",
    "category": "Atta & Flours",
    "brand": "Generic",
    "price": 5.38,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC358",
    "name": "Maida",
    "category": "Atta & Flours",
    "brand": "Pillsbury",
    "price": 2.44,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC359",
    "name": "Ragi Flour",
    "category": "Atta & Flours",
    "brand": "Manna",
    "price": 8.32,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC360",
    "name": "Multigrain Atta",
    "category": "Atta & Flours",
    "brand": "Generic",
    "price": 4.89,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC361",
    "name": "Toor Dal",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 6.85,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC362",
    "name": "Moong Dal",
    "category": "Dals & Pulses",
    "brand": "24 Mantra Organic",
    "price": 3.91,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC363",
    "name": "Masoor Dal",
    "category": "Dals & Pulses",
    "brand": "Generic",
    "price": 4.89,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC364",
    "name": "Chana Dal",
    "category": "Dals & Pulses",
    "brand": "Fortune",
    "price": 2.93,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC365",
    "name": "Rajma",
    "category": "Dals & Pulses",
    "brand": "TRS",
    "price": 7.34,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC366",
    "name": "Turmeric Powder",
    "category": "Spices & Masalas",
    "brand": "Eastern",
    "price": 2.44,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC367",
    "name": "Red Chilli Powder",
    "category": "Spices & Masalas",
    "brand": "Catch",
    "price": 5.38,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC368",
    "name": "Coriander Powder",
    "category": "Spices & Masalas",
    "brand": "Badshah",
    "price": 8.32,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC369",
    "name": "Garam Masala",
    "category": "Spices & Masalas",
    "brand": "Eastern",
    "price": 5.87,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC370",
    "name": "Cumin Seeds (Jeera)",
    "category": "Spices & Masalas",
    "brand": "MDH",
    "price": 5.38,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC371",
    "name": "Sunflower Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Freedom",
    "price": 22.53,
    "unit": "5 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC372",
    "name": "Mustard Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Generic",
    "price": 3.91,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC373",
    "name": "Pure Cow Ghee",
    "category": "Cooking Oils & Ghee",
    "brand": "Patanjali",
    "price": 9.79,
    "unit": "500 ml",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC374",
    "name": "Groundnut Oil",
    "category": "Cooking Oils & Ghee",
    "brand": "Engine",
    "price": 7.34,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC375",
    "name": "Potato",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 2.44,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC376",
    "name": "Onion",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 3.42,
    "unit": "1 kg",
    "imageUrl": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC377",
    "name": "Tomato",
    "category": "Fresh Vegetables",
    "brand": "Local Produce",
    "price": 10.77,
    "unit": "2 kg",
    "imageUrl": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC378",
    "name": "Green Chilli",
    "category": "Fresh Vegetables",
    "brand": "Generic",
    "price": 1.95,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC379",
    "name": "Bhindi (Okra)",
    "category": "Fresh Vegetables",
    "brand": "Farm Select",
    "price": 5.38,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC380",
    "name": "Full Cream Milk",
    "category": "Dairy & Refrigerated",
    "brand": "Devondale",
    "price": 3.91,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC381",
    "name": "Fresh Paneer",
    "category": "Dairy & Refrigerated",
    "brand": "Generic",
    "price": 5.38,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC382",
    "name": "Curd (Dahi)",
    "category": "Dairy & Refrigerated",
    "brand": "Gowardhan",
    "price": 3.42,
    "unit": "400 g",
    "imageUrl": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC383",
    "name": "Butter",
    "category": "Dairy & Refrigerated",
    "brand": "Devondale",
    "price": 12.73,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC384",
    "name": "Aloo Bhujia",
    "category": "Snacks & Biscuits",
    "brand": "Generic",
    "price": 3.91,
    "unit": "150 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC385",
    "name": "Masala Potato Chips",
    "category": "Snacks & Biscuits",
    "brand": "Kettle",
    "price": 4.4,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC386",
    "name": "Parle-G Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "McVitie's",
    "price": 5.87,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC387",
    "name": "Good Day Biscuits",
    "category": "Snacks & Biscuits",
    "brand": "Generic",
    "price": 2.44,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC388",
    "name": "Chakli",
    "category": "Snacks & Biscuits",
    "brand": "Bikano",
    "price": 5.38,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC389",
    "name": "Assam Tea",
    "category": "Tea, Coffee & Beverages",
    "brand": "Society Tea",
    "price": 14.69,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC390",
    "name": "Instant Coffee",
    "category": "Tea, Coffee & Beverages",
    "brand": "Generic",
    "price": 5.87,
    "unit": "50 g",
    "imageUrl": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC391",
    "name": "Mango Drink",
    "category": "Tea, Coffee & Beverages",
    "brand": "Slice",
    "price": 3.42,
    "unit": "600 ml",
    "imageUrl": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC392",
    "name": "Almonds (Badam)",
    "category": "Dry Fruits & Nuts",
    "brand": "Nutraj",
    "price": 15.67,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC393",
    "name": "Cashews (Kaju)",
    "category": "Dry Fruits & Nuts",
    "brand": "Generic",
    "price": 4.4,
    "unit": "100 g",
    "imageUrl": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC394",
    "name": "Raisins (Kishmish)",
    "category": "Dry Fruits & Nuts",
    "brand": "Farmley",
    "price": 4.4,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC395",
    "name": "Dishwashing Liquid",
    "category": "Household Essentials",
    "brand": "Fairy",
    "price": 8.32,
    "unit": "1 L",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC396",
    "name": "Laundry Detergent",
    "category": "Household Essentials",
    "brand": "Generic",
    "price": 5.38,
    "unit": "500 g",
    "imageUrl": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC397",
    "name": "Bathing Soap",
    "category": "Household Essentials",
    "brand": "Dettol",
    "price": 6.85,
    "unit": "3-pack",
    "imageUrl": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC398",
    "name": "Toothpaste",
    "category": "Household Essentials",
    "brand": "Pepsodent",
    "price": 6.85,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC399",
    "name": "Instant Noodles",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Fantastic",
    "price": 2.93,
    "unit": "Pack of 2",
    "imageUrl": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  },
  {
    "id": "GRC400",
    "name": "Instant Idli Mix",
    "category": "Ready-to-Eat & Instant Foods",
    "brand": "Aachi",
    "price": 4.89,
    "unit": "200 g",
    "imageUrl": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
    "quantity": 1,
    "checked": true,
    "inStock": true
  }
];

export const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "Almonds (Badam)": [
    "almonds",
    "almond",
    "badam",
    "dry fruits",
    "nuts"
  ],
  "Aloo Bhujia": [
    "aloo bhujia",
    "bhujia",
    "sev",
    "bikaneri bhujia",
    "namkeen"
  ],
  "Assam Tea": [
    "assam tea",
    "tea",
    "chai",
    "tea leaves",
    "black tea"
  ],
  "Basmati Rice": [
    "basmati rice",
    "basmati",
    "rice",
    "long grain rice",
    "chawal"
  ],
  "Bathing Soap": [
    "bathing soap",
    "soap",
    "bath soap",
    "soap bar",
    "body soap"
  ],
  "Besan (Gram Flour)": [
    "besan",
    "gram flour",
    "chickpea flour"
  ],
  "Bhindi (Okra)": [
    "bhindi",
    "okra",
    "ladyfinger",
    "lady finger"
  ],
  "Brown Rice": [
    "brown rice",
    "brown chawal"
  ],
  "Butter": [
    "butter",
    "makhan",
    "makkhan",
    "table butter",
    "salted butter"
  ],
  "Cashews (Kaju)": [
    "cashews",
    "cashew",
    "kaju",
    "cashewnut"
  ],
  "Chakli": [
    "chakli",
    "murukku",
    "chakali"
  ],
  "Chana Dal": [
    "chana dal",
    "split chickpeas",
    "bengal gram dal",
    "chana"
  ],
  "Coriander Powder": [
    "coriander powder",
    "coriander",
    "dhaniya powder",
    "dhania"
  ],
  "Cumin Seeds (Jeera)": [
    "cumin seeds",
    "cumin",
    "jeera",
    "zeera"
  ],
  "Curd (Dahi)": [
    "curd",
    "dahi",
    "yogurt",
    "yoghurt"
  ],
  "Dishwashing Liquid": [
    "dishwashing liquid",
    "dish soap",
    "dish liquid",
    "dishwash"
  ],
  "Fresh Paneer": [
    "fresh paneer",
    "paneer",
    "cottage cheese",
    "malai paneer"
  ],
  "Full Cream Milk": [
    "full cream milk",
    "milk",
    "fresh milk",
    "whole milk",
    "doodh"
  ],
  "Garam Masala": [
    "garam masala",
    "masala powder",
    "all spice"
  ],
  "Good Day Biscuits": [
    "good day biscuits",
    "good day",
    "butter cookies",
    "biscuit"
  ],
  "Green Chilli": [
    "green chilli",
    "green chillies",
    "green chili",
    "hari mirch",
    "mirch",
    "chilli",
    "chili"
  ],
  "Groundnut Oil": [
    "groundnut oil",
    "peanut oil",
    "mungfali oil"
  ],
  "Instant Coffee": [
    "instant coffee",
    "coffee",
    "nescafe",
    "bru"
  ],
  "Instant Idli Mix": [
    "instant idli mix",
    "idli mix",
    "idli batter",
    "idli"
  ],
  "Instant Noodles": [
    "instant noodles",
    "noodles",
    "maggi",
    "ramen"
  ],
  "Laundry Detergent": [
    "laundry detergent",
    "detergent",
    "washing powder",
    "surf"
  ],
  "Maida": [
    "maida",
    "refined flour",
    "all purpose flour"
  ],
  "Mango Drink": [
    "mango drink",
    "mango juice",
    "frooti",
    "maaza"
  ],
  "Masala Potato Chips": [
    "masala potato chips",
    "potato chips",
    "chips",
    "crisps"
  ],
  "Masoor Dal": [
    "masoor dal",
    "red lentils",
    "orange dal",
    "masoor"
  ],
  "Moong Dal": [
    "moong dal",
    "yellow dal",
    "mung dal",
    "split moong"
  ],
  "Multigrain Atta": [
    "multigrain atta",
    "multigrain flour"
  ],
  "Mustard Oil": [
    "mustard oil",
    "sarson ka tel",
    "sarson oil",
    "sarson"
  ],
  "Onion": [
    "onion",
    "onions",
    "pyaz",
    "pyaaz"
  ],
  "Parle-G Biscuits": [
    "parle-g biscuits",
    "parle-g",
    "parle g",
    "glucose biscuits"
  ],
  "Poha": [
    "poha",
    "flattened rice",
    "beaten rice",
    "aval"
  ],
  "Potato": [
    "potato",
    "potatoes",
    "aloo",
    "alu"
  ],
  "Pure Cow Ghee": [
    "pure cow ghee",
    "cow ghee",
    "desi ghee",
    "ghee"
  ],
  "Ragi Flour": [
    "ragi flour",
    "ragi",
    "finger millet flour"
  ],
  "Raisins (Kishmish)": [
    "raisins",
    "raisin",
    "kishmish",
    "kismis"
  ],
  "Rajma": [
    "rajma",
    "kidney beans",
    "red kidney beans"
  ],
  "Rava (Semolina)": [
    "rava",
    "semolina",
    "sooji",
    "suji"
  ],
  "Red Chilli Powder": [
    "red chilli powder",
    "chilli powder",
    "lal mirch powder",
    "lal mirch"
  ],
  "Sona Masoori Rice": [
    "sona masoori rice",
    "sona masoori",
    "masoori rice"
  ],
  "Sunflower Oil": [
    "sunflower oil",
    "sunflower"
  ],
  "Tomato": [
    "tomato",
    "tomatoes",
    "tamatar"
  ],
  "Toor Dal": [
    "toor dal",
    "tuvar dal",
    "arhar dal",
    "pigeon peas",
    "tur dal"
  ],
  "Toothpaste": [
    "toothpaste",
    "colgate",
    "pepsodent",
    "dant kanti"
  ],
  "Turmeric Powder": [
    "turmeric powder",
    "turmeric",
    "haldi powder",
    "haldi"
  ],
  "Whole Wheat Atta": [
    "whole wheat atta",
    "wheat atta",
    "atta",
    "chakki atta",
    "wheat flour",
    "gehu atta"
  ]
};

export const NUMBER_WORD_MAP: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  a: 1,
  an: 1,
  single: 1,
  double: 2,
  couple: 2,
  'a couple of': 2,
  dozen: 12,
  'a dozen': 12,
  'half dozen': 6,
};

/**
 * Filter groceries strictly from the actual list by category.
 */
export function getGroceriesByCategory(category: string): GroceryItem[] {
  const catLower = category.toLowerCase().trim();
  return GROCERY_CATALOG.filter(
    (item) =>
      item.category.toLowerCase() === catLower ||
      item.category.toLowerCase().includes(catLower)
  );
}

/**
 * Search actual groceries by query string (matching name, brand, category, or keywords).
 */
export function searchGroceries(query: string): GroceryItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return GROCERY_CATALOG.slice(0, 20);

  return GROCERY_CATALOG.filter((item) => {
    if (item.name.toLowerCase().includes(q)) return true;
    if (item.brand && item.brand.toLowerCase().includes(q)) return true;
    if (item.category.toLowerCase().includes(q)) return true;
    const kws = PRODUCT_KEYWORDS[item.name];
    if (kws && kws.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))) return true;
    return false;
  });
}

/**
 * Parses a voice or text transcript and matches items STRICTLY against the actual groceries list.
 * Never invents random or placeholder items.
 */
export function parseGroceryVoiceTranscript(transcript: string): GroceryOrderList {
  const clean = transcript.trim();
  const lower = clean.toLowerCase();

  // Curated weekly staples from our ACTUAL list (GRC001, GRC006, GRC011, GRC016, GRC025, GRC029, GRC030, GRC031)
  const isGeneric =
    lower === 'i need to buy some groceries' ||
    lower === 'i need groceries' ||
    lower === 'buy groceries' ||
    lower === 'grocery' ||
    lower === 'groceries' ||
    lower === 'order groceries' ||
    lower === 'show groceries' ||
    lower === 'help me buy groceries' ||
    lower === 'weekly essentials' ||
    lower === 'essential staples' ||
    lower === 'all groceries';

  if (isGeneric) {
    const starterIds = [
      'GRC001', // Basmati Rice (India Gate)
      'GRC006', // Whole Wheat Atta (Fortune)
      'GRC011', // Toor Dal (Fortune)
      'GRC016', // Pure Cow Ghee (Amul)
      'GRC025', // Full Cream Milk (Amul)
      'GRC029', // Onion (Fresh Produce)
      'GRC030', // Potato (Fresh Produce)
      'GRC031', // Tomato (Fresh Produce)
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

  // Category matching
  for (const cat of GROCERY_CATEGORIES) {
    const catWords = cat.toLowerCase().split(/[&, ]+/).filter((w) => w.length > 2);
    const matchesCat = catWords.some((w) => lower.includes(w));
    if (matchesCat && (lower.includes('show') || lower.includes('list') || lower.includes('buy') || lower.includes('order') || lower.includes('category') || lower.length < 35)) {
      const catItems = GROCERY_CATALOG.filter((i) => i.category === cat).slice(0, 8).map((i) => ({
        ...i,
        quantity: 1,
        checked: true,
      }));
      if (catItems.length > 0) {
        const subtotal = Math.round(catItems.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
        return {
          id: `groc_list_${Date.now()}`,
          title: `${cat} Selection`,
          transcript: clean,
          items: catItems,
          subtotal,
          estimatedDelivery: 'Today within 45 mins',
        };
      }
    }
  }

  const matchedItems: GroceryItem[] = [];
  const matchedIds = new Set<string>();

  // Match items based on product keywords and quantities from speech/text
  for (const [prodName, kws] of Object.entries(PRODUCT_KEYWORDS)) {
    for (const kw of kws) {
      const quantityPattern = `(?:(?:(\\d+)|\\b(one|two|three|four|five|six|seven|eight|nine|ten|a dozen|half dozen|a couple of|a|an)\\b)\\s*(?:pack|packs|packet|packets|carton|cartons|loaf|loaves|lb|lbs|kg|bottle|bottles|box|boxes|bunch|bunches|gallon|gallons|bag|bags|jar|jars)?\\s*(?:of)?\\s*)?\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`;
      const regex = new RegExp(quantityPattern, 'i');
      const match = lower.match(regex);

      if (match) {
        let qty = 1;
        if (match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= 24) qty = parsed;
        } else if (match[2]) {
          const word = match[2].toLowerCase();
          if (NUMBER_WORD_MAP[word]) qty = NUMBER_WORD_MAP[word];
        }

        // Find best SKU for this product in catalog (check brand match if mentioned)
        const candidates = GROCERY_CATALOG.filter((c) => c.name === prodName);
        if (candidates.length > 0) {
          let chosen = candidates.find((c) => c.brand && lower.includes(c.brand.toLowerCase())) || candidates[0];
          if (!matchedIds.has(chosen.id)) {
            matchedIds.add(chosen.id);
            matchedItems.push({
              ...chosen,
              quantity: qty,
              checked: true,
            });
          }
        }
        break;
      }
    }
  }

  // Fallback: If nothing matched by keywords, search actual catalog names & brands strictly
  if (matchedItems.length === 0) {
    const words = lower
      .replace(/[.,!?;:]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['i', 'need', 'buy', 'order', 'please', 'can', 'get', 'some', 'the', 'and', 'for', 'want'].includes(w));

    for (const w of words) {
      const found = GROCERY_CATALOG.find((c) => c.name.toLowerCase().includes(w) || (c.brand && c.brand.toLowerCase().includes(w)));
      if (found && !matchedIds.has(found.id)) {
        matchedIds.add(found.id);
        matchedItems.push({
          ...found,
          quantity: 1,
          checked: true,
        });
        if (matchedItems.length >= 6) break;
      }
    }
  }

  // Ultimate fallback: ALWAYS return actual items from the real list, NEVER random or synthetic placeholders!
  if (matchedItems.length === 0) {
    const defaultIds = ['GRC001', 'GRC006', 'GRC011', 'GRC016', 'GRC025', 'GRC029'];
    for (const id of defaultIds) {
      const item = GROCERY_CATALOG.find((c) => c.id === id);
      if (item) {
        matchedItems.push({ ...item, quantity: 1, checked: true });
      }
    }
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

/**
 * Transforms a GroceryItem into a Daily Drop Meal item so it seamlessly
 * enters the existing cart, order confirmation, and server cart APIs.
 */
export function groceryItemToMeal(item: GroceryItem): Meal {
  return {
    id: item.id,
    name: item.name,
    description: `Fresh grocery staple: ${item.brand || 'Daily Drop Market'} (${item.unit}). Premium quality from our actual verified catalog.`,
    restaurantId: 'rest_daily_drop_market',
    restaurantName: 'Daily Drop Fresh Market',
    price: item.price,
    imageUrl: item.imageUrl,
    cuisine: 'Grocery & Market',
    category: 'side',
    dietaryTags: ['Fresh Grocery', item.category.toUpperCase()],
    ingredients: [item.name, item.unit],
    spicyLevel: 0,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['lunch', 'dinner'],
    active: true,
    displayBadges: ['🛒 Grocery', `📦 ${item.unit}`, `🏷️ ${item.brand || 'Daily Drop'}`],
  };
}
