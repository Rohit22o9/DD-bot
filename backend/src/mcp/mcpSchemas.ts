/**
 * Model Context Protocol (MCP) Tool Schemas for Drop AI
 *
 * These schemas conform to the Anthropic / Model Context Protocol specification:
 * https://spec.modelcontextprotocol.io/specification/server/tools/
 */

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const MCP_TOOLS: MCPToolDefinition[] = [
  {
    name: 'search_meals',
    description: 'Search available meals by keyword, cuisine, budget cap, day of week, slot, or dietary preferences.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or protein name' },
        cuisine: { type: 'string', description: 'Cuisine (e.g. Thai, Japanese, Italian, Mexican)' },
        maxPrice: { type: 'number', description: 'Maximum price limit in USD' },
        slot: { type: 'string', enum: ['lunch', 'dinner'], description: 'Meal slot' },
        day: { type: 'string', description: 'Day of week (e.g. monday, friday)' },
        dietaryTags: { type: 'array', items: { type: 'string' }, description: 'e.g. vegetarian, gluten-free' },
      },
    },
  },
  {
    name: 'get_meal',
    description: 'Retrieve full details for a meal, including ingredients, allergens, price, and restaurant.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The unique meal identifier' },
      },
      required: ['id'],
    },
  },
  {
    name: 'check_availability',
    description: 'Verify if a meal is actively offered on a specified day and lunch/dinner slot.',
    inputSchema: {
      type: 'object',
      properties: {
        mealId: { type: 'string', description: 'The meal ID' },
        day: { type: 'string', description: 'Day of the week (e.g. monday)' },
        slot: { type: 'string', enum: ['lunch', 'dinner'], description: 'Target delivery slot' },
      },
      required: ['mealId', 'day', 'slot'],
    },
  },
  {
    name: 'get_user_preferences',
    description: 'Retrieve explicit user preferences including favorite cuisines, dislikes, and declared allergies.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
      },
      required: ['userId'],
    },
  },
  {
    name: 'get_order_history',
    description: 'Fetch previous completed orders for a user to identify frequent re-orders ("usuals").',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
        limit: { type: 'number', description: 'Maximum number of orders to return' },
      },
      required: ['userId'],
    },
  },
  {
    name: 'get_cart',
    description: 'Get current items and pricing breakdown from user draft shopping cart.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
      },
      required: ['userId'],
    },
  },
  {
    name: 'add_to_cart',
    description: 'Add a meal with quantity, slot, and delivery date to user cart.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
        mealId: { type: 'string', description: 'Meal ID to add' },
        quantity: { type: 'number', description: 'Number of servings' },
        slot: { type: 'string', enum: ['lunch', 'dinner'], description: 'Delivery slot' },
        date: { type: 'string', description: 'ISO date string (YYYY-MM-DD)' },
      },
      required: ['userId', 'mealId'],
    },
  },
  {
    name: 'update_cart',
    description: 'Update the quantity of an item in the shopping cart.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
        mealId: { type: 'string', description: 'Meal ID' },
        quantity: { type: 'number', description: 'New quantity (0 to remove)' },
      },
      required: ['userId', 'mealId', 'quantity'],
    },
  },
  {
    name: 'remove_from_cart',
    description: 'Remove a meal from the user cart.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
        mealId: { type: 'string', description: 'Meal ID to remove' },
      },
      required: ['userId', 'mealId'],
    },
  },
  {
    name: 'build_meal_plan',
    description: 'Generate or modify a 5-day Monday to Friday weekly meal plan adhering to a target budget.',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User identifier' },
        targetBudget: { type: 'number', description: 'Budget ceiling in USD (default $65)' },
        isVegetarianFriday: { type: 'boolean', description: 'Whether Friday must be vegetarian' },
        excludeKeywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to exclude (e.g. salads)' },
      },
      required: ['userId'],
    },
  },
];
