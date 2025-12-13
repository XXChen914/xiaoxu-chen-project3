import mongoose from "mongoose";
import SessionSchema from "./session.schema.js";

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
  return SessionModel.findOneAndUpdate(
    { userId, gameId },
    { $set: { currentBoard } },
    { new: true }
  ).exec();
}

// Mark session as completed
function markCompleted(userId, gameId) {
  return SessionModel.findOneAndUpdate(
    { userId, gameId },
    { $set: { completed: true, completedAt: new Date() } }
  ).exec();
}

function isCompleted(userId, gameId) {
  return SessionModel.findOne({ userId, gameId, completed: true }).exec();
}

export { createSession, findSession, updateBoard, markCompleted, isCompleted };
