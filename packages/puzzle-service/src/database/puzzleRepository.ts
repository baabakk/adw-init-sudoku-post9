import db from './db';
import { PuzzleDbRow } from '@init-sudoku-post9/contracts';
import { v4 as uuidv4 } from 'uuid';
import { SudokuBoard, Difficulty } from '@init-sudoku-post9/contracts';

/**
 * Inserts a generated puzzle into the database.
 * Returns the generated puzzle id.
 */
export function insertPuzzle(difficulty: Difficulty, board: SudokuBoard): string {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    'INSERT INTO puzzles (id, difficulty, board, created_at) VALUES (?, ?, ?, ?)',
  );
  stmt.run(id, difficulty, JSON.stringify(board), createdAt);
  return id;
}

/**
 * Retrieves a puzzle by its id.
 */
export function getPuzzleById(id: string): PuzzleDbRow | undefined {
  const stmt = db.prepare('SELECT * FROM puzzles WHERE id = ?');
  const row = stmt.get(id);
  return row as PuzzleDbRow | undefined;
}
