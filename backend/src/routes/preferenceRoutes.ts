import { Router, Request, Response } from 'express';
import { mockDailyDropAPI } from '../integrations/dailydrop';

const router = Router();

router.get('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const prefs = await mockDailyDropAPI.getUserPreferences(req.params.userId);
    const profile = await mockDailyDropAPI.getUserProfile(req.params.userId);
    res.json({ preferences: prefs, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const { category, value } = req.body;
    if (category && value) {
      const updated = await mockDailyDropAPI.addPreferenceItem(
        req.params.userId,
        category,
        value
      );
      res.json({ preferences: updated });
    } else {
      const updated = await mockDailyDropAPI.updateUserPreferences(
        req.params.userId,
        req.body
      );
      res.json({ preferences: updated });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const { category, value } = req.body;
    if (!category || !value) {
      res.status(400).json({ error: 'category and value are required for deletion' });
      return;
    }
    const updated = await mockDailyDropAPI.removePreferenceItem(
      req.params.userId,
      category,
      value
    );
    res.json({ preferences: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
