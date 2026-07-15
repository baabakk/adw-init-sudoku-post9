import { Router, Request, Response } from 'express';
import { generatePuzzle } from '../services/generator';
import { insertPuzzle } from '../database/puzzleRepository';
import { PuzzleRequest, PuzzleResponse } from '../types';
import { Difficulty } from '@init-sudoku-post9/contracts';

const router = Router();

/**
 * GET /puzzle?difficulty=easy|medium|hard
 * Returns a Sudoku puzzle board according to the requested difficulty.
 */
router.get('/puzzle', (req: Request, res: Response) => {
  const difficultyParam = req.query.difficulty as string | undefined;
  if (!difficultyParam) {
    return res.status(400).json({ error: 'Missing difficulty query parameter' });
  }
  // Validate difficulty against the allowed enum values
  const allowed: Difficulty[] = ['easy', 'medium', 'hard'];
  if (!allowed.includes(difficultyParam as Difficulty)) {
    return res
      .status(400)
      .json({ error: `Invalid difficulty. Allowed values: ${allowed.join(', ')}` });
  }
  const difficulty = difficultyParam as Difficulty;

  try {
    const board = generatePuzzle(difficulty);
    // Persist the generated puzzle (optional but required for FR-18)
    insertPuzzle(difficulty, board);
    const response: PuzzleResponse = { board };
    return res.json(response);
  } catch (err) {
    console.error('Error generating puzzle:', err);
    return res.status(500).json({ error: 'Failed to generate puzzle' });
  }
});

export default router;
