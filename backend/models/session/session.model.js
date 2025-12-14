import mongoose from "mongoose";
import SessionSchema from "./session.schema.js";

const SessionModel = mongoose.model("Session", SessionSchema);

// Create a new session for a user
function createSession(session) {
  return SessionModel.create(session);
}

// Find a session by userName and gameId
function findSession(userName, gameId) {
  return SessionModel.findOne({ userName, gameId }).exec();
}

// Update current board of a session
function updateBoard(userName, gameId, currentBoard) {
  return SessionModel.findOneAndUpdate(
    { userName, gameId },
    { $set: { currentBoard } },
    { new: true }
  ).exec();
}

// Mark session as completed
function markCompleted(userName, gameId) {
  return SessionModel.findOneAndUpdate(
    { userName, gameId },
    { $set: { completed: true} }
  ).exec();
}

function isCompleted(userName, gameId) {
  return SessionModel.findOne({ userName, gameId, completed: true }).exec();
}

export { createSession, findSession, updateBoard, markCompleted, isCompleted };
