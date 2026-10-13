import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

/**
 * Speech-to-Text Voice Transcription Endpoint
 * Accepts multipart file upload OR base64 encoded audio from mobile/web (m4a, wav, webm)
 * Uses Groq Whisper (ultra-fast 200ms) or OpenAI Whisper or Gemini Flash
 */
router.post('/voice/transcribe', upload.single('file'), async (req: Request, res: Response) => {
  try {
    let buffer: Buffer | null = null;
    let mimeType = 'audio/m4a';
    let fileName = 'recording.m4a';

    if (req.file) {
      buffer = req.file.buffer;
      mimeType = req.file.mimetype || 'audio/m4a';
      fileName = req.file.originalname || 'recording.m4a';
    } else if (req.body?.audioBase64 && typeof req.body.audioBase64 === 'string') {
      buffer = Buffer.from(req.body.audioBase64, 'base64');
      if (req.body.mimeType) mimeType = req.body.mimeType;
      let ext = 'm4a';
      if (mimeType.includes('webm')) ext = 'webm';
      else if (mimeType.includes('wav')) ext = 'wav';
      else if (mimeType.includes('ogg')) ext = 'ogg';
      else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) ext = 'mp3';
      fileName = `recording.${ext}`;
    }

    if (!buffer || buffer.length === 0) {
      res.status(400).json({ error: 'No audio data received.' });
      return;
    }

    // 1. Try Groq Whisper (ultra-fast LPU transcription ~250ms)
    const groqKey = process.env.GROQ_API_KEY || process.env.QWEN_API_KEY;
    if (groqKey) {
      try {
        const formData = new FormData();
        const fileObj = typeof File !== 'undefined'
          ? new File([buffer], fileName, { type: mimeType })
          : new Blob([buffer], { type: mimeType });
        formData.append('file', fileObj);
        formData.append('model', 'whisper-large-v3-turbo');
        formData.append('response_format', 'json');

        const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
          },
          body: formData,
        });

        if (groqRes.ok) {
          const data: any = await groqRes.json();
          const transcript = data?.text?.trim();
          if (transcript) {
            res.json({ transcript, provider: 'groq_whisper' });
            return;
          }
        } else {
          console.warn('Groq Whisper returned non-OK status:', groqRes.status, await groqRes.text());
        }
      } catch (groqErr) {
        console.warn('Groq Whisper transcription failed:', groqErr);
      }
    }

    // 2. Try OpenAI Whisper
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const formData = new FormData();
        const fileObj = typeof File !== 'undefined'
          ? new File([buffer], fileName, { type: mimeType })
          : new Blob([buffer], { type: mimeType });
        formData.append('file', fileObj, fileName);
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'json');

        const oaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
          },
          body: formData,
        });

        if (oaiRes.ok) {
          const data: any = await oaiRes.json();
          const transcript = data?.text?.trim();
          if (transcript) {
            res.json({ transcript, provider: 'openai_whisper' });
            return;
          }
        }
      } catch (oaiErr) {
        console.warn('OpenAI Whisper transcription failed:', oaiErr);
      }
    }

    // 3. Try Gemini Flash Audio Inlining
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: 'Transcribe this spoken audio exactly into plain English text. Return only the transcription with no formatting, markdown, quotes, or additional commentary.',
                    },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: buffer.toString('base64'),
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const data: any = await geminiRes.json();
          const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (transcript) {
            res.json({ transcript, provider: 'gemini' });
            return;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini audio transcription failed:', geminiErr);
      }
    }

    // Real-time result: Return empty transcript if no speech detected
    res.status(200).json({
      transcript: '',
      provider: 'none',
      message: 'No speech recognized in audio recording',
    });
  } catch (err: any) {
    console.error('Voice transcription error:', err);
    res.status(500).json({
      error: 'Failed to transcribe audio',
      details: err?.message,
    });
  }
});

export default router;
