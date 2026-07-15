// Shared contracts for the Sudoku platform
// This file contains ONLY type definitions that are shared across all subsystems.
// It is compiled with "strict": true and contains no implementation code.

/**
 * The difficulty levels supported by the puzzle generator and scoring system.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * A single Sudoku cell value. `0` represents an empty cell.
 */
export type SudokuCell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * A row in a Sudoku board – exactly nine cells.
 */
export type SudokuRow = [
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
  SudokuCell,
];

/**
 * A complete 9×9 Sudoku board. The board is immutable – callers should treat it as read‑only.
 */
export type SudokuBoard = [
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
  SudokuRow,
];

/**
 * Core domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** Unique identifier (UUID) for the puzzle */
  id: string;
  /** Difficulty level of the puzzle */
  difficulty: Difficulty;
  /** The initial board state – 0 denotes an empty cell */
  board: SudokuBoard;
  /** ISO‑8601 timestamp of when the puzzle was created */
  createdAt: string;
}

/**
 * Core domain entity representing a completed game result.
 */
export interface Score {
  /** Unique identifier (UUID) for the score record */
  id: string;
  /** Player name as supplied by the client */
  playerName: string;
  /** Difficulty level of the puzzle that was solved */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolve: number;
  /** ISO‑8601 timestamp of when the score was recorded */
  createdAt: string;
}

/**
 * Request payload for GET /puzzle?difficulty=…
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

/**
 * Request payload for POST /validate
 */
export interface ValidateRequest {
  board: SudokuBoard;
}

/**
 * Response payload for POST /validate
 */
export interface ValidateResponse {
  /** True when the supplied board satisfies Sudoku rules */
  valid: boolean;
  /** Optional list of human‑readable error messages when `valid` is false */
  errors?: string[];
}

/**
 * Request payload for POST /scores
 */
export interface ScoreRequest {
  playerName: string;
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolve: number;
}

/**
 * Response payload for POST /scores
 */
export interface ScoreResponse {
  /** Indicates whether the score was successfully recorded */
  success: boolean;
  /** Identifier of the created score record – present when `success` is true */
  scoreId?: string;
}

/**
 * Single entry in the leaderboard response.
 */
export interface LeaderboardEntry {
  playerName: string;
  timeToSolve: number;
  difficulty: Difficulty;
}

/**
 * Response payload for GET /leaderboard
 */
export interface LeaderboardResponse {
  /** Top‑10 entries for the requested difficulty */
  entries: LeaderboardEntry[];
}

/**
 * Row shape for the Puzzle Service SQLite table.
 * The `board` column stores a JSON stringified `SudokuBoard`.
 */
export interface PuzzleDbRow {
  id: string;
  difficulty: Difficulty;
  board: string; // JSON representation of SudokuBoard
  created_at: string; // ISO‑8601 timestamp
}

/**
 * Row shape for the Scores Service SQLite table.
 */
export interface ScoreDbRow {
  id: string;
  player_name: string;
  difficulty: Difficulty;
  time_to_solve: number;
  created_at: string; // ISO‑8601 timestamp
}
