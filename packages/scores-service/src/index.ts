import express, { json } from "express";
import scoresRouter from "./routes/scores";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(json());

// Routes
app.use(scoresRouter);

// Error handling – must be after all routes
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Scores service listening on port ${PORT}`);
});

export default app;
