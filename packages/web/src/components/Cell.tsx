import React, { ChangeEvent } from "react";
import styles from "../styles/Cell.module.css";

type CellProps = {
  row: number;
  col: number;
  value: number; // 0‑9, where 0 means empty
  readOnly: boolean;
  onChange: (row: number, col: number, value: number) => void;
};

export const Cell: React.FC<CellProps> = ({ row, col, value, readOnly, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string (treated as 0) or digits 1‑9
    const num = val === "" ? 0 : Number(val);
    if (num >= 0 && num <= 9) {
      onChange(row, col, num);
    }
  };

  return (
    <div className={styles.cell} data-testid={`cell-${row}-${col}`}>
      {readOnly ? (
        <span>{value !== 0 ? value : ""}</span>
      ) : (
        <input
          className={styles.input}
          type="text"
          maxLength={1}
          value={value === 0 ? "" : String(value)}
          onChange={handleChange}
          inputMode="numeric"
          pattern="[0-9]"
        />
      )}
    </div>
  );
};
