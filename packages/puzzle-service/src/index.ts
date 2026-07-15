import express, { Request, Response, NextFunction } from 'express';
import puzzleRouter from './routes/puzzle';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

// Mount puzzle routes
app.use('/', puzzleRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Puzzle Service listening on port ${PORT}`);
});

export default app;
