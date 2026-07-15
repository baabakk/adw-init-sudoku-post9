/**
 * Types for Puzzle Service API contracts.
 */
export interface PuzzleRequest {
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleResponse {
  /**
   * 9x9 Sudoku board. Cells with value 0 represent empty slots.
   */
  board: number[][];
}
