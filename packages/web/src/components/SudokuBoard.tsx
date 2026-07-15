import React from "react";
import styles from "../styles/SudokuBoard.module.css";
import type { SudokuBoard as SudokuBoardType } from "../types/contracts";
import { Cell } from "./Cell";

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
      {board.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
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
