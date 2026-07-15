import Database from 'better-sqlite3';
import { Difficulty } from './generator';

/**
 * Initialize SQLite database and ensure the puzzles table exists.
 */
const db = new Database('puzzle-service.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS puzzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    difficulty TEXT NOT NULL,
    board TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

/**
 * Insert a generated puzzle into the database.
 * @param difficulty Difficulty level of the puzzle.
 * @param board 9x9 board represented as a JSON string.
 * @returns The inserted row id.
 */
export function insertPuzzle(difficulty: Difficulty, board: number[][]): number {
  const stmt = db.prepare(
    'INSERT INTO puzzles (difficulty, board, created_at) VALUES (?, ?, datetime("now"))'
  );
  const info = stmt.run(difficulty, JSON.stringify(board));
  return Number(info.lastInsertRowid);
}

/**
 * Retrieve a puzzle by its id.
 */
export function getPuzzleById(id: number): { difficulty: string; board: number[][]; created_at: string } | null {
  const stmt = db.prepare('SELECT difficulty, board, created_at FROM puzzles WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  return {
    difficulty: row.difficulty,
    board: JSON.parse(row.board),
    created_at: row.created_at,
  };
}
