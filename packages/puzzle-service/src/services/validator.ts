import { SudokuBoard, SudokuRow, SudokuCell } from "@init-sudoku-post9/contracts";

/**
 * Validates a fully filled Sudoku board.
 * Returns an array of error messages; empty array means the board is valid.
 */
export function validateFullBoard(board: SudokuBoard): string[] {
  const errors: string[] = [];

  // Helper to check a set of nine cells contains 1-9 exactly once
  const checkSet = (cells: SudokuCell[], context: string) => {
    const seen = new Set<number>();
    for (const v of cells) {
      if (v === 0) {
        errors.push(`${context} contains empty cell`);
        continue;
      }
      if (seen.has(v)) {
        errors.push(`${context} has duplicate value ${v}`);
      } else {
        seen.add(v);
      }
    }
    if (seen.size !== 9) {
      errors.push(`${context} does not contain all digits 1-9`);
    }
  };

  // Rows
  board.forEach((row, i) => checkSet(row, `Row ${i + 1}`));

  // Columns
  for (let col = 0; col < 9; col++) {
    const column: SudokuCell[] = [];
    for (let row = 0; row < 9; row++) {
      column.push(board[row][col]);
    }
    checkSet(column, `Column ${col + 1}`);
  }

  // 3x3 subgrids
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells: SudokuCell[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(board[boxRow * 3 + r][boxCol * 3 + c]);
        }
      }
      checkSet(cells, `Box ${boxRow * 3 + boxCol + 1}`);
    }
  }

  return errors;
}
