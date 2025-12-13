const mongoose = require("mongoose");

const SessionSchema = require("./session.schema");

const SessionModel = mongoose.model("Session", SessionSchema);

// Create a new session for a user
function createSession(sessionData) {
  return SessionModel.create(sessionData);
}

// Find a session by userId and gameId
function findSession(userId, gameId) {
  return SessionModel.findOne({ userId, gameId }).exec();
}

// Update current board of a session
function updateBoard(userId, gameId, currentBoard) {
  return SessionModel.updateOne(
    { userId, gameId },
    { $set: { currentBoard } }
  ).exec();
}

// Mark session as completed
function markCompleted(userId, gameId) {
  return SessionModel.updateOne(
    { userId, gameId },
    { $set: { completed: true, completedAt: new Date() } }
  ).exec();
}

function isCompleted(userId, gameId) {
  return SessionModel.findOne({ userId, gameId, completed: true }).exec();
}

module.exports = {
  createSession,
  findSession,
  updateBoard,
  markCompleted,
  isCompleted,
};
