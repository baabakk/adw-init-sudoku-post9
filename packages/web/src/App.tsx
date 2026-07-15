import React from "react";
import { DifficultySelector } from "./components/DifficultySelector.js";
import { SudokuBoard } from "./components/SudokuBoard.js";
import { usePuzzle } from "./hooks/usePuzzle.js";
import type { Difficulty } from "./types/contracts.js";

/**
 * Main application component.
 * Allows the user to select a difficulty, fetches a puzzle, and displays an
 * interactive Sudoku board.
 */
export const App: React.FC = () => {
  // Initialise with "easy" difficulty
  const {
    board,
    loading,
    error,
    difficulty,
    changeDifficulty,
    updateCell,
  } = usePuzzle("easy" as Difficulty);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Sudoku</h1>
      <DifficultySelector selected={difficulty} onSelect={changeDifficulty} />
      {loading && <p>Loading puzzle...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <SudokuBoard board={board} onCellChange={updateCell} />
    </div>
  );
};
