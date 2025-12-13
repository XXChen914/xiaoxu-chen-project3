import { Schema } from "mongoose";

// Schema for tracking game scores, high-level statistics
const ScoreSchema = new Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      unique: true,
    },
    gameName: {
      type: String,
      required: true,
      immutable: true,
    },
    totalCompletions: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "scores",
    timestamps: true,
  }
);

// Index for sorting by total completions
ScoreSchema.index({ totalCompletions: -1 });

export default ScoreSchema;
