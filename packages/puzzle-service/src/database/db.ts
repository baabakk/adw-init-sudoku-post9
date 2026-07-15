import Database from 'better-sqlite3';

// Initialize SQLite database. The file will be created in the package directory.
// Using the default export which is a constructor function.
// Exported as any to avoid exposing the internal BetterSqlite3.Database type which can cause TS export name issues.
const db: any = new Database('puzzle-service.db');

// Create puzzles table if it does not exist.
// Columns: id (INTEGER PRIMARY KEY AUTOINCREMENT), difficulty (TEXT), board (TEXT JSON), created_at (DATETIME).
const createTableStmt = `
CREATE TABLE IF NOT EXISTS puzzles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  difficulty TEXT NOT NULL,
  board TEXT NOT NULL,
  created_at DATETIME DEFAULT (datetime('now'))
);
`;

db.exec(createTableStmt);

export { db };
