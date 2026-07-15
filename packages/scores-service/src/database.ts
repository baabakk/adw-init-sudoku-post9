import Database from "better-sqlite3";
import type { ScoreDbRow } from "@init-sudoku-post9/contracts";
import path from "path";

/**
 * Returns a singleton instance of the SQLite database.
 * The database file is located in a `data` directory adjacent to this module.
 */
let dbInstance: ReturnType<typeof Database> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  // Resolve a path relative to the current file location using __dirname (CommonJS).
  const dbPath = path.resolve(__dirname, "../../data/scores.db");

  dbInstance = new Database(dbPath);

  // Ensure the scores table exists.
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      player_name TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      time_to_solve INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
  `;
  dbInstance.exec(createTableSQL);

  return dbInstance;
}

/**
 * Inserts a new score record into the database.
 */
export function insertScore(row: ScoreDbRow) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO scores (id, player_name, difficulty, time_to_solve, created_at)
     VALUES (@id, @player_name, @difficulty, @time_to_solve, @created_at)`
  );
  stmt.run(row);
}

/**
 * Retrieves the top 10 scores for a given difficulty, ordered by time_to_solve ascending.
 */
export function getTopScores(difficulty: string) {
  const db = getDb();
  const stmt = db.prepare(
    `SELECT player_name, time_to_solve FROM scores WHERE difficulty = ? ORDER BY time_to_solve ASC LIMIT 10`
  );
  return stmt.all(difficulty) as Array<{ player_name: string; time_to_solve: number }>;
}
