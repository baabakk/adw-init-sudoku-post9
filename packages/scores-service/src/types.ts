import type {
  Score as ContractScore,
  LeaderboardEntry as ContractLeaderboardEntry,
  ScoreRequest as ContractScoreRequest,
  ScoreResponse as ContractScoreResponse,
  LeaderboardResponse as ContractLeaderboardResponse,
  Difficulty as ContractDifficulty,
} from "@init-sudoku-post9/contracts";

/**
 * Re-export contract types under local names for clarity within this service.
 */
export type Score = ContractScore;
export type LeaderboardEntry = ContractLeaderboardEntry;
export type ScoreRequest = ContractScoreRequest;
export type ScoreResponse = ContractScoreResponse;
export type LeaderboardResponse = ContractLeaderboardResponse;
export type Difficulty = ContractDifficulty;
