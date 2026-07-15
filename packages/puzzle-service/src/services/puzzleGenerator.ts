import type { PuzzleResponse } from '../types';

/**
 * Generates a complete, valid Sudoku solution using backtracking.
 */
function generateFullSolution(): number[][] {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function isSafe(row: number, col: number, num: number): boolean {
    // Row and column check
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
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

  function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function solve(cell = 0): boolean {
    if (cell === 81) return true; // all cells filled
    const row = Math.floor(cell / 9);
    const col = cell % 9;
    if (board[row][col] !== 0) return solve(cell + 1);
    for (const num of shuffle(numbers)) {
      if (isSafe(row, col, num)) {
        board[row][col] = num;
        if (solve(cell + 1)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  // Start solving from empty board
  solve();
  return board;
}

/**
 * Counts the number of solutions for a given board up to a limit.
 * Returns the count (capped at limit).
 */
function countSolutions(board: number[][], limit = 2): number {
  let count = 0;
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function isSafe(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  }

  function solve(): boolean {
    if (count >= limit) return true; // early exit
    // Find empty cell
    let minOptions = 10;
    let targetRow = -1;
    let targetCol = -1;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const options = numbers.filter((n) => isSafe(r, c, n)).length;
          if (options < minOptions) {
            minOptions = options;
            targetRow = r;
            targetCol = c;
            if (options === 0) return false;
          }
        }
      }
    }
    if (targetRow === -1) {
      // No empty cells -> found a solution
      count++;
      return false; // continue searching for more solutions
    }
    const possible = numbers.filter((n) => isSafe(targetRow, targetCol, n));
    for (const n of possible) {
      board[targetRow][targetCol] = n;
      if (solve()) return true;
      board[targetRow][targetCol] = 0;
    }
    return false;
  }

  solve();
  return count;
}

/**
 * Removes numbers from a full solution to create a puzzle.
 * Ensures the puzzle has a unique solution.
 */
function createPuzzleFromSolution(solution: number[][], clues: number): number[][] {
  const board = solution.map((row) => row.slice());
  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }
  // Shuffle cell order for removal
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  let removed = 0;
  const totalToRemove = 81 - clues;
  for (const [row, col] of cells) {
    if (removed >= totalToRemove) break;
    const backup = board[row][col];
    board[row][col] = 0;
    // Check uniqueness
    const copy = board.map((r) => r.slice());
    const solutions = countSolutions(copy, 2);
    if (solutions !== 1) {
      // revert removal if not unique
      board[row][col] = backup;
    } else {
      removed++;
    }
  }
  return board;
}

/**
 * Public API: generate a puzzle according to difficulty.
 */
export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): PuzzleResponse {
  const solution = generateFullSolution();
  // Define clue counts per difficulty (typical values)
  const cluesMap: Record<string, number> = {
    easy: 36, // ~36 clues
    medium: 32,
    hard: 28,
  };
  const clues = cluesMap[difficulty] ?? 32;
  const board = createPuzzleFromSolution(solution, clues);
  return { board };
}
