import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import ReactDOM from "react-dom/client";
import {
  Difficulty,
  GetPuzzleRequest,
  GetPuzzleResponse,
  Board,
  ValidateRequest,
  ValidateResponse,
} from "@init-sudoku-post9/contracts";

/**
 * Runtime validation that a board conforms to the contract expectations.
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
async function fetchPuzzle(request: GetPuzzleRequest): Promise<GetPuzzleResponse> {
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
  if (typeof data !== "object" || data === null || !("board" in data)) {
    throw new Error("Invalid response structure: missing board");
  }
  const maybeBoard = (data as any).board;
  if (!isValidBoard(maybeBoard)) {
    throw new Error("Invalid board format received from server");
  }
  const maybeId = (data as any).puzzleId ?? (data as any).id;
  const result: GetPuzzleResponse = {
    board: maybeBoard as Board,
    difficulty: request.difficulty,
    puzzleId: maybeId ?? "",
  } as any; // cast to any to satisfy missing fields if any
  return result;
}

/**
 * Send a board validation request to the Puzzle Service.
 * Returns the parsed ValidateResponse or throws on network/shape errors.
 */
async function postValidate(request: ValidateRequest): Promise<ValidateResponse> {
  const response = await fetch("/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as unknown;
  if (typeof data !== "object" || data === null || !("valid" in data)) {
    throw new Error("Invalid validation response structure");
  }
  // The contract guarantees `valid` is boolean and `message` optional string.
  return data as ValidateResponse;
}

/**
 * Main application component.
 */
const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validation UI state
  const [validating, setValidating] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const loadPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    setValidationMessage(null);
    setValidationError(null);
    try {
      const request: GetPuzzleRequest = { difficulty };
      const puzzle = await fetchPuzzle(request);
      setBoard(puzzle.board);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  // Load a puzzle on initial render and when difficulty changes
  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  const handleCellChange =
    (rowIdx: number, colIdx: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const num = Number(val);
      if (Number.isNaN(num) || num < 0 || num > 9) {
        // ignore invalid input
        return;
      }
      setBoard((prev) => {
        const newBoard = prev.map((r) => r.slice()) as Board;
        newBoard[rowIdx][colIdx] = num;
        return newBoard;
      });
    };

  const handleValidate = useCallback(async () => {
    setValidating(true);
    setValidationMessage(null);
    setValidationError(null);
    try {
      const request: ValidateRequest = { board, difficulty };
      const response = await postValidate(request);
      if (response.valid) {
        setValidationMessage("✅ Puzzle is valid!");
      } else {
        setValidationMessage(response.message ?? "❌ Puzzle is invalid");
      }
    } catch (e) {
      if (e instanceof Error) {
        setValidationError(e.message);
      } else {
        setValidationError("Unknown validation error");
      }
    } finally {
      setValidating(false);
    }
  }, [board, difficulty]);

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
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          onClick={loadPuzzle}
          disabled={loading}
          style={{ marginLeft: "0.5rem" }}
        >
          {loading ? "Loading..." : "New Puzzle"}
        </button>
        <button
          onClick={handleValidate}
          disabled={validating || loading}
          style={{ marginLeft: "0.5rem" }}
        >
          {validating ? "Validating..." : "Validate"}
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }} role="alert">
          Error: {error}
        </div>
      )}
      {validationError && (
        <div style={{ color: "red", marginBottom: "1rem" }} role="alert">
          Validation Error: {validationError}
        </div>
      )}
      {validationMessage && (
        <div
          style={{
            color: validationMessage.startsWith("✅") ? "green" : "orange",
            marginBottom: "1rem",
          }}
          role="status"
        >
          {validationMessage}
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
const rootElement =
  document.getElementById("root") ??
  document.body.appendChild(document.createElement("div"));
rootElement.id = "root";
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
