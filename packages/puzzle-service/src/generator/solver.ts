/**
 * Sudoku solver using backtracking.
 * Provides a function to count the number of solutions for a given board.
 */

export type Board = number[][]; // 9x9 board, 0 = empty

/**
 * Checks if placing `num` at (row, col) is valid according to Sudoku rules.
 */
function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Row and column check
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  // 3x3 subgrid check
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[startRow + r][startCol + c] === num) return false;
    }
  }
  return true;
}

/**
 * Finds the next empty cell. Returns [row, col] or null if board is full.
 */
function findEmpty(board: Board): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return [r, c];
    }
  }
  return null;
}

/**
 * Counts the number of solutions for the given board.
 * Stops counting after reaching `limit` solutions (default 2) for efficiency.
 */
export function countSolutions(board: Board, limit = 2): number {
  const emptyPos = findEmpty(board);
  if (!emptyPos) return 1; // board is complete, one solution found
  const [row, col] = emptyPos;
  let solutions = 0;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      solutions += countSolutions(board, limit - solutions);
      board[row][col] = 0;
      if (solutions >= limit) break;
    }
  }
  return solutions;
}

/**
 * Solves the board in-place and returns true if a solution exists.
 */
export function solve(board: Board): boolean {
  const emptyPos = findEmpty(board);
  if (!emptyPos) return true;
  const [row, col] = emptyPos;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solve(board)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}
