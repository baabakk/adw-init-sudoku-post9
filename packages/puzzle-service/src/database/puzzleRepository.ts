import type Database from 'better-sqlite3';
import { initDatabase } from './database';
import type { PuzzleResponse } from '../types/contracts';

/**
 * Repository for persisting and retrieving Sudoku puzzles.
 */
export class PuzzleRepository {
  private db: Database.Database;

  constructor() {
    this.db = initDatabase();
  }

  /**
   * Inserts a generated puzzle into the database.
   * Returns the generated id.
   */
  insertPuzzle(difficulty: string, board: number[][]): number {
    const stmt = this.db.prepare(
      'INSERT INTO puzzles (difficulty, board) VALUES (?, ?)',
    );
    const info = stmt.run(difficulty, JSON.stringify(board));
    return Number(info.lastInsertRowid);
  }

  /**
   * Retrieves a puzzle by its id.
   */
  getPuzzleById(id: number): PuzzleResponse | null {
    const stmt = this.db.prepare('SELECT board FROM puzzles WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    const board: number[][] = JSON.parse(row.board);
    return { board };
  }

  /**
   * Retrieves a random puzzle of the given difficulty.
   */
  getRandomPuzzleByDifficulty(difficulty: string): PuzzleResponse | null {
    const stmt = this.db.prepare(
      'SELECT board FROM puzzles WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1',
    );
    const row = stmt.get(difficulty);
    if (!row) return null;
    const board: number[][] = JSON.parse(row.board);
    return { board };
  }
}
