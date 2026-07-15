import { Router, Request, Response, NextFunction } from 'express';
import { generatePuzzle } from '../generator';
import type { PuzzleRequest, PuzzleResponse } from '../types';
import { insertPuzzle } from '../database';

const router = Router();

/**
 * GET /puzzle?difficulty=easy|medium|hard
 * Returns a generated Sudoku puzzle.
 */
router.get('/', (req: Request, res: Response<PuzzleResponse>, next: NextFunction) => {
  try {
    const difficulty = req.query.difficulty as string;
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      const err: any = new Error('Invalid or missing difficulty parameter');
      err.status = 400;
      throw err;
    }
    const puzzle = generatePuzzle(difficulty as PuzzleRequest['difficulty']);
    // Persist the puzzle (optional)
    try {
      insertPuzzle(difficulty as PuzzleRequest['difficulty'], puzzle);
    } catch (e) {
      // Log but do not fail the request
      console.error('Failed to persist puzzle:', e);
    }
    const response: PuzzleResponse = { board: puzzle };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
