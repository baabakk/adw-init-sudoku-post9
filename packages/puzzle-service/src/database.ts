import { initDatabase } from './database/database';
import type { PuzzleResponse } from '../types/contracts';

type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Simple helper functions for inserting and retrieving puzzles.
 * Uses the same SQLite connection as the repository.
 */
export function insertPuzzle(difficulty: Difficulty, board: number[][]): number {
  const db = initDatabase();
  const stmt = db.prepare(
    'INSERT INTO puzzles (difficulty, board, created_at) VALUES (?, ?, datetime("now"))',
  );
  const info = stmt.run(difficulty, JSON.stringify(board));
  return Number(info.lastInsertRowid);
}

export function getPuzzleById(id: number): PuzzleResponse | null {
  const db = initDatabase();
  const stmt = db.prepare('SELECT board FROM puzzles WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return null;
  const board: number[][] = JSON.parse(row.board);
  return { board };
}
