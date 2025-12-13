import mongoose from "mongoose";
import ScoreSchema from "./score.schema.js";

const ScoreModel = mongoose.model("Score", ScoreSchema);

// Find score by gameId
function findScoreByGameId(gameId) {
  return ScoreModel.findOne({ gameId }).exec();
}

// Increment total completions for a game.
function incrementCompletions(gameId, gameName) {
  return ScoreModel.findOneAndUpdate(
    { gameId },
    { $inc: { totalCompletions: 1 }, $setOnInsert: { gameName } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();
}

// Get games in order by the number of players who have completed it
// Returns game name + completion count
function getTopScores() {
  return ScoreModel.find(
    { totalCompletions: { $gt: 0 } }, // ignore 0 completions
    { _id: 0, gameName: 1, totalCompletions: 1 } // projection
  )
    .sort({ totalCompletions: -1 })
    .exec();
}

export { findScoreByGameId, incrementCompletions, getTopScores };
