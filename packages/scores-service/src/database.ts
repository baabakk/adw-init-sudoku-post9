import Database from "better-sqlite3";
import type { ScoreDbRow } from "@init-sudoku-post9/contracts";
import path from "path";

/**
 * Returns a singleton instance of the SQLite database.
 * The database file is located in a `data` directory adjacent to this module.
 */
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
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
