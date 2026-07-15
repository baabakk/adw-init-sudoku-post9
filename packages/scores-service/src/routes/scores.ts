import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import type { ScoreRequest, ScoreResponse, Difficulty } from "@init-sudoku-post9/contracts";
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
  }
);

export default router;
