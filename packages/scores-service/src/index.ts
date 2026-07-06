// scores-service — Scores Service
// Scope: Persists completed-game results (player name, difficulty, time) and serves a per-difficulty top-10 leaderboard. Uses SQLite for persistence.
// Owns: packages/scores-service
// This team builds its slice here each phase.

import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import {
  Difficulty,
  ScoreRequest,
  ScoreResponse,
  LeaderboardResponse,
  LeaderboardEntry,
} from '@init-sudoku-post9/contracts';

/**
 * Service responsible for storing scores and providing leaderboard data.
 * It uses an SQLite database (via better-sqlite3) for persistence.
 */
export class ScoresService {
  // The underlying better-sqlite3 Database instance.
  private readonly db: Database;

  /**
   * Creates a new ScoresService instance.
   * @param dbPath Path to the SQLite file. Defaults to in‑memory DB.
   */
  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.initializeSchema();
  }

  /** Ensures the `scores` table exists. */
  private initializeSchema(): void {
    const createTable = `
      CREATE TABLE IF NOT EXISTS scores (
        id TEXT PRIMARY KEY,
        player_name TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        time_to_solve REAL NOT NULL,
        created_at TEXT NOT NULL
      );
    `;
    this.db.exec(createTable);
  }

  /**
   * Persists a new score record.
   * @param request The score submission payload.
   * @returns A response indicating success and the generated score id.
   */
  submitScore(request: ScoreRequest): ScoreResponse {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO scores (id, player_name, difficulty, time_to_solve, created_at)
       VALUES (?, ?, ?, ?, ?)`
    );
    try {
      stmt.run(id, request.playerName, request.difficulty, request.timeToSolve, createdAt);
      return { success: true, scoreId: id };
    } catch (error) {
      // In a real service we would log the error; for now we simply report failure.
      return { success: false };
    }
  }

  /**
   * Retrieves the top‑10 leaderboard for a given difficulty.
   * @param difficulty The difficulty level to query.
   * @returns Leaderboard entries ordered by fastest time then earliest submission.
   */
  getLeaderboard(difficulty: Difficulty): LeaderboardResponse {
    const stmt = this.db.prepare(
      `SELECT player_name, difficulty, time_to_solve, created_at
       FROM scores
       WHERE difficulty = ?
       ORDER BY time_to_solve ASC, created_at ASC
       LIMIT 10`
    );
    const rows = stmt.all(difficulty) as Array<{
      player_name: string;
      difficulty: string;
      time_to_solve: number;
      created_at: string;
    }>;

    const entries: LeaderboardEntry[] = rows.map((row, index) => ({
      playerName: row.player_name,
      difficulty: row.difficulty as Difficulty,
      timeToSolve: row.time_to_solve,
      rank: index + 1,
    }));

    return { entries };
  }
}

// Export a default singleton instance for convenience.
export const scoresService = new ScoresService();
