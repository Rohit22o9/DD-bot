import { Router, Request, Response } from 'express';
import { mockDailyDropAPI } from '../integrations/dailydrop';

const router = Router();

router.get('/cart/:userId', async (req: Request, res: Response) => {
  try {
    const cart = await mockDailyDropAPI.getCart(req.params.userId);
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cart/:userId/add', async (req: Request, res: Response) => {
  try {
    const { mealId, quantity = 1, slot = 'dinner', date } = req.body;
    if (!mealId) {
      res.status(400).json({ error: 'mealId is required' });
      return;
    }
    const cart = await mockDailyDropAPI.addToCart(req.params.userId, mealId, quantity, slot, date);
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cart/:userId/remove', async (req: Request, res: Response) => {
  try {
    const { mealId } = req.body;
    const cart = await mockDailyDropAPI.removeFromCart(req.params.userId, mealId);
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cart/:userId/update', async (req: Request, res: Response) => {
  try {
    const { mealId, quantity } = req.body;
    if (!mealId || typeof quantity !== 'number') {
      res.status(400).json({ error: 'mealId and numeric quantity are required' });
      return;
    }
    const cart = await mockDailyDropAPI.updateCartItem(req.params.userId, mealId, quantity);
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cart/:userId/clear', async (req: Request, res: Response) => {
  try {
    const cart = await mockDailyDropAPI.clearCart(req.params.userId);
    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
