import { Schema } from "mongoose";

const SessionSchema = new Schema(
  {
    userName: { type: String, required: true },
    gameId: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    currentBoard: { type: [[Number]], required: true }, // player's current progress
    completed: { type: Boolean, default: false },
    timer: { type: Number, default: 0 },
  },
  {
    collection: "sessions",
    timestamps: true,
  }
);

// Prevent duplicate completions for the same user & game
SessionSchema.index({ userName: 1, gameId: 1 }, { unique: true });

export default SessionSchema;
