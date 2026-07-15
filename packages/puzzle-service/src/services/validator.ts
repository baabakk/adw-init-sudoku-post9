import type { PuzzleResponse } from '../types/contracts';

/**
 * Validates a Sudoku board.
 * Returns an object indicating whether the board is valid and, if not, an error message.
 */
export function validateBoard(board: number[][]): { valid: boolean; error?: string } {
  // Basic shape check
  if (!Array.isArray(board) || board.length !== 9) {
    return { valid: false, error: 'Board must be a 9x9 array' };
  }
  for (const row of board) {
    if (!Array.isArray(row) || row.length !== 9) {
      return { valid: false, error: 'Board must be a 9x9 array' };
    }
    for (const cell of row) {
      if (typeof cell !== 'number' || cell < 0 || cell > 9) {
        return { valid: false, error: 'Cell values must be integers 0-9' };
      }
    }
  }

  // Helper to check duplicates in an array (ignoring zeros)
  const hasDuplicates = (arr: number[]): boolean => {
    const seen = new Set<number>();
    for (const n of arr) {
      if (n === 0) continue;
      if (seen.has(n)) return true;
      seen.add(n);
    }
    return false;
  };

  // Check rows
  for (const row of board) {
    if (hasDuplicates(row)) {
      return { valid: false, error: 'Duplicate value in a row' };
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const column = board.map((row) => row[col]);
    if (hasDuplicates(column)) {
      return { valid: false, error: 'Duplicate value in a column' };
    }
  }

  // Check 3x3 subgrids
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(board[boxRow * 3 + r][boxCol * 3 + c]);
        }
      }
      if (hasDuplicates(cells)) {
        return { valid: false, error: 'Duplicate value in a subgrid' };
      }
    }
  }

  return { valid: true };
}
