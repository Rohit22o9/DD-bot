import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes';
import mealRoutes from './routes/mealRoutes';
import preferenceRoutes from './routes/preferenceRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import mealPlanRoutes from './routes/mealPlanRoutes';
import mcpRoutes from './routes/mcpRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

export const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'Drop AI Backend Prototype',
    timestamp: new Date().toISOString(),
    integration: 'MockDailyDropAPI',
  });
});

// API Routes
app.use('/api', chatRoutes);
app.use('/api', mealRoutes);
app.use('/api', preferenceRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', mealPlanRoutes);
app.use('/api', mcpRoutes);
app.use('/api', feedbackRoutes);

// Global Error Handler Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Malformed JSON payload' });
    return;
  }
  console.error('API Error:', err?.message || err);
  res.status(500).json({ error: 'Internal server error', details: err?.message });
});

export default app;
