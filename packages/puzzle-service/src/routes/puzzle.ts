import { Router, Request, Response, NextFunction } from 'express';
import { generatePuzzle } from '../services/puzzleGenerator';
import type { PuzzleRequest, PuzzleResponse } from '../types';
import { insertPuzzle } from '../database/puzzleRepository';

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
        res.status(400).json({ board: [] } as any);
        return;
      }
      const difficulty = difficultyParam as PuzzleRequest['difficulty'];
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        res.status(400).json({ board: [] } as any);
        return;
      }
      const puzzle = generatePuzzle(difficulty);
      // Persist the puzzle (optional for this phase)
      try {
        insertPuzzle(puzzle, difficulty);
      } catch (e) {
        // Log but do not fail the request
        console.error('Failed to persist puzzle:', e);
      }
      res.json(puzzle);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
