import express from "express";
import {
  getHighscores,
  updateHighscore,
  getHighscoreByGameId,
} from "../controllers/score.controller.js";

const router = express.Router();

// GET all high scores sorted by completions
router.get("/highscore", getHighscores);

// POST to increment (or create) highscore for a game
router.post("/highscore", updateHighscore);

// GET highscore for a specific game by gameId
router.get("/highscore/:gameId", getHighscoreByGameId);

export default router;
