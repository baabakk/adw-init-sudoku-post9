/**
 * Types for the Puzzle Service.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Request payload for GET /puzzle endpoint.
 */
export interface PuzzleRequest {
  difficulty: Difficulty;
}

/**
 * Response payload containing a Sudoku board.
 * The board is a 9x9 matrix of numbers where 0 represents an empty cell.
 */
export interface PuzzleResponse {
  board: number[][]; // 9x9 array, values 0-9
  description?: string; // optional description
}
