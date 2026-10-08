import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { supervisorAgent } from '../agents/SupervisorAgent.js';
import { extractTextFromPdf } from '../services/pdfService.js';
import { SAMPLE_PAPERS } from '../samples/samplePapers.js';

const router = Router();

// Configure safe upload directory with file size limits
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: Only PDF research papers are supported.'));
    }
  }
});

// GET /api/samples - List preloaded research papers for 1-click demos
router.get('/samples', (_req: Request, res: Response) => {
  const samples = Object.values(SAMPLE_PAPERS).map(s => ({
    id: s.id,
    title: s.title,
    domain: s.domain,
    abstract: s.abstract
  }));
  res.json({ success: true, samples });
});

// POST /api/session/init - Initialize workflow session
router.post('/session/init', (req: Request, res: Response) => {
  const { sampleId } = req.body;
  const session = supervisorAgent.createSession(sampleId);
  res.json({ success: true, sessionId: session.id, session });
});

// POST /api/upload - Upload PDF and extract text
router.post('/upload', upload.single('paper'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file provided.' });
    }

    const { buffer, originalname, size } = req.file;
    const extracted = await extractTextFromPdf(buffer);

    const session = supervisorAgent.createSession();
    session.paperMetadata = {
      id: session.id,
      fileName: originalname,
      fileSize: size,
      uploadedAt: new Date().toISOString(),
      extractedChars: extracted.text.length
    };

    res.json({
      success: true,
      sessionId: session.id,
      metadata: session.paperMetadata,
      pageCount: extracted.numPages,
      textPreview: extracted.text.slice(0, 500),
      fullText: extracted.text
    });
  } catch (err: any) {
    console.error('[Upload Error]', err);
    res.status(400).json({ success: false, error: err.message || 'Failed to process PDF' });
  }
});

// POST /api/analyze - Paper Analyst & Planning Agent execution
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { sessionId, paperText, sampleId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required.' });
    }

    let textToAnalyze = paperText;
    if (sampleId && SAMPLE_PAPERS[sampleId]) {
      textToAnalyze = SAMPLE_PAPERS[sampleId].fullText;
    }

    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'paperText or valid sampleId is required.' });
    }

    const session = await supervisorAgent.analyzeAndPlan(sessionId, textToAnalyze, sampleId);
    res.json({ success: true, session });
  } catch (err: any) {
    console.error('[Analyze Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/execute - Consequential execution (after human approval!)
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { sessionId, sampleId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required.' });
    }

    const session = await supervisorAgent.executePipeline(sessionId, sampleId);
    res.json({ success: true, session });
  } catch (err: any) {
    console.error('[Execute Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/session/:id - Query session status
router.get('/session/:id', (req: Request, res: Response) => {
  const sessionId = String(req.params.id);
  const session = supervisorAgent.getSession(sessionId);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }
  res.json({ success: true, session });
});

// GET /api/session/:id/events - SSE Stream for real-time agent updates
router.get('/session/:id/events', (req: Request, res: Response) => {
  const sessionId = String(req.params.id);
  const session = supervisorAgent.getSession(sessionId);

  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state
  res.write(`data: ${JSON.stringify({ type: 'INIT', session })}\n\n`);

  // Subscribe to subsequent events
  const unsubscribe = supervisorAgent.subscribe(sessionId, (event, updatedSession) => {
    res.write(`data: ${JSON.stringify({ type: 'EVENT', event, session: updatedSession })}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// POST /api/session/:id/predict - Live prototype inference endpoint
router.post('/session/:id/predict', (req: Request, res: Response) => {
  try {
    const sessionId = String(req.params.id);
    const { sampleId, inputs } = req.body;
    const result = supervisorAgent.runInference(sessionId, sampleId, inputs || {});
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('[Predict Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
