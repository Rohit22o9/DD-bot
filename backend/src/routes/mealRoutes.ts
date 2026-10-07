import { Router, Request, Response } from 'express';
import { mockDailyDropAPI } from '../integrations/dailydrop';

const router = Router();

router.get('/meals', async (req: Request, res: Response) => {
  try {
    const { query, cuisine, maxPrice, slot, day } = req.query;
    const meals = await mockDailyDropAPI.searchMeals({
      query: query ? String(query) : undefined,
      cuisine: cuisine ? String(cuisine) : undefined,
      maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
      slot: slot as any,
      day: day as any,
    });
    res.json({ meals, count: meals.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/meals/:id', async (req: Request, res: Response) => {
  try {
    const meal = await mockDailyDropAPI.getMeal(req.params.id);
    if (!meal) {
      res.status(404).json({ error: 'Meal not found' });
      return;
    }
    res.json({ meal });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
