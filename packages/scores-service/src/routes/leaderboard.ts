import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import type { Difficulty, LeaderboardResponse, LeaderboardEntry } from "@init-sudoku-post9/contracts";
import { getDb } from "../database";

const router = Router();

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
      const rows = stmt.all(difficulty) as Array<{
        player_name: string;
        time_to_solve: number;
        difficulty: Difficulty;
      }>;

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
  }
);

export default router;
