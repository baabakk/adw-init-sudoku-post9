import express, { Request, Response } from "express";
import type { ScoreRequest, ScoreResponse, LeaderboardResponse, Difficulty } from "./types";
import { insertScore, getTopScores } from "./database";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * POST /scores
 * Accepts a completed game result and stores it.
 */
router.post("/scores", (req: Request, res: Response) => {
  const body = req.body as Partial<ScoreRequest>;
  // Basic validation – in a real service you'd use a schema validator.
  if (
    typeof body.playerName !== "string" ||
    typeof body.difficulty !== "string" ||
    typeof body.timeToSolve !== "number"
  ) {
    const errorResp: ScoreResponse = { success: false };
    return res.status(400).json(errorResp);
  }

  const scoreId = uuidv4();
  const createdAt = new Date().toISOString();

  const row = {
    id: scoreId,
    player_name: body.playerName,
    difficulty: body.difficulty as Difficulty,
    time_to_solve: body.timeToSolve,
    created_at: createdAt,
  };

  try {
    insertScore(row);
    const successResp: ScoreResponse = { success: true, scoreId };
    res.json(successResp);
  } catch (e) {
    console.error("Failed to insert score", e);
    const failResp: ScoreResponse = { success: false };
    res.status(500).json(failResp);
  }
});

/**
 * GET /leaderboard?difficulty=easy|medium|hard
 * Returns the top‑10 scores for the requested difficulty.
 */
router.get("/leaderboard", (req: Request, res: Response) => {
  const difficulty = req.query.difficulty as Difficulty | undefined;
  if (!difficulty) {
    return res.status(400).json({ entries: [] } as LeaderboardResponse);
  }

  const rows = getTopScores(difficulty);
  const entries = rows.map((r) => ({
    playerName: r.player_name,
    timeToSolve: r.time_to_solve,
    difficulty,
  }));

  const response: LeaderboardResponse = { entries };
  res.json(response);
});

export default router;
