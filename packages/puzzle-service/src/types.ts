import { Difficulty, SudokuBoard } from "@init-sudoku-post9/contracts";

/**
 * Request payload for GET /puzzle
 */
export interface PuzzleRequest {
  difficulty: Difficulty;
}

/**
 * Response payload for GET /puzzle
 */
export interface PuzzleResponse {
  board: SudokuBoard;
}
