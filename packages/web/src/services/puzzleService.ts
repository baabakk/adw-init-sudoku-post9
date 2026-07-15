/**
 * Service client for the Puzzle Service API.
 * Provides a function to fetch a Sudoku puzzle based on difficulty.
 */
import type { PuzzleRequest, PuzzleResponse } from "../types/contracts.js";

/**
 * Base URL for the Puzzle Service. In a real deployment this could be
 * configured via environment variables. For now we assume the service is
 * reachable at the same origin under the `/puzzle` endpoint.
 */
const BASE_URL = ""; // empty string means same origin

/**
 * Fetch a puzzle from the Puzzle Service.
 *
 * @param request - The request payload containing the desired difficulty.
 * @returns A promise that resolves to a {@link PuzzleResponse}.
 * @throws An {@link Error} if the network request fails or the response is not
 *         a successful 2xx status.
 */
export async function getPuzzle(request: PuzzleRequest): Promise<PuzzleResponse> {
  const url = `${BASE_URL}/puzzle?difficulty=${encodeURIComponent(request.difficulty)}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch puzzle: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as PuzzleResponse; // validation performed by caller
}
