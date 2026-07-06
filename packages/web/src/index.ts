import React, { useEffect, useState, ChangeEvent } from "react";
import ReactDOM from "react-dom/client";
import {
  Difficulty,
  PuzzleRequest,
  PuzzleResponse,
  Board,
  CellValue,
} from "@init-sudoku-post9/contracts";

/**
 * Utility to validate that a board conforms to the contract expectations.
 * Returns true if the board is a 9×9 array of integers between 0 and 9 inclusive.
 */
function isValidBoard(board: unknown): board is Board {
  if (!Array.isArray(board) || board.length !== 9) return false;
  for (const row of board) {
    if (!Array.isArray(row) || row.length !== 9) return false;
    for (const cell of row) {
      if (typeof cell !== "number" || cell < 0 || cell > 9) return false;
    }
  }
  return true;
}

/**
 * Fetch a puzzle from the Puzzle Service.
 * Handles network errors and validates the response shape.
 */
async function fetchPuzzle(request: PuzzleRequest): Promise<PuzzleResponse> {
  const url = `/puzzle?difficulty=${request.difficulty}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as unknown;
  // Runtime validation against the contract shape
  if (
    typeof data !== "object" ||
    data === null ||
    !("board" in data)
  ) {
    throw new Error("Invalid response structure: missing board");
  }
  const maybeBoard = (data as any).board;
  if (!isValidBoard(maybeBoard)) {
    throw new Error("Invalid board format received from server");
  }
  // id is optional per contract
  const maybeId = (data as any).id;
  const result: PuzzleResponse = {
    board: maybeBoard,
    ...(maybeId ? { id: maybeId } : {}),
  };
  return result;
}

/**
 * Main application component.
 */
const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [board, setBoard] = useState<Board>(Array.from({ length: 9 }, () => Array(9).fill(0 as CellValue)));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPuzzle = async () => {
    setLoading(true);
    setError(null);
    try {
      const request: PuzzleRequest = { difficulty };
      const puzzle = await fetchPuzzle(request);
      setBoard(puzzle.board as Board);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load a puzzle on initial render
  useEffect(() => {
    loadPuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCellChange = (rowIdx: number, colIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const num = Number(val);
    if (Number.isNaN(num) || num < 0 || num > 9) {
      // ignore invalid input
      return;
    }
    setBoard((prev) => {
      const newBoard = prev.map((r) => r.slice()) as Board;
      newBoard[rowIdx][colIdx] = num as CellValue;
      return newBoard;
    });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "1rem" }}>
      <h1>Sudoku</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="difficulty-select">Difficulty: </label>
        <select
          id="difficulty-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={loading}
        >
          <option value={Difficulty.Easy}>Easy</option>
          <option value={Difficulty.Medium}>Medium</option>
          <option value={Difficulty.Hard}>Hard</option>
        </select>
        <button onClick={loadPuzzle} disabled={loading} style={{ marginLeft: "0.5rem" }}>
          {loading ? "Loading..." : "New Puzzle"}
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }} role="alert">
          Error: {error}
        </div>
      )}
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => (
                <td
                  key={colIdx}
                  style={{
                    border: "1px solid #999",
                    width: "2rem",
                    height: "2rem",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="text"
                    value={cell === 0 ? "" : cell}
                    onChange={handleCellChange(rowIdx, colIdx)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      textAlign: "center",
                      fontSize: "1rem",
                    }}
                    maxLength={1}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Mount the React application to the document body.
const rootElement = document.getElementById("root") ?? document.body.appendChild(document.createElement("div"));
rootElement.id = "root";
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
