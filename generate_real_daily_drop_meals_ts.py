import json

with open('parsed_dd_meals.json', 'r', encoding='utf-8') as f:
    meals = json.load(f)

print(f"Loaded {len(meals)} meals.")

ts_content = """import { Meal } from './types';

/**
 * 136 Authentic Daily Drop Meals imported from 'DD meal list.xlsx'
 * Complete with authentic cuisines, prices, macros, ingredients, dietary tags,
 * and high-resolution photorealistic food photography URLs.
 */
export const REAL_DAILY_DROP_MEALS: Meal[] = """ + json.dumps(meals, indent=2, ensure_ascii=False) + ";\n"

# For backend, types is at '../../types'
backend_ts_content = ts_content.replace("import { Meal } from './types';", "import { Meal } from '../../types';")

# Write backend file
with open('backend/src/integrations/dailydrop/realDailyDropMeals.ts', 'w', encoding='utf-8') as f:
    f.write(backend_ts_content)
print("Wrote backend/src/integrations/dailydrop/realDailyDropMeals.ts")

# Write mobile file
with open('mobile/src/realDailyDropMeals.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
print("Wrote mobile/src/realDailyDropMeals.ts")
