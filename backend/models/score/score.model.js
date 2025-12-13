import mongoose from "mongoose";
import ScoreSchema from "./score.schema.js";

const ScoreModel = mongoose.model("Score", ScoreSchema);

// Find score by gameId
function findScoreByGameId(gameId) {
  return ScoreModel.findOne({ gameId }).exec();
}

// Increment total completions for a game.
// Use upsert to ensure the score document always exists.
function incrementCompletions(gameId) {
  return ScoreModel.findOneAndUpdate(
    { gameId },
    { $inc: { totalCompletions: 1 } },
    {
      new: true,
      upsert: true, // create document if it doesn't exist
      setDefaultsOnInsert: true,
    }
  ).exec();
}

// Get games in order by the number of players who have completed it
// Ignore games with 0 completions
function getTopScores() {
  return ScoreModel.find({ totalCompletions: { $gt: 0 } })
    .sort({ totalCompletions: -1 })
    .exec();
}

export { findScoreByGameId, incrementCompletions, getTopScores };
