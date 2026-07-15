import type { Request, Response, NextFunction } from 'express';
import { PuzzleRequest } from '../types/contracts';

/**
 * Middleware that validates the `difficulty` query parameter for GET /puzzle.
 * If valid, attaches a typed `puzzleRequest` object to `req` for downstream handlers.
 */
export function validatePuzzleRequest(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const difficulty = req.query.difficulty as string | undefined;
  if (!difficulty) {
    const err = new Error('Missing required query parameter: difficulty');
    // @ts-ignore – adding status for error handler
    err['status'] = 400;
    return next(err);
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    const err = new Error('Invalid difficulty. Allowed values: easy, medium, hard');
    err['status'] = 400;
    return next(err);
  }
  // Attach a typed request object for later use
  (req as any).puzzleRequest = { difficulty } as PuzzleRequest;
  next();
}
