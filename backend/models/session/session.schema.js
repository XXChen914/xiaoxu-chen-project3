import { Schema } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    currentBoard: { type: [[Number]], required: true }, // player's current progress
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  {
    collection: "sessions",
    timestamps: true,
  }
);

// Prevent duplicate completions for the same user & game
SessionSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export default SessionSchema;
