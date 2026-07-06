// Shared contracts for Sudoku platform

/**
 * Difficulty levels supported by the Sudoku game.
 */
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/**
 * Represents a single cell value. `0` denotes an empty cell.
 */
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * 9×9 Sudoku board. Each inner array is a row of nine `CellValue`s.
 */
export type Board = CellValue[][];

/**
 * Domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** Unique identifier for the puzzle */
  id: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** The board layout; `0` means empty cell */
  board: Board;
  /** ISO timestamp when the puzzle was created */
  createdAt: string;
}

/**
 * Domain entity representing a player's score.
 */
export interface Score {
  /** Unique identifier for the score record */
  id: string;
  /** Player's display name */
  playerName: string;
  /** Difficulty of the puzzle solved */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds */
  timeToSolve: number;
  /** ISO timestamp when the score was recorded */
  createdAt: string;
}

/**
 * Request payload for fetching a puzzle.
 */
export interface PuzzleRequest {
  /** Desired difficulty */
  difficulty: Difficulty;
}

/**
 * Response payload containing a puzzle.
 */
export interface PuzzleResponse {
  /** The puzzle board */
  board: Board;
  /** Optional identifier for the puzzle (useful for validation later) */
  id?: string;
}

/**
 * Request payload for validating a completed board.
 */
export interface ValidateRequest {
  /** The board to validate */
  board: Board;
}

/**
 * Result of board validation.
 */
export interface ValidationResult {
  /** True if the board satisfies Sudoku rules */
  isValid: boolean;
  /** Human‑readable error messages when `isValid` is false */
  errors: string[];
}

/**
 * Response payload for validation endpoint.
 */
export interface ValidateResponse {
  /** Validation outcome */
  result: ValidationResult;
}

/**
 * Request payload for submitting a score.
 */
export interface ScoreRequest {
  /** Player's name */
  playerName: string;
  /** Difficulty of the puzzle solved */
  difficulty: Difficulty;
  /** Time taken to solve, in seconds */
  timeToSolve: number;
}

/**
 * Response payload after a score submission.
 */
export interface ScoreResponse {
  /** Indicates whether the score was accepted */
  success: boolean;
  /** Identifier of the created score record */
  scoreId?: string;
}

/**
 * Single entry in the leaderboard.
 */
export interface LeaderboardEntry {
  /** Player's name */
  playerName: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Time taken to solve, in seconds */
  timeToSolve: number;
  /** Rank of the entry (1 = best) */
  rank: number;
}

/**
 * Response payload for leaderboard retrieval.
 */
export interface LeaderboardResponse {
  /** Ordered list of top entries */
  entries: LeaderboardEntry[];
}
