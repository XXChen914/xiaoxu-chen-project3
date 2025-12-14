import {
  findScoreByGameId,
  incrementCompletions,
  getTopScores,
} from "../models/score/score.model.js";

// GET /api/highscore
// Returns list of games sorted by total completions
async function getHighscores(req, res) {
  try {
    const scores = await getTopScores();
    res.status(200).json(scores);
  } catch (err) {
    console.error("Error fetching highscores:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/highscore/:gameId
// Increment total completions for a specific game
// If the game doesn't exist, create it using gameName from body
async function updateHighscore(req, res) {
  const { gameId } = req.params;
  const { gameName } = req.body;
  if (!gameId || !gameName) {
    return res
      .status(400)
      .json({ message: "gameId and gameName are required" });
  }

  try {
    const updatedScore = await incrementCompletions(gameId, gameName);
    res.status(200).json(updatedScore);
  } catch (err) {
    console.error(`Error updating highscore for gameId ${gameId}:`, err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/highscore/:gameId
// Return high score for a specific game
async function getHighscoreByGameId(req, res) {
  const { gameId } = req.params;

  try {
    const score = await findScoreByGameId(gameId);
    if (!score) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(score);
  } catch (err) {
    console.error("Error fetching highscore:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { getHighscores, updateHighscore, getHighscoreByGameId };
