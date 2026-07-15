import { SudokuBoard, SudokuRow, SudokuCell, Difficulty } from "@init-sudoku-post9/contracts";
import { validateFullBoard } from "./validator";

/**
 * Number of clues (filled cells) for each difficulty level.
 * These numbers are typical for Sudoku puzzles and ensure a reasonable difficulty.
 */
const cluesByDifficulty: Record<Difficulty, number> = {
  easy: 36,
  medium: 30,
  hard: 24,
};

/**
 * Generates a complete, valid Sudoku solution using back‑tracking.
 */
function generateFullSolution(): SudokuBoard {
  // Initialize empty board
  const board: SudokuBoard = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => 0 as SudokuCell),
  ) as SudokuBoard;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const shuffle = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const isSafe = (row: number, col: number, num: SudokuCell): boolean => {
    // Row
    if (board[row].includes(num)) return false;
    // Column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }
    // 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  };

  const fillCell = (idx: number): boolean => {
    if (idx === 81) return true; // all cells filled
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    if (board[row][col] !== 0) return fillCell(idx + 1);
    const shuffled = shuffle([...numbers]);
    for (const n of shuffled) {
      const num = n as SudokuCell;
      if (isSafe(row, col, num)) {
        board[row][col] = num;
        if (fillCell(idx + 1)) return true;
        board[row][col] = 0 as SudokuCell;
      }
    }
    return false;
  };

  const success = fillCell(0);
  if (!success) {
    throw new Error("Failed to generate a complete Sudoku solution");
  }
  // Validate the generated board (should be valid)
  const errors = validateFullBoard(board);
  if (errors.length) {
    throw new Error(`Generated board is invalid: ${errors.join(", ")}`);
  }
  return board;
}

/**
 * Counts the number of solutions for a partially filled board.
 * Stops counting after reaching `limit` solutions.
 */
function countSolutions(board: SudokuBoard, limit: number = 2): number {
  let count = 0;

  const findEmpty = (): [number, number] | null => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) return [r, c];
      }
    }
    return null;
  };

  const isSafe = (row: number, col: number, num: SudokuCell): boolean => {
    // Row
    for (let c = 0; c < 9; c++) if (board[row][c] === num) return false;
    // Column
    for (let r = 0; r < 9; r++) if (board[r][col] === num) return false;
    // Box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[startRow + r][startCol + c] === num) return false;
      }
    }
    return true;
  };

  const solve = (): void => {
    if (count >= limit) return; // early exit
    const empty = findEmpty();
    if (!empty) {
      count++;
      return;
    }
    const [row, col] = empty;
    for (let n = 1; n <= 9; n++) {
      const num = n as SudokuCell;
      if (isSafe(row, col, num)) {
        board[row][col] = num;
        solve();
        board[row][col] = 0 as SudokuCell;
        if (count >= limit) return;
      }
    }
  };

  solve();
  return count;
}

/**
 * Creates a puzzle by removing cells from a full solution while preserving a unique solution.
 * The resulting board will have exactly `clues` filled cells.
 */
function createPuzzleFromSolution(solution: SudokuBoard, clues: number): SudokuBoard {
  // Start with a deep copy of the solution
  const puzzle: SudokuBoard = solution.map(row => [...row]) as SudokuBoard;
  // List of cell positions
  const positions: Array<[number, number]> = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let cellsToRemove = 81 - clues;
  for (const [row, col] of positions) {
    if (cellsToRemove === 0) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0 as SudokuCell;
    // If the puzzle now has more than one solution, revert the change
    const solutions = countSolutions(puzzle, 2);
    if (solutions !== 1) {
      puzzle[row][col] = backup as SudokuCell;
    } else {
      cellsToRemove--;
    }
  }
  return puzzle;
}

/**
 * Public API: generate a Sudoku puzzle for the requested difficulty.
 */
export function generatePuzzle(difficulty: Difficulty): SudokuBoard {
  const clues = cluesByDifficulty[difficulty];
  const solution = generateFullSolution();
  const puzzle = createPuzzleFromSolution(solution, clues);
  return puzzle;
}
