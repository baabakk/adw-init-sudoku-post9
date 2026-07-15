import express, { Request, Response, NextFunction } from 'express';
import puzzleRouter from './routes/puzzle';
import db from './database/db'; // Ensure DB is initialized on import

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (for future POST endpoints)
app.use(express.json());

// Simple health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mount puzzle routes
app.use('/', puzzleRouter);

// Global error handler (fallback)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Puzzle Service listening on port ${PORT}`);
});

export default app;
