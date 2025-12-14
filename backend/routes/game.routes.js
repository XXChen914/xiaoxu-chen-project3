import express from "express";
import {
  getAllGames,
  createSudoku,
  getGameSession,
  updateSudoku,
  deleteSudoku,
  resetSudoku,
} from "../controllers/game.controller.js";

const router = express.Router();

// GET /api/sudoku
// Returns a list of all games
router.get("/", getAllGames);

// POST /api/sudoku
// Creates a new game (EASY or NORMAL)
router.post("/sudoku", createSudoku);

// GET /api/sudoku/:gameId
// Returns the current game state for the user
router.get("/:gameId", getGameSession);

// PUT /api/sudoku/:gameId
// Updates a user's game state (board or mark completed)
router.put("/:gameId", updateSudoku);

// DELETE /api/sudoku/:gameId
// Deletes a game (only creator can delete)
router.delete("/:gameId", deleteSudoku);

// POST /api/sudoku/:gameId/reset
// Resets the user's session board to initialPuzzle
router.post("/:gameId/reset", resetSudoku);

export default router;
