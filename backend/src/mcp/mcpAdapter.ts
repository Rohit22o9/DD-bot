import { MCP_TOOLS, MCPToolDefinition } from './mcpSchemas';
import { toolRegistry, ToolRegistry } from '../ai/tools/ToolRegistry';

export class MCPAdapter {
  private registry: ToolRegistry;

  constructor(registry: ToolRegistry = toolRegistry) {
    this.registry = registry;
  }

  /**
   * Returns list of all available MCP tools in standard protocol format.
   */
  public listTools(): MCPToolDefinition[] {
    return MCP_TOOLS;
  }

  /**
   * Handles incoming MCP tool call execution.
   */
  public async callTool(name: string, argumentsObj: Record<string, any>): Promise<any> {
    switch (name) {
      case 'search_meals':
        return this.registry.searchMeals(argumentsObj);
      case 'get_meal':
        return this.registry.getMeal(argumentsObj.id);
      case 'check_availability':
        return this.registry.checkAvailability(
          argumentsObj.mealId,
          argumentsObj.day,
          argumentsObj.slot
        );
      case 'get_user_preferences':
        return this.registry.getUserPreferences(argumentsObj.userId);
      case 'get_order_history':
        return this.registry.getOrderHistory(argumentsObj.userId, argumentsObj.limit);
      case 'get_cart':
        return this.registry.getCart(argumentsObj.userId);
      case 'add_to_cart':
        return this.registry.addToCart(
          argumentsObj.userId,
          argumentsObj.mealId,
          argumentsObj.quantity,
          argumentsObj.slot,
          argumentsObj.date
        );
      case 'update_cart':
        return this.registry.updateCart(
          argumentsObj.userId,
          argumentsObj.mealId,
          argumentsObj.quantity
        );
      case 'remove_from_cart':
        return this.registry.removeFromCart(argumentsObj.userId, argumentsObj.mealId);
      case 'build_meal_plan':
        return this.registry.buildMealPlan(argumentsObj.userId, {
          targetBudget: argumentsObj.targetBudget,
          isVegetarianFriday: argumentsObj.isVegetarianFriday,
          excludeKeywords: argumentsObj.excludeKeywords,
        });
      default:
        throw new Error(`MCP Tool '${name}' not found.`);
    }
  }
}

export const mcpAdapter = new MCPAdapter();
