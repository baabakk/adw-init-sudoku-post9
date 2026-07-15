import { Router, Request, Response, NextFunction } from 'express';
import { generatePuzzle } from '../generator/sudokuGenerator';
import { insertPuzzle } from '../database';
import { validatePuzzleRequest } from '../validation/inputValidator';
import type { PuzzleResponse } from '../types/contracts';

const router = Router();

/**
 * GET /puzzle?difficulty=easy|medium|hard
 * Returns a newly generated Sudoku puzzle.
 */
router.get(
  '/puzzle',
  validatePuzzleRequest,
  (req: Request, res: Response<PuzzleResponse>, next: NextFunction) => {
    try {
      const { difficulty } = (req as any).puzzleRequest;
      const puzzle = generatePuzzle(difficulty);
      // Persist the generated puzzle (optional but required by FR-18)
      insertPuzzle(difficulty, puzzle.board);
      res.json(puzzle);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
