import type { Difficulty } from "@init-sudoku-post9/contracts";

/**
 * Interface representing a score record stored in the database.
 */
export interface Score {
  /** Unique identifier for the score (UUID) */
  id: string;
  /** Player name */
  playerName: string;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolve: number;
  /** ISO‑8601 timestamp when the score was recorded */
  createdAt: string;
}
