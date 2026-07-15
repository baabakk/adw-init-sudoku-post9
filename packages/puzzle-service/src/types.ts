/**
 * Types for Puzzle Service API contracts.
 * These definitions must match the JSON schema contracts added in this phase.
 */

export interface PuzzleRequest {
  /**
   * Difficulty level of the puzzle to generate.
   * Allowed values: "easy", "medium", "hard".
   */
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleResponse {
  /**
   * 9x9 Sudoku board where 0 represents an empty cell.
   * The board is a two‑dimensional array of numbers (0‑9).
   */
  board: number[][];
}
