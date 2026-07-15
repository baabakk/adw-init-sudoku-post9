import express, { Request, Response, NextFunction } from 'express';
import puzzleRouter from './routes/puzzle';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

// Mount puzzle routes
app.use('/', puzzleRouter);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Puzzle Service listening on port ${PORT}`);
});

export default app;
