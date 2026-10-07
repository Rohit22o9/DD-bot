import { Router, Request, Response } from 'express';
import { dropAIOrchestrator } from '../ai/orchestrator/Orchestrator';

const router = Router();

/**
 * Classic request/response endpoint (kept for backwards compatibility and
 * for clients that cannot consume streams, e.g. older React Native fetch).
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { userId = 'user_alex', message, sessionState } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Field "message" is required and must be a string.' });
      return;
    }

    const payload = await dropAIOrchestrator.processMessage(userId, message, sessionState);
    res.json(payload);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Internal server error processing Drop AI request',
      details: err.message,
    });
  }
});

/**
 * Real-time streaming endpoint (Server-Sent Events over POST).
 *
 * Event protocol (each event is `event: <name>\ndata: <json>\n\n`):
 *   status  -> { text }            live progress ("Checking today's menu…")
 *   delta   -> { text }            incremental chunk of the assistant reply
 *   payload -> ChatResponsePayload structured data (cards, plans, options) minus `message`
 *   done    -> { ms }              stream finished
 *   error   -> { message }         something went wrong
 *
 * When a real LLM with token streaming is connected, its tokens can be piped
 * straight into `delta` events without any frontend/mobile changes.
 */
router.post('/chat/stream', async (req: Request, res: Response) => {
  const started = Date.now();
  const { userId = 'user_alex', message, sessionState } = req.body || {};

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Field "message" is required and must be a string.' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable proxy buffering (nginx)
  res.flushHeaders?.();

  let clientDisconnected = false;
  res.on('close', () => {
    if (!res.writableEnded) {
      clientDisconnected = true;
    }
  });

  const send = (event: string, data: unknown) => {
    if (clientDisconnected || res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    (res as any).flush?.();
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  try {
    const hasActiveFilters = Boolean(
      sessionState?.activeFilters &&
      Object.values(sessionState.activeFilters).some((v) => v !== undefined)
    );
    send('status', {
      text: hasActiveFilters
        ? '⚡ Fast-tracking search with active preferences…'
        : '🧠 Understanding your request…',
    });

    // Live progress indicator while orchestrator runs
    const progressSteps = ["📋 Checking today's menu…", '🎯 Matching your taste profile…', '⭐ Ranking the best options…'];
    let stepIdx = 0;
    const ticker = setInterval(() => {
      if (stepIdx < progressSteps.length && !clientDisconnected) {
        send('status', { text: progressSteps[stepIdx++] });
      }
    }, 450);

    const payload = await dropAIOrchestrator.processMessage(userId, message, sessionState);
    clearInterval(ticker);

    if (clientDisconnected || res.writableEnded) return;

    // Natural beat so initial status indicator is visible before streaming deltas
    await sleep(350);

    // Send structured data first so the client can pre-load images while text streams
    const { message: replyText, ...structured } = payload;
    send('payload', structured);

    // Stream the reply word-by-word with a relaxed, natural cadence
    const tokens = (replyText || '').match(/\S+\s*|\n/g) || [];
    for (const token of tokens) {
      if (clientDisconnected || res.writableEnded) return;
      send('delta', { text: token });
      const pause =
        /[.!?:]\s*$/.test(token) || token === '\n'
          ? 320
          : /[,;—–]\s*$/.test(token)
          ? 180
          : 120;
      await sleep(pause);
    }

    send('done', { ms: Date.now() - started });
  } catch (err: any) {
    console.error('Chat stream error:', err);
    send('error', { message: 'Drop AI hit a snag processing that. Please try again.' });
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
});

export default router;
