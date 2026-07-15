import type { Request, Response, NextFunction } from "express";

/**
 * Central error handling middleware.
 * It captures any thrown error, logs it (to console for now), and sends a JSON response.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  console.error(err);
  const status = err && typeof (err as any).status === "number" ? (err as any).status : 500;
  const message = err && typeof (err as any).message === "string" ? (err as any).message : "Internal Server Error";
  res.status(status).json({ error: message });
}
