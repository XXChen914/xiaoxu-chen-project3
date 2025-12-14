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
function updateBoard(userName, gameId, currentBoard, currentTimer, completed) {
  return SessionModel.findOneAndUpdate(
    { userName, gameId },
    { $set: { currentBoard, timer: currentTimer, completed } },
    { new: true }
  ).exec();
}

// Find or create session (atomic operation)
function findOrCreateSession(userName, gameId, initialBoard) {
  return SessionModel.findOneAndUpdate(
    { userName, gameId },
    { 
      $setOnInsert: { 
        currentBoard: initialBoard,
        completed: false,
        timer: 0 
      } 
    },
    { upsert: true, new: true }
  ).exec();
}

export { createSession, findSession, updateBoard, findOrCreateSession };