import { Router, Request, Response } from 'express';
import {
  GROCERY_CATALOG,
  GROCERY_CATEGORIES,
  getGroceriesByCategory,
  searchGroceries,
  parseGroceryVoiceTranscript,
} from '../ai/groceryData';

const router = Router();

/**
 * GET /api/groceries/catalog
 * Returns all verified items from Groceries list.xlsx
 */
router.get('/groceries/catalog', (_req: Request, res: Response) => {
  res.json({
    total: GROCERY_CATALOG.length,
    items: GROCERY_CATALOG,
  });
});

/**
 * GET /api/groceries/categories
 * Returns the 12 verified categories and item count per category
 */
router.get('/groceries/categories', (_req: Request, res: Response) => {
  const breakdown = GROCERY_CATEGORIES.map((cat) => ({
    name: cat,
    count: GROCERY_CATALOG.filter((i) => i.category === cat).length,
  }));
  res.json({
    totalCategories: GROCERY_CATEGORIES.length,
    categories: breakdown,
  });
});

/**
 * GET /api/groceries/category/:categoryName
 * Returns items belonging to a specific category
 */
router.get('/groceries/category/:categoryName', (req: Request, res: Response) => {
  const cat = req.params.categoryName;
  const items = getGroceriesByCategory(cat);
  res.json({
    category: cat,
    total: items.length,
    items,
  });
});

/**
 * GET /api/groceries/search?q=...
 * Searches actual groceries strictly within the verified Excel catalog
 */
router.get('/groceries/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const results = searchGroceries(query);
  res.json({
    query,
    total: results.length,
    items: results,
  });
});

/**
 * POST /api/groceries/parse
 * Natural language voice & text transcript parser for grocery ordering
 */
router.post('/groceries/parse', (req: Request, res: Response) => {
  const { transcript = '' } = req.body;
  if (!transcript || typeof transcript !== 'string') {
    res.status(400).json({ error: 'Field "transcript" is required and must be a string.' });
    return;
  }
  const orderList = parseGroceryVoiceTranscript(transcript);
  res.json(orderList);
});

export default router;
