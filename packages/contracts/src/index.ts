/**
 * Shared contracts for the Sudoku platform.
 * All cross‑team types are defined here so that each subsystem can import a single source of truth.
 * The file is compiled with `strict` enabled.
 */

/**
 * Difficulty levels supported by the platform.
 */
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/**
 * A Sudoku board is a 9×9 matrix of numbers. The value `0` represents an empty cell.
 * The type is a simple `number[][]`; runtime validation ensures the correct dimensions.
 */
export type SudokuBoard = number[][];

/**
 * Core domain entity representing a generated puzzle.
 */
export interface Puzzle {
  /** Unique identifier for the puzzle (UUID string). */
  id: string;
  /** Difficulty of the puzzle. */
  difficulty: Difficulty;
  /** The board layout; 0 denotes an empty cell. */
  board: SudokuBoard;
  /** ISO‑8601 timestamp of when the puzzle was created. */
  createdAt: string;
}

/**
 * Core domain entity representing a player's score.
 */
export interface Score {
  /** Unique identifier for the score record (UUID string). */
  id: string;
  /** Name of the player who achieved the score. */
  playerName: string;
  /** Difficulty of the puzzle that was solved. */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds. */
  timeToSolve: number;
  /** ISO‑8601 timestamp of when the score was recorded. */
  createdAt: string;
}

/**
 * Request payload for fetching a puzzle.
 */
export interface PuzzleRequest {
  /** Desired difficulty of the puzzle. */
  difficulty: Difficulty;
}

/**
 * Response payload containing a generated puzzle.
 */
export interface PuzzleResponse {
  /** The puzzle board; 0 denotes an empty cell. */
  board: SudokuBoard;
  /** Difficulty of the returned puzzle. */
  difficulty: Difficulty;
}

/**
 * Request payload for validating a completed board.
 */
export interface ValidateRequest {
  /** The board to validate. */
  board: SudokuBoard;
}

/**
 * Response payload for board validation.
 */
export interface ValidateResponse {
  /** Whether the board satisfies Sudoku rules. */
  valid: boolean;
  /** Optional list of error messages when `valid` is false. */
  errors?: string[];
}

/**
 * Request payload for submitting a score.
 */
export interface ScoreRequest {
  /** Player's display name. */
  playerName: string;
  /** Difficulty of the puzzle that was solved. */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds. */
  timeToSolve: number;
}

/**
 * Response payload after a score submission.
 */
export interface ScoreResponse {
  /** Indicates if the score was successfully recorded. */
  success: boolean;
  /** Identifier of the created score record. */
  scoreId: string;
}

/**
 * Single entry in a leaderboard.
 */
export interface LeaderboardEntry {
  /** Player's display name. */
  playerName: string;
  /** Difficulty of the puzzle. */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in seconds. */
  timeToSolve: number;
  /** Rank of the entry within the leaderboard (1‑based). */
  rank: number;
}

/**
 * Response payload for a leaderboard query.
 */
export interface LeaderboardResponse {
  /** Ordered list of the top entries for the requested difficulty. */
  entries: LeaderboardEntry[];
}
