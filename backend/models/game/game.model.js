import mongoose from "mongoose";
import GameSchema from "./game.schema.js";

const GameModel = mongoose.model("Game", GameSchema);

// Create a new game
function createGame(game) {
  return GameModel.create(game);
}

// Find a game by ID
function findGameById(gameId) {
  return GameModel.findById(gameId).exec();
}

// Find a game by name
function findGameByName(name) {
  return GameModel.findOne({ name }).exec();
}

// Get all games (for Selection Page) sorted by newest first
function findAllGames() {
  return GameModel.find()
    .sort({ createdAt: -1 })
    .exec();
}


// Get games by difficulty
function findGamesByDifficulty(difficulty) {
  return GameModel.find({ difficulty })
    .sort({ createdAt: -1 })
    .exec();
}

// Delete a game (admin/owner use)
function deleteGame(gameId) {
  return GameModel.findByIdAndDelete(gameId).exec();
}

export {
  createGame,
  findGameById,
  findGameByName,
  findAllGames,
  findGamesByDifficulty,
  deleteGame,
};
