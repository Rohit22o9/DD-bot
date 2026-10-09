import openpyxl, json, re

wb = openpyxl.load_workbook('DD meal list.xlsx')
sheet = wb['Sheet1']
rows = list(sheet.iter_rows(values_only=True))

IMAGE_MAP = [
    # Drinks & Desserts
    (r'mango lassi', 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80'),
    (r'lassi', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80'),
    (r'ras malai|gulab jamun', 'https://images.unsplash.com/photo-1605197154261-789a26372071?auto=format&fit=crop&w=500&q=80'),

    # Indian Biryani & Rice
    (r'chicken biryani', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80'),
    (r'mutton biryani|goat curry', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80'),
    (r'paneer biryani|veg biryani|paneer curry', 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=500&q=80'),
    (r'bhindi', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80'),
    (r'baingan', 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=500&q=80'),
    (r'rajma', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=500&q=80'),
    (r'cholle|chana', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80'),
    (r'dal makhani|palak dal|dal tadka|dal chawal', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'),
    (r'dum aloo|aloo gobi', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80'),
    (r'butter chicken', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=80'),
    (r'chicken korma|chicken tikka masala|chicken curry|chicken tikka|chicken roll', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80'),
    (r'egg curry|egg bhurji', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=80'),
    (r'thali', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=500&q=80'),
    (r'pakoda|pakora|samosa|tikki|spring roll', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80'),
    (r'kadi pakoda', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80'),
    (r'chapati|roti', 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80'),
    (r'raita', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80'),

    # Japanese Ramen & Teriyaki
    (r'ramen', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80'),
    (r'teriyaki', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'),

    # Korean Dishes
    (r'bibimbap', 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=500&q=80'),
    (r'bulgogi|marinated beef|beef rib', 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=500&q=80'),
    (r'jajangmyeon|jjajang', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=500&q=80'),
    (r'jjambbong', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80'),
    (r'stew|soup|backbone|silky tofu|kongguksu', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80'),
    (r'sweet & sour pork|sweet and sour', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'),
    (r'korean.*chicken|garlic chicken|chilli chicken|mala.*chicken', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=500&q=80'),
    (r'rice cake', 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=500&q=80'),
    (r'dumpling', 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=500&q=80'),
    (r'pancake', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'),
    (r'japchae|noodles', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=500&q=80'),
    (r'spicy pork|spicy squid|extra meat', 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=500&q=80'),
    (r'cheese|mozzarella', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80'),
    (r'tofu', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'),

    # Chinese
    (r'mapo tofu', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'),
    (r'stir fry|pine nuts|vegetables', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80'),
    (r'fried rice|chicken rice', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=500&q=80'),
    (r'sweet corn soup|egg soup', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80'),
    (r'tomato egg', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'),
    (r'nasi lemak', 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=500&q=80'),

    # Italian Pastas
    (r'rigatoni|spaghetti|fusilli|carbonara|bolognese|amatriciana|pesto|maniche|casarecce', 'https://images.unsplash.com/photo-1621996346565-e3d5d6281682?auto=format&fit=crop&w=500&q=80'),

    # Sides & Misc
    (r'salad', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80'),
    (r'chips', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80'),
    (r'rice', 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=500&q=80'),
]

def get_image(dish_name):
    for pat, url in IMAGE_MAP:
        if re.search(pat, dish_name, re.I):
            return url
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'

def clean_id(name, idx):
    slug = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
    return f'meal_dd_{idx:03d}_{slug[:24]}'

meals = []
for idx, r in enumerate(rows[1:], start=1):
    dish_raw, cui_raw, cat_raw, diet_raw, price_raw, macros_raw, ings_raw = r
    dish_name = str(dish_raw).strip()
    cui = str(cui_raw).strip()
    cat = str(cat_raw).strip().lower()

    if cat in ['soup', 'snack']:
        category = 'side'
    elif cat in ['main', 'side', 'drink', 'dessert']:
        category = cat
    else:
        category = 'main'

    match = re.search(r'(\d+(?:\.\d+)?)', str(price_raw))
    price = float(match.group(1)) if match else 12.0

    cals = re.search(r'calories:\s*(\d+)', str(macros_raw), re.I)
    prot = re.search(r'protein:\s*(\d+)g?', str(macros_raw), re.I)
    carbs = re.search(r'carbs:\s*(\d+)g?', str(macros_raw), re.I)
    fat = re.search(r'fat:\s*(\d+)g?', str(macros_raw), re.I)

    cal_val = int(cals.group(1)) if cals else 480
    prot_val = int(prot.group(1)) if prot else 24
    carb_val = int(carbs.group(1)) if carbs else 50
    fat_val = int(fat.group(1)) if fat else 14

    try:
        diet_list = json.loads(diet_raw) if isinstance(diet_raw, str) else list(diet_raw)
    except:
        diet_list = [str(diet_raw)]

    try:
        ings_list = json.loads(ings_raw) if isinstance(ings_raw, str) else list(ings_raw)
    except:
        ings_list = [str(ings_raw)]

    tags = []
    is_veg = any('veg' in str(d).lower() and 'non' not in str(d).lower() for d in diet_list)
    is_vegan = any('vegan' in str(d).lower() for d in diet_list)

    if is_vegan:
        tags.extend(['Vegan', 'Vegetarian', 'Dairy-Free'])
    elif is_veg:
        tags.append('Vegetarian')
    else:
        tags.append('Non-Vegetarian')
        dn_lower = dish_name.lower()
        if 'chicken' in dn_lower:
            tags.append('Chicken')
        elif 'mutton' in dn_lower or 'goat' in dn_lower or 'lamb' in dn_lower:
            tags.append('Lamb/Beef')
        elif 'beef' in dn_lower:
            tags.append('Beef')
        elif 'pork' in dn_lower:
            tags.append('Pork')
        elif 'seafood' in dn_lower or 'squid' in dn_lower or 'fish' in dn_lower:
            tags.append('Seafood')
        elif 'egg' in dn_lower:
            tags.append('Eggs')

    if any('spicy' in str(d).lower() for d in diet_list) or 'spicy' in dish_name.lower():
        tags.append('Spicy')
    if prot_val >= 30:
        tags.append('High-Protein')
    if cal_val <= 500:
        tags.append('Under 500 Cal')
    if price <= 15:
        tags.append('Budget-Friendly')

    seen = set()
    final_tags = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            final_tags.append(t)

    if 'bawarchi' in dish_name.lower():
        rest_id = 'rest_bawarchi'
        rest_name = 'Bawarchi Biryani'
    elif 'gulati' in dish_name.lower():
        rest_id = 'rest_gulati'
        rest_name = "Gulati's Kitchen"
    elif 'korean' in cui.lower():
        rest_id = 'rest_seoul'
        rest_name = 'Seoul Pocha & Kitchen'
    elif 'japanese' in cui.lower():
        rest_id = 'rest_tokyo'
        rest_name = 'Tokyo Bento & Ramen'
    elif 'chinese' in cui.lower() or 'indo-chinese' in cui.lower():
        rest_id = 'rest_dragon'
        rest_name = 'Dragon Wok Box'
    elif 'italian' in cui.lower():
        rest_id = 'rest_roma'
        rest_name = 'Roma Pasta Cucina'
    elif 'malaysian' in cui.lower():
        rest_id = 'rest_kopitiam'
        rest_name = 'Kopitiam Nanyang Flavours'
    elif 'western' in cui.lower():
        rest_id = 'rest_continental'
        rest_name = 'Continental Roastery'
    else:
        rest_id = 'rest_spice_route'
        rest_name = 'Spice Route Indian Kitchen'

    desc = f'Freshly prepared {dish_name} featuring {ings_list[0] if ings_list else "curated ingredients"}'
    if len(ings_list) > 1:
        desc += f', {ings_list[1]}'
    if len(ings_list) > 2:
        desc += f', and {ings_list[2]}'
    desc += f'. Authentic {cui} recipe prepped daily.'

    badges = []
    if prot_val >= 30:
        badges.append(f'💪 {prot_val}g Protein')
    if 'Spicy' in final_tags:
        badges.append('🌶️ Spicy')
    elif is_veg:
        badges.append('🌱 Vegetarian')
    elif is_vegan:
        badges.append('🌿 Vegan')
    if price <= 15:
        badges.append('💰 Under $15')

    meals.append({
        'id': clean_id(dish_name, idx),
        'name': dish_name,
        'description': desc,
        'restaurantId': rest_id,
        'restaurantName': rest_name,
        'price': price,
        'imageUrl': get_image(dish_name),
        'cuisine': cui,
        'category': category,
        'dietaryTags': final_tags,
        'ingredients': ings_list,
        'spicyLevel': 2 if 'Spicy' in final_tags else (1 if 'Chili' in str(ings_list) or 'Spices' in str(ings_list) else 0),
        'availableDays': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'availableSlots': ['lunch', 'dinner'],
        'active': True,
        'calories': cal_val,
        'proteinGrams': prot_val,
        'nutrition': {
            'calories': cal_val,
            'proteinGrams': prot_val,
            'fibreGrams': 4,
            'sodiumMg': 580,
            'saturatedFatGrams': round(fat_val * 0.3, 1),
            'carbsGrams': carb_val,
            'sugarGrams': 3
        },
        'healthFlags': {
            'highProtein': prot_val >= 30,
            'vegetarian': is_veg,
            'vegan': is_vegan,
            'lowCarb': carb_val <= 30,
            'lowSodium': True,
            'weightManagement': cal_val <= 500,
            'glutenFree': False,
            'dairyFree': is_vegan or ('Dairy-Free' in final_tags)
        },
        'displayBadges': badges[:2] if badges else ['⭐ Fresh Daily']
    })

print(f'Done! Successfully built {len(meals)} meals.')
with open('parsed_dd_meals.json', 'w', encoding='utf-8') as f:
    json.dump(meals, f, indent=2, ensure_ascii=False)
print('Saved parsed_dd_meals.json successfully!')
