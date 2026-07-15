import type { PuzzleResponse } from '../types/contracts';
import { countSolutions } from './solver';

/**
 * Generates a complete, valid Sudoku solution using backtracking.
 */
function generateFullSolution(): number[][] {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
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

  function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function solve(cell = 0): boolean {
    if (cell === 81) return true;
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

  solve();
  return board;
}

/**
 * Removes numbers from a full solution to create a puzzle with a unique solution.
 * The number of clues depends on difficulty.
 */
function createPuzzleFromSolution(solution: number[][], clues: number): number[][] {
  const board = solution.map((row) => row.slice());
  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }
  // Shuffle cells
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
    const copy = board.map((r) => r.slice());
    const solutions = countSolutions(copy, 2);
    if (solutions !== 1) {
      board[row][col] = backup; // revert
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
  const cluesMap: Record<string, number> = {
    easy: 36,
    medium: 32,
    hard: 28,
  };
  const clues = cluesMap[difficulty] ?? 32;
  const board = createPuzzleFromSolution(solution, clues);
  return { board };
}
