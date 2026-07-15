/**
 * Validation utilities for the Puzzle Service.
 */

import { Request, Response, NextFunction } from 'express';
import { PuzzleRequest } from './types';

/**
 * Middleware that validates the `difficulty` query parameter.
 * If valid, it attaches a typed `puzzleRequest` object to `req`.
 */
export function validatePuzzleRequest(req: Request, res: Response, next: NextFunction) {
  const difficulty = req.query.difficulty as string | undefined;
  if (!difficulty) {
    return res.status(400).json({ error: 'Missing required query parameter: difficulty' });
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty. Allowed values are easy, medium, hard' });
  }
  // Attach a typed object for downstream handlers
  const puzzleRequest: PuzzleRequest = { difficulty: difficulty as any };
  (req as any).puzzleRequest = puzzleRequest;
  next();
}
