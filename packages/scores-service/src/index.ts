import express from "express";
import router from "./routes";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the scores service routes under the root path
app.use(router);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Scores service listening on port ${PORT}`);
});
