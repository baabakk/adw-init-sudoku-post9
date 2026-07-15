import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import type {
  ScoreRequest,
  ScoreResponse,
  LeaderboardResponse,
  LeaderboardEntry,
  Difficulty,
} from "@init-sudoku-post9/contracts";
import { getDb } from "../database";

const router = Router();

/**
 * POST /scores – record a completed game result.
 */
router.post(
  "/scores",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as Partial<ScoreRequest>;
      // Basic validation
      if (
        typeof body.playerName !== "string" ||
        body.playerName.trim() === "" ||
        typeof body.difficulty !== "string" ||
        !["easy", "medium", "hard"].includes(body.difficulty) ||
        typeof body.timeToSolve !== "number" ||
        !Number.isFinite(body.timeToSolve) ||
        body.timeToSolve < 0
      ) {
        const err: any = new Error("Invalid request payload");
        err.status = 400;
        throw err;
      }

      const db = getDb();
      const id = uuidv4();
      const stmt = db.prepare(
        `INSERT INTO scores (id, player_name, difficulty, time_to_solve, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`
      );
      stmt.run(id, body.playerName, body.difficulty, body.timeToSolve);

      const response: ScoreResponse = { success: true, scoreId: id };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /leaderboard?difficulty=easy|medium|hard – retrieve top‑10 scores for a difficulty.
 */
router.get(
  "/leaderboard",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const difficulty = req.query.difficulty as Difficulty | undefined;
      if (!difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
        const err: any = new Error("Missing or invalid difficulty query parameter");
        err.status = 400;
        throw err;
      }

      const db = getDb();
      const stmt = db.prepare(
        `SELECT player_name, time_to_solve, difficulty FROM scores
         WHERE difficulty = ?
         ORDER BY time_to_solve ASC
         LIMIT 10`
      );
      const rows: Array<{ player_name: string; time_to_solve: number; difficulty: Difficulty }> = stmt.all(
        difficulty,
      );

      const entries: LeaderboardEntry[] = rows.map((row) => ({
        playerName: row.player_name,
        timeToSolve: row.time_to_solve,
        difficulty: row.difficulty,
      }));

      const response: LeaderboardResponse = { entries };
      res.json(response);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
