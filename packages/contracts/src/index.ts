// Shared contracts for Sudoku platform

/**
 * Difficulty levels supported by the Sudoku game.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * A single cell value. `0` represents an empty cell.
 */
export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * A row consists of exactly nine cells.
 */
export type Row = [
  Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell
];

/**
 * The full 9×9 Sudoku board. The type enforces the exact shape of the grid.
 * Updated to a more permissive representation to accommodate runtime‑generated boards.
 */
export type Board = number[][];

/**
 * Core domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** Unique identifier (e.g., UUID). */
  id: string;
  difficulty: Difficulty;
  board: Board;
  /** ISO‑8601 timestamp of creation. */
  createdAt: string;
}

/**
 * Core domain entity representing a player's completed game.
 */
export interface Score {
  /** Unique identifier (e.g., UUID). */
  id: string;
  playerName: string;
  difficulty: Difficulty;
  /** Time to solve in seconds. */
  timeToSolve: number;
  /** ISO‑8601 timestamp of submission. */
  createdAt: string;
}

/**
 * Request payload for GET /puzzle?difficulty=...
 */
export interface GetPuzzleRequest {
  difficulty: Difficulty;
}

/**
 * Response payload for GET /puzzle.
 */
export interface GetPuzzleResponse {
  puzzleId: string;
  difficulty: Difficulty;
  board: Board;
}

/**
 * Request payload for POST /validate.
 */
export interface ValidateRequest {
  board: Board;
  difficulty: Difficulty;
}

/**
 * Response payload for POST /validate.
 */
export interface ValidateResponse {
  valid: boolean;
  /** Optional human‑readable message when the board is invalid. */
  message?: string;
}

/**
 * Request payload for POST /scores.
 */
export interface SubmitScoreRequest {
  playerName: string;
  difficulty: Difficulty;
  /** Time to solve in seconds. */
  timeToSolve: number;
}

/**
 * Response payload for POST /scores.
 */
export interface SubmitScoreResponse {
  scoreId: string;
}

/**
 * Single entry in the leaderboard.
 */
export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  difficulty: Difficulty;
  timeToSolve: number;
}

/**
 * Response payload for GET /leaderboard?difficulty=...
 */
export interface GetLeaderboardResponse {
  difficulty: Difficulty;
  entries: LeaderboardEntry[];
}
