import { Router, Request, Response } from 'express';
import { mcpAdapter } from '../mcp/mcpAdapter';

const router = Router();

router.get('/mcp/tools', (_req: Request, res: Response) => {
  res.json({
    tools: mcpAdapter.listTools(),
  });
});

router.post('/mcp/call', async (req: Request, res: Response) => {
  try {
    const { name, arguments: args } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Tool name is required' });
      return;
    }
    const result = await mcpAdapter.callTool(name, args || {});
    res.json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
