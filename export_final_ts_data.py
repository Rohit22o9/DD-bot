import json, re

with open('parsed_dd_meals.json', 'r', encoding='utf-8') as f:
    dd_meals = json.load(f)

print(f"Loaded {len(dd_meals)} real Daily Drop meals.")

# New partner restaurants
NEW_RESTAURANTS = [
    {
        'id': 'rest_bawarchi',
        'name': 'Bawarchi Biryani Point',
        'cuisine': 'North Indian',
        'rating': 4.9,
        'deliveryTimeMinutes': 25,
        'deliveryFee': 2.50,
        'minimumOrder': 10,
        'active': True,
        'address': 'Bentley Commercial Centre',
    },
    {
        'id': 'rest_gulati',
        'name': "Gulati's Kitchen",
        'cuisine': 'North Indian',
        'rating': 4.8,
        'deliveryTimeMinutes': 25,
        'deliveryFee': 2.50,
        'minimumOrder': 10,
        'active': True,
        'address': 'Cannington Plaza Shop 4',
    },
    {
        'id': 'rest_seoul',
        'name': 'Seoul Pocha & Kitchen',
        'cuisine': 'Korean',
        'rating': 4.9,
        'deliveryTimeMinutes': 20,
        'deliveryFee': 2.50,
        'minimumOrder': 10,
        'active': True,
        'address': 'Karawara Shopping Centre',
    },
    {
        'id': 'rest_spice_route',
        'name': 'Spice Route Indian Kitchen',
        'cuisine': 'North Indian',
        'rating': 4.8,
        'deliveryTimeMinutes': 25,
        'deliveryFee': 2.50,
        'minimumOrder': 10,
        'active': True,
        'address': 'Curtin Central Commercial Hub',
    },
    {
        'id': 'rest_continental',
        'name': 'Continental Roastery',
        'cuisine': 'Western/Continental',
        'rating': 4.7,
        'deliveryTimeMinutes': 25,
        'deliveryFee': 2.50,
        'minimumOrder': 10,
        'active': True,
        'address': 'Victoria Park Broadway 102',
    },
]

# Read backend mockData.ts
with open('backend/src/integrations/dailydrop/mockData.ts', 'r', encoding='utf-8') as f:
    backend_ts = f.read()

# Read mobile mockData.ts
with open('mobile/src/mockData.ts', 'r', encoding='utf-8') as f:
    mobile_ts = f.read()

print("Read current mockData files successfully.")
