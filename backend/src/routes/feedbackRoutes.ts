import { Router, Request, Response } from 'express';
import { toolRegistry } from '../ai/tools/ToolRegistry';
import { DropForMeMode } from '../types';

const router = Router();

// GET /api/drop-for-me?userId=user_alex&mode=safe
router.get('/drop-for-me', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'user_alex';
    const mode = (req.query.mode as DropForMeMode) || 'safe';
    const result = await toolRegistry.dropForMe(userId, mode);
    res.json({ success: true, drop: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate Drop For Me' });
  }
});

// POST /api/feedback
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { userId, mealId, reason } = req.body;
    if (!userId || !mealId || !reason) {
      return res.status(400).json({ error: 'userId, mealId, and reason are required' });
    }
    const feedback = await toolRegistry.recordFeedback(userId, mealId, reason);
    res.json({ success: true, feedback });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record feedback' });
  }
});

// GET /api/feedback/:userId
router.get('/feedback/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const history = await toolRegistry.getFeedbackHistory(userId);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get feedback history' });
  }
});

// POST /api/swipe
router.post('/swipe', async (req: Request, res: Response) => {
  try {
    const { userId, mealId, direction, reason } = req.body;
    if (!userId || !mealId || !direction) {
      return res.status(400).json({ error: 'userId, mealId, and direction are required' });
    }
    await toolRegistry.recordSwipe(userId, mealId, direction, reason);
    res.json({ success: true, message: `Recorded ${direction} swipe on ${mealId}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record swipe' });
  }
});

export default router;
