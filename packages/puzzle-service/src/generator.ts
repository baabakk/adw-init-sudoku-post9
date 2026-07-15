import type { Difficulty } from './types';
import { generatePuzzle as generatePuzzleFromService } from './services/puzzleGenerator';

/**
 * Wrapper module that re-exports the puzzle generation function.
 * This keeps the public API stable while delegating the implementation
 * to the service layer.
 */
export function generatePuzzle(difficulty: Difficulty): number[][] {
  // The service returns a PuzzleResponse; we only need the board.
  const result = generatePuzzleFromService(difficulty);
  return result.board;
}
