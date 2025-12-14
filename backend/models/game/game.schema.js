import { Schema } from "mongoose";
import { Mode } from "#common/constants.js";

const GameSchema = new Schema(
  {
    // game name
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // game mode
    difficulty: {
      type: String,
      enum: [Mode.EASY.difficulty, Mode.NORMAL.difficulty],
      required: true,
    },
    // record initial puzzle state for resetting
    initialBoard: {
      type: [[Number]], // grid, 0 represents empty cells
      required: true,
      immutable: true,
    },
    // user who created the game
    creatorUsername: {
      type: String,
      required: true,
    },
  },
  {
    collection: "games",
    timestamps: true,
  }
);

GameSchema.index({ createdAt: -1 });

export default GameSchema;
