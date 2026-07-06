import express, { Request, Response } from "express";
import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import {
  Difficulty,
  SubmitScoreRequest,
  SubmitScoreResponse,
  GetLeaderboardResponse,
  LeaderboardEntry,
} from "@init-sudoku-post9/contracts";

/**
 * Scores Service – Phase 2
 *
 * Provides two endpoints:
 *   POST   /scores          – submit a completed game result
 *   GET    /leaderboard?difficulty=easy|medium|hard – top‑10 leaderboard per difficulty
 *
 * Persistence is handled via SQLite using the `better-sqlite3` driver.
 * The database schema matches the contract description:
 *   id TEXT PRIMARY KEY,
 *   player_name TEXT NOT NULL,
 *   difficulty TEXT NOT NULL,
 *   time_to_solve INTEGER NOT NULL,
 *   created_at TEXT NOT NULL
 */

// Initialise SQLite database (synchronously – better‑sqlite3 is a sync driver)
const db = new Database("scores.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    player_name TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    time_to_solve INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
`);

// Prepared statements for performance and safety
const insertScoreStmt = db.prepare(
  `INSERT INTO scores (id, player_name, difficulty, time_to_solve, created_at) VALUES (?, ?, ?, ?, ?)`
);
const selectTopStmt = db.prepare(
  `SELECT player_name, difficulty, time_to_solve FROM scores WHERE difficulty = ? ORDER BY time_to_solve ASC LIMIT 10`
);

const app = express();
app.use(express.json());

/** POST /scores – submit a completed game */
app.post("/scores", (req: Request, res: Response) => {
  const body: Partial<SubmitScoreRequest> = req.body;
  // Basic validation – the contract expects all fields present and correctly typed
  if (
    typeof body.playerName !== "string" ||
    typeof body.difficulty !== "string" ||
    typeof body.timeToSolve !== "number"
  ) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  // Ensure difficulty is one of the allowed enum values
  const difficulty = body.difficulty as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  const scoreId = uuidv4();
  const createdAt = new Date().toISOString();

  try {
    insertScoreStmt.run(
      scoreId,
      body.playerName,
      difficulty,
      Math.round(body.timeToSolve), // store as integer seconds
      createdAt
    );
  } catch (e) {
    console.error("Failed to insert score:", e);
    return res.status(500).json({ error: "Database error" });
  }

  const response: SubmitScoreResponse = { scoreId };
  res.status(201).json(response);
});

/** GET /leaderboard?difficulty=easy|medium|hard – top‑10 per difficulty */
app.get("/leaderboard", (req: Request, res: Response) => {
  const diffParam = req.query.difficulty as string | undefined;
  if (!diffParam) {
    return res.status(400).json({ error: "Missing difficulty query parameter" });
  }
  const difficulty = diffParam.toLowerCase() as Difficulty;
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  let rows: { player_name: string; difficulty: string; time_to_solve: number }[];
  try {
    rows = selectTopStmt.all(difficulty);
  } catch (e) {
    console.error("Failed to query leaderboard:", e);
    return res.status(500).json({ error: "Database error" });
  }

  const entries: LeaderboardEntry[] = rows.map((row, idx) => ({
    rank: idx + 1,
    playerName: row.player_name,
    difficulty: row.difficulty as Difficulty,
    timeToSolve: row.time_to_solve,
  }));

  const response: GetLeaderboardResponse = {
    difficulty,
    entries,
  };
  res.json(response);
});

// Export the Express app for integration tests or external composition
export default app;

// If executed directly, start a listening server (useful for manual dev runs)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Scores service listening on port ${PORT}`));
}
