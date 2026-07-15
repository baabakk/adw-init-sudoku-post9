/**
 * Contracts for the Puzzle Service API.
 */

export interface PuzzleRequest {
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleResponse {
  /**
   * 9x9 Sudoku board where 0 represents an empty cell.
   */
  board: number[][];
}
