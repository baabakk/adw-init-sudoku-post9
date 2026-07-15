import { Router, Request, Response, NextFunction } from 'express';
import { generatePuzzle } from '../generator';
import type { PuzzleRequest, PuzzleResponse } from '../types';
import { insertPuzzle } from '../database';

const router = Router();

/**
 * GET /puzzle?difficulty=easy|medium|hard
 * Returns a newly generated Sudoku puzzle.
 */
router.get(
  '/puzzle',
  (req: Request<{}, {}, {}, { difficulty?: string }>, res: Response<PuzzleResponse>, next: NextFunction) => {
    try {
      const difficultyParam = req.query.difficulty;
      if (!difficultyParam) {
        return res.status(400).json({ board: [] } as any);
      }
      const difficulty = difficultyParam as PuzzleRequest['difficulty'];
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).json({ board: [] } as any);
      }
      const puzzle = generatePuzzle(difficulty);
      // Persist the puzzle (optional for this phase)
      try {
        insertPuzzle(difficulty, puzzle);
      } catch (e) {
        // Log but do not fail the request
        console.error('Failed to persist puzzle:', e);
      }
      return res.json({ board: puzzle } as PuzzleResponse);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
