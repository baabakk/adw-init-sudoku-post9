import express, { Request, Response } from "express";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";
import {
  Difficulty,
  Board,
  Puzzle,
  GetPuzzleRequest,
  GetPuzzleResponse,
  ValidateRequest,
  ValidateResponse,
} from "../../contracts/src";

/**
 * Sudoku generator and solver utilities.
 * The implementation uses a simple back‑tracking algorithm to generate a full
 * valid board, then removes cells according to difficulty while ensuring the
 * puzzle has a unique solution.
 */
class SudokuGenerator {
  /** Generate a completely solved board */
  static generateFullBoard(): Board {
    // Use a mutable any[][] and cast to Board at the end to satisfy the strict tuple type.
    const board: any = Array.from({ length: 9 }, () => Array(9).fill(0));
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);

    const isSafe = (row: number, col: number, num: number): boolean => {
      // Row & column check
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
    };

    const fill = (cell: number): boolean => {
      if (cell === 81) return true; // all cells filled
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      if (board[row][col] !== 0) return fill(cell + 1);

      const shuffled = shuffle([...numbers]);
      for (const num of shuffled) {
        if (isSafe(row, col, num)) {
          board[row][col] = num;
          if (fill(cell + 1)) return true;
          board[row][col] = 0;
        }
      }
      return false;
    };

    if (!fill(0)) {
      throw new Error("Failed to generate a full Sudoku board");
    }
    return board as Board;
  }

  /** Count the number of solutions for a given board (up to 2) */
  static countSolutions(board: Board, limit = 2): number {
    let count = 0;
    const isSafe = (row: number, col: number, num: number): boolean => {
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
    };

    const solve = (cell: number): boolean => {
      if (cell === 81) {
        count++;
        return count >= limit; // stop early if limit reached
      }
      const row = Math.floor(cell / 9);
      const col = cell % 9;
      if (board[row][col] !== 0) return solve(cell + 1);

      for (let num = 1; num <= 9; num++) {
        if (isSafe(row, col, num)) {
          // Mutate board safely (cast to any for assignment)
          (board as any)[row][col] = num;
          if (solve(cell + 1)) return true;
          (board as any)[row][col] = 0;
        }
      }
      return false;
    };

    solve(0);
    return count;
  }

  /** Generate a puzzle board for the given difficulty ensuring a unique solution */
  static generatePuzzle(difficulty: Difficulty): Board {
    const full = SudokuGenerator.generateFullBoard();
    // Number of clues based on difficulty (standard ranges)
    const cluesMap: Record<Difficulty, number> = {
      easy: 36,
      medium: 32,
      hard: 28,
    } as any;
    const clues = cluesMap[difficulty];
    const cells = Array.from({ length: 81 }, (_, i) => i);
    const shuffle = (arr: number[]) => arr.sort(() => Math.random() - 0.5);
    const shuffled = shuffle(cells);
    let removed = 0;
    const board = full.map(row => row.slice()) as Board;

    for (const idx of shuffled) {
      const r = Math.floor(idx / 9);
      const c = idx % 9;
      const backup = board[r][c];
      board[r][c] = 0 as any;
      // Ensure uniqueness
      const copy = board.map(row => row.slice()) as Board;
      const solutions = SudokuGenerator.countSolutions(copy, 2);
      if (solutions !== 1) {
        board[r][c] = backup as any; // revert removal
      } else {
        removed++;
        if (81 - removed <= clues) break; // stop when desired clue count reached
      }
    }
    return board;
  }
}

/** SQLite persistence layer (optional) */
class PuzzleRepository {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  async init(): Promise<void> {
    this.db = await open({
      filename: "puzzles.db",
      driver: sqlite3.Database,
    });
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS puzzles (
        id TEXT PRIMARY KEY,
        difficulty TEXT NOT NULL,
        board TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  async save(puzzle: Puzzle): Promise<void> {
    const stmt = await this.db.prepare(
      "INSERT INTO puzzles (id, difficulty, board, created_at) VALUES (?, ?, ?, ?)"
    );
    await stmt.run(puzzle.id, puzzle.difficulty, JSON.stringify(puzzle.board), puzzle.createdAt);
    await stmt.finalize();
  }
}

/** Express server setup */
const app = express();
app.use(express.json());

const repo = new PuzzleRepository();
repo.init().catch(err => {
  console.error("Failed to initialise SQLite DB:", err);
});

/** GET /puzzle?difficulty=easy|medium|hard */
app.get("/puzzle", async (req: Request, res: Response) => {
  const diffParam = req.query.difficulty as string | undefined;
  if (!diffParam) {
    return res.status(400).json({ error: "Missing difficulty query parameter" });
  }
  const difficulty = diffParam.toLowerCase() as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  try {
    const board = SudokuGenerator.generatePuzzle(difficulty);
    const puzzle: Puzzle = {
      id: uuidv4(),
      difficulty,
      board,
      createdAt: new Date().toISOString(),
    };
    // Persist asynchronously; ignore errors to keep endpoint responsive
    repo.save(puzzle).catch(err => console.error("Failed to save puzzle:", err));

    const response: GetPuzzleResponse = {
      puzzleId: puzzle.id,
      difficulty: puzzle.difficulty,
      board: puzzle.board,
    };
    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate puzzle" });
  }
});

/**
 * Validate a submitted Sudoku board.
 * Returns { valid: true } if the board satisfies Sudoku rules, otherwise
 * { valid: false, message: <reason> }.
 */
function validateBoard(board: Board): { valid: boolean; message?: string } {
  // Basic shape validation
  if (!Array.isArray(board) || board.length !== 9) {
    return { valid: false, message: "Board must be a 9x9 array" };
  }
  for (let r = 0; r < 9; r++) {
    const row = board[r];
    if (!Array.isArray(row) || row.length !== 9) {
      return { valid: false, message: `Row ${r + 1} must contain 9 cells` };
    }
    for (let c = 0; c < 9; c++) {
      const cell = row[c];
      if (typeof cell !== "number" || cell < 0 || cell > 9) {
        return { valid: false, message: `Cell (${r + 1},${c + 1}) must be an integer between 0 and 9` };
      }
    }
  }

  // Helper to check duplicates in an array of numbers (ignoring zeros)
  const hasDuplicates = (arr: number[]): boolean => {
    const seen = new Set<number>();
    for (const n of arr) {
      if (n === 0) continue;
      if (seen.has(n)) return true;
      seen.add(n);
    }
    return false;
  };

  // Row validation
  for (let r = 0; r < 9; r++) {
    if (hasDuplicates(board[r])) {
      return { valid: false, message: `Duplicate value in row ${r + 1}` };
    }
  }

  // Column validation
  for (let c = 0; c < 9; c++) {
    const col: number[] = [];
    for (let r = 0; r < 9; r++) col.push(board[r][c]);
    if (hasDuplicates(col)) {
      return { valid: false, message: `Duplicate value in column ${c + 1}` };
    }
  }

  // Subgrid validation
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells: number[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push(board[br * 3 + r][bc * 3 + c]);
        }
      }
      if (hasDuplicates(cells)) {
        return { valid: false, message: `Duplicate value in 3x3 subgrid (${br + 1},${bc + 1})` };
      }
    }
  }

  return { valid: true };
}

/** POST /validate */
app.post("/validate", async (req: Request, res: Response) => {
  const payload = req.body as ValidateRequest;
  const { board, difficulty } = payload;

  // Difficulty validation
  if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
    const errorResp: ValidateResponse = { valid: false, message: "Invalid or missing difficulty" };
    return res.status(400).json(errorResp);
  }

  // Board validation using helper
  const result = validateBoard(board);
  const response: ValidateResponse = {
    valid: result.valid,
    ...(result.message ? { message: result.message } : {}),
  };
  res.json(response);
});

// Export the contracts for downstream consumers (kept for compatibility)
export { GetPuzzleRequest, GetPuzzleResponse, ValidateRequest, ValidateResponse } from "../../contracts/src";

// Start server if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Puzzle service listening on port ${PORT}`));
}

export default app;
