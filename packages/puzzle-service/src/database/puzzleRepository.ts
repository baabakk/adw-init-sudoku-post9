import { db } from './db';
import type { PuzzleRequest, PuzzleResponse } from '../types';

/**
 * Inserts a generated puzzle into the database.
 */
export function insertPuzzle(puzzle: PuzzleResponse, difficulty: PuzzleRequest['difficulty']): number {
  const stmt = db.prepare(
    'INSERT INTO puzzles (difficulty, board) VALUES (?, ?)',
  );
  const info = stmt.run(difficulty, JSON.stringify(puzzle.board));
  return Number(info.lastInsertRowid);
}

/**
 * Retrieves a puzzle by its id.
 */
export function getPuzzleById(id: number): { id: number; difficulty: string; board: number[][]; created_at: string } | undefined {
  const stmt = db.prepare('SELECT * FROM puzzles WHERE id = ?');
  const row = stmt.get(id);
  if (!row) return undefined;
  return {
    id: row.id,
    difficulty: row.difficulty,
    board: JSON.parse(row.board),
    created_at: row.created_at,
  };
}
