// Shared contracts for Sudoku platform
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/** Cell value: 0 means empty, 1-9 are filled */
export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** A row of 9 cells */
export type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

/** Full 9x9 board */
export type Board = [Row, Row, Row, Row, Row, Row, Row, Row, Row];

/** Core domain entity: Puzzle */
export interface Puzzle {
  /** Unique identifier */
  readonly id: string;
  /** Difficulty level */
  readonly difficulty: Difficulty;
  /** The Sudoku board */
  readonly board: Board;
  /** ISO timestamp when created */
  readonly createdAt: string;
}

/** Core domain entity: Score */
export interface Score {
  readonly id: string;
  readonly playerName: string;
  readonly difficulty: Difficulty;
  /** Time to solve in seconds */
  readonly timeToSolve: number;
  readonly createdAt: string;
}

/* ---------- Request / Response payloads ---------- */

/** GET /puzzle request */
export interface PuzzleRequest {
  readonly difficulty: Difficulty;
}

/** GET /puzzle response */
export interface PuzzleResponse {
  readonly id: string;
  readonly board: Board;
}

/** POST /validate request */
export interface ValidateRequest {
  readonly board: Board;
}

/** POST /validate response */
export interface ValidateResponse {
  readonly valid: boolean;
  /** Optional list of human‑readable error messages */
  readonly errors?: readonly string[];
}

/** POST /scores request */
export interface ScoreRequest {
  readonly playerName: string;
  readonly difficulty: Difficulty;
  /** Time to solve in seconds */
  readonly timeToSolve: number;
}

/** POST /scores response */
export interface ScoreResponse {
  readonly success: boolean;
  /** Identifier of the stored score */
  readonly scoreId?: string;
}

/** Single entry in a leaderboard */
export interface LeaderboardEntry {
  readonly playerName: string;
  /** Time to solve in seconds */
  readonly timeToSolve: number;
}

/** GET /leaderboard response */
export interface LeaderboardResponse {
  readonly difficulty: Difficulty;
  /** Up to ten best scores, ordered ascending by timeToSolve */
  readonly entries: readonly LeaderboardEntry[];
}
