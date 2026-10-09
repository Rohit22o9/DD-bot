import json

with open('parsed_dd_meals.json', 'r', encoding='utf-8') as f:
    meals = json.load(f)

for i, m in enumerate(meals[79:105], 80):
    print(f"{i:3d}. [{m['cuisine']}] {m['name']} -> {m['imageUrl']}")
