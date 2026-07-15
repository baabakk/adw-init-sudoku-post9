import type { Difficulty } from './types';

/**
 * Validate a Sudoku board.
 * Returns true if the board follows Sudoku rules (no duplicate numbers in any row, column, or 3x3 subgrid).
 * Empty cells are represented by 0 and are ignored in the validation.
 */
export function validateBoard(board: number[][]): boolean {
  // Check dimensions
  if (!Array.isArray(board) || board.length !== 9) return false;
  for (const row of board) {
    if (!Array.isArray(row) || row.length !== 9) return false;
  }

  // Helper to check a group of 9 numbers for duplicates (ignoring zeros)
  const hasDuplicates = (arr: number[]): boolean => {
    const seen = new Set<number>();
    for (const num of arr) {
      if (num === 0) continue;
      if (num < 1 || num > 9) return true; // invalid number
      if (seen.has(num)) return true;
      seen.add(num);
    }
    return false;
  };

  // Rows
  for (const row of board) {
    if (hasDuplicates(row)) return false;
  }

  // Columns
  for (let col = 0; col < 9; col++) {
    const column = board.map(row => row[col]);
    if (hasDuplicates(column)) return false;
  }

  // Subgrids 3x3
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(board[boxRow * 3 + r][boxCol * 3 + c]);
        }
      }
      if (hasDuplicates(cells)) return false;
    }
  }

  return true;
}
