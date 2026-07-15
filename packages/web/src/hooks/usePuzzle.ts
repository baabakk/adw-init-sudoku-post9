import { useCallback, useEffect, useState } from "react";
import { getPuzzle } from "../services/puzzleService";
import { validatePuzzleResponse } from "../utils/validation";
import type { PuzzleRequest, PuzzleResponse, SudokuBoard, Difficulty } from "../types/contracts";

/**
 * Hook to fetch a Sudoku puzzle based on difficulty.
 * Handles loading state, network errors, and response validation.
 */
export function usePuzzle(initialDifficulty: Difficulty) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [board, setBoard] = useState<SudokuBoard | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPuzzle = useCallback(async (req: PuzzleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const raw = await getPuzzle(req);
      const validated = validatePuzzleResponse(raw);
      setBoard(validated.board);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
      setBoard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when difficulty changes
  useEffect(() => {
    fetchPuzzle({ difficulty });
  }, [difficulty, fetchPuzzle]);

  const changeDifficulty = useCallback((newDiff: Difficulty) => {
    setDifficulty(newDiff);
  }, []);

  const updateCell = useCallback(
    (row: number, col: number, value: number) => {
      if (!board) return;
      const newBoard = board.map((r, i) =>
        i === row
          ? r.map((c, j) => (j === col ? (value as any) : c))
          : r,
      ) as SudokuBoard;
      setBoard(newBoard);
    },
    [board],
  );

  return {
    board,
    loading,
    error,
    difficulty,
    changeDifficulty,
    updateCell,
  };
}
