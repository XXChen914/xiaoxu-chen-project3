import express from "express";
import {
  getHighscores,
  updateHighscore,
  getHighscoreByGameId,
} from "../controllers/score.controller.js";

const router = express.Router();

// GET all high scores sorted by completions
router.get("/", getHighscores);

// POST to increment (or create) highscore for a game
router.post("/:gameId", updateHighscore);

// GET highscore for a specific game by gameId
router.get("/:gameId", getHighscoreByGameId);

export default router;
