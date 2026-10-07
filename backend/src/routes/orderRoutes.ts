import { Router, Request, Response } from 'express';
import { mockDailyDropAPI } from '../integrations/dailydrop';
import { safetyValidator } from '../ai/orchestrator/SafetyValidator';

const router = Router();

router.get('/orders/:userId', async (req: Request, res: Response) => {
  try {
    const orders = await mockDailyDropAPI.getOrderHistory(req.params.userId, 10);
    res.json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:userId/usual', async (req: Request, res: Response) => {
  try {
    const usual = await mockDailyDropAPI.getUsualOrder(req.params.userId);
    if (!usual) {
      res.status(404).json({ error: 'No usual order found for user' });
      return;
    }
    res.json({ usual });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Explicit confirmation endpoint
router.post('/orders/:userId/confirm', async (req: Request, res: Response) => {
  try {
    const { isConfirmed } = req.body;
    const cart = await mockDailyDropAPI.getCart(req.params.userId);

    const safetyCheck = safetyValidator.canPlaceOrder({
      isExplicitlyConfirmed: Boolean(isConfirmed),
      cart,
    });

    if (!safetyCheck.allowed) {
      res.status(400).json({
        error: safetyCheck.reason || 'Confirmation required before order placement',
        confirmationRequired: true,
      });
      return;
    }

    const newOrder = await mockDailyDropAPI.placeOrder({
      userId: req.params.userId,
      date: new Date().toISOString().split('T')[0],
      slot: 'dinner',
      items: cart.items.map((i) => ({
        mealId: i.mealId,
        mealName: i.meal.name,
        price: i.meal.price,
        quantity: i.quantity,
        restaurantName: i.meal.restaurantName,
        category: i.meal.category,
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      tax: cart.estimatedTax,
      total: cart.total,
      restaurantId: cart.items[0]?.meal.restaurantId || 'rest_thai',
      restaurantName: cart.items[0]?.meal.restaurantName || 'Daily Drop Partner',
      status: 'pending',
    });

    res.json({
      success: true,
      message: 'Order placed successfully after explicit confirmation.',
      order: newOrder,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
