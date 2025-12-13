import { Schema } from "mongoose";

const GameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "NORMAL"],
      required: true,
    },
    puzzle: {
      type: [[Number]], // grid, 0 represents empty cells
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByUsername: {
      type: String,
      required: true,
    },
    completedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        completedAt: { type: Date, default: Date.now },
        timeTaken: Number,
      },
    ],
    completionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "games",
  }
);

// Index for faster queries
GameSchema.index({ completionCount: -1 });
GameSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Game", gameSchema);
