import React from "react";
import styles from "../styles/DifficultySelector.module.css";
import type { Difficulty } from "../types/contracts";

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selected,
  onSelect,
}) => {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <div className={styles.selector}>
      {difficulties.map((d) => (
        <button
          key={d}
          type="button"
          className={`${styles.button} ${selected === d ? styles.buttonSelected : ""}`}
          onClick={() => onSelect(d)}
        >
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </button>
      ))}
    </div>
  );
};
