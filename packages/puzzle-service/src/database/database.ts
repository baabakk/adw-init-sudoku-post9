import Database from 'better-sqlite3';
import path from 'path';

/**
 * Initializes and returns a SQLite database connection.
 * The database file is stored in the package's root under `data/puzzle-service.db`.
 */
export function initDatabase(): Database.Database {
  const dbPath = path.resolve(__dirname, '../../data/puzzle-service.db');
  const db = new Database(dbPath);

  // Create puzzles table if it does not exist.
  db.exec(`
    CREATE TABLE IF NOT EXISTS puzzles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      difficulty TEXT NOT NULL,
      board TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return db;
}
