/**
 * Runtime validation for the PuzzleResponse contract.
 * Ensures the shape matches the expected 9×9 Sudoku board with values 0‑9.
 */
import type { PuzzleResponse, SudokuBoard, SudokuRow, SudokuCell } from "../types/contracts.js";

/**
 * Type guard that checks whether a value is a valid SudokuCell (0‑9).
 */
function isSudokuCell(value: unknown): value is SudokuCell {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9;
}

/**
 * Validates that an object conforms to the {@link PuzzleResponse} contract.
 * Throws an {@link Error} if validation fails.
 */
export function validatePuzzleResponse(data: unknown): PuzzleResponse {
  if (typeof data !== "object" || data === null) {
    throw new Error("PuzzleResponse must be an object");
  }
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.board)) {
    throw new Error("PuzzleResponse.board must be an array");
  }
  const board = obj.board as unknown[];
  if (board.length !== 9) {
    throw new Error("PuzzleResponse.board must have length 9");
  }
  const rows: SudokuRow[] = [];
  for (let i = 0; i < 9; i++) {
    const row = board[i];
    if (!Array.isArray(row) || row.length !== 9) {
      throw new Error(`Row ${i} must be an array of length 9`);
    }
    const cells: SudokuCell[] = [];
    for (let j = 0; j < 9; j++) {
      const cell = row[j];
      if (!isSudokuCell(cell)) {
        throw new Error(`Cell (${i},${j}) must be an integer between 0 and 9`);
      }
      cells.push(cell as SudokuCell);
    }
    rows.push(cells as SudokuRow);
  }
  return { board: rows as SudokuBoard };
}
