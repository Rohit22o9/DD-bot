import { Router, Request, Response } from 'express';
import { toolRegistry } from '../ai/tools/ToolRegistry';

const router = Router();

router.post('/meal-plan/:userId', async (req: Request, res: Response) => {
  try {
    const { targetBudget = 65, isVegetarianFriday = false, excludeKeywords = [] } = req.body;
    const plan = await toolRegistry.buildMealPlan(req.params.userId, {
      targetBudget,
      isVegetarianFriday,
      excludeKeywords,
    });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
