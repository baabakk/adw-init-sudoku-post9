import type { Request, Response, NextFunction } from 'express';

/**
 * Generic error handling middleware.
 * Sends JSON with an `error` field containing the message.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error:', err);
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';
  res.status(status).json({ error: message });
}
