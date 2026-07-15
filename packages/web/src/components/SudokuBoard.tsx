import React from "react";
import styles from "../styles/SudokuBoard.module.css";
import type { SudokuBoard as SudokuBoardType, SudokuRow, SudokuCell } from "../types/contracts.js";
import { Cell } from "./Cell.js";

interface SudokuBoardProps {
  board: SudokuBoardType | null;
  onCellChange: (row: number, col: number, value: number) => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({ board, onCellChange }) => {
  if (!board) {
    return <div>Loading board...</div>;
  }

  return (
    <div className={styles.board} data-testid="sudoku-board">
      {board.map((row: SudokuRow, rowIndex: number) =>
        row.map((cellValue: SudokuCell, colIndex: number) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            value={cellValue}
            readOnly={cellValue !== 0}
            onChange={onCellChange}
          />
        ))
      )}
    </div>
  );
};
