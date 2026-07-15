/**
 * Sudoku puzzle generator.
 * Generates a complete, valid Sudoku solution using backtracking and then removes
 * cells according to the requested difficulty.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Generate a full 9x9 Sudoku solution.
 */
function generateFullSolution(): number[][] {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function shuffle<T>(array: T[]): T[] {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function isSafe(row: number, col: number, num: number): boolean {
    // Row check
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    // Column check
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    // 3x3 box check
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function fillCell(index: number): boolean {
    if (index >= 81) return true; // all cells filled
    const row = Math.floor(index / 9);
    const col = index % 9;
    if (board[row][col] !== 0) return fillCell(index + 1);
    const shuffled = shuffle(numbers);
    for (const num of shuffled) {
      if (isSafe(row, col, num)) {
        board[row][col] = num;
        if (fillCell(index + 1)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  // Start filling from the first cell
  fillCell(0);
  return board;
}

/**
 * Remove cells from a solved board to create a puzzle.
 * The number of clues left depends on difficulty.
 */
function createPuzzleFromSolution(solution: number[][], difficulty: Difficulty): number[][] {
  const puzzle = solution.map(row => row.slice()); // deep copy
  // Number of clues to keep per difficulty (common heuristics)
  const cluesMap: Record<Difficulty, number> = {
    easy: 36, // 36 clues => 45 blanks
    medium: 32, // 32 clues => 49 blanks
    hard: 28, // 28 clues => 53 blanks
  };
  const clues = cluesMap[difficulty];
  const cellsToRemove = 81 - clues;

  // Randomly remove cells
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removed++;
    }
  }
  return puzzle;
}

/**
 * Public API: generate a Sudoku puzzle for the given difficulty.
 */
export function generatePuzzle(difficulty: Difficulty): number[][] {
  const solution = generateFullSolution();
  const puzzle = createPuzzleFromSolution(solution, difficulty);
  return puzzle;
}
