import Database from 'better-sqlite3';
import path from 'path';

// Initialize SQLite database. The database file is placed in the package's root under `data/puzzle.db`.
// It will be created automatically if it does not exist.
const dbPath = path.resolve(__dirname, '../../data/puzzle.db');
export const db = new Database(dbPath);

// Ensure the puzzles table exists according to the shared contract definition.
// Columns: id (TEXT primary key), difficulty (TEXT), board (TEXT JSON), created_at (TEXT).
const createTableStmt = `
CREATE TABLE IF NOT EXISTS puzzles (
  id TEXT PRIMARY KEY,
  difficulty TEXT NOT NULL,
  board TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

db.exec(createTableStmt);

export default db;
