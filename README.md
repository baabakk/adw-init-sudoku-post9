# init-sudoku-post9 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build`
- test: `npm test`

## Subsystems (one feature team each)
- **web-client** — Web Client: Browser SPA that renders an interactive Sudoku board, allows difficulty selection, fetches puzzles from Puzzle Service, validates submissions, submits scores to Scores Service, and displays the leaderboard.
  - owns: packages/web
  - dependsOn: puzzle-service, scores-service
- **puzzle-service** — Puzzle Service: Generates valid, uniquely-solvable Sudoku puzzles per difficulty, validates submitted boards, and exposes HTTP endpoints for puzzle retrieval and validation. Uses SQLite for persistence if needed.
  - owns: packages/puzzle-service
  - dependsOn: none
- **scores-service** — Scores Service: Persists completed-game results (player name, difficulty, time) and serves a per-difficulty top-10 leaderboard. Uses SQLite for persistence.
  - owns: packages/scores-service
  - dependsOn: none

## Shared contracts
- packages/contracts
