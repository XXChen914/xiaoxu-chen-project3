import {
  createGame,
  findAllGames,
  deleteGame as deleteGameById,
} from "../models/game.model.js";
import { findGameByName } from "../models/game/game.model.js";
import {
  createSession,
  findSession,
  updateBoard,
} from "../models/session/session.model.js";
import { commonSudokuBuilder } from "../utils/gameGenerator.js";
import generateGameName from "../utils/gameNameGenerator.js";

// GET /api/sudoku
// Return all games
async function getAllGames(req, res) {
  try {
    const games = await findAllGames();
    const formatted = games.map((g) => ({
      gameId: g._id,
      gameName: g.name,
      difficulty: g.difficulty,
      creator: g.creatorUsername,
      createdAt: g.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/sudoku
// Create a new game (EASY or NORMAL)
async function createSudoku(req, res) {
  const { difficulty, username } = req.body;

  if (!difficulty || !username) {
    return res
      .status(400)
      .json({ message: "difficulty and username are required" });
  }

  try {
    const board = commonSudokuBuilder(difficulty);

    // Generate a unique random name
    let gameName;
    let exists = true;
    while (exists) {
      gameName = generateGameName();
      const existing = await findGameByName(gameName);
      exists = !!existing;
    }

    const newGame = await createGame({
      name: gameName,
      difficulty,
      creatorUsername: username,
      initialBoard: board,
      creatorUsername: username,
    });

    await createSession({
      userName: username,
      gameId: newGame._id,
      currentBoard: board,
    });

    res.status(201).json({ gameId: newGame._id, gameName: newGame.name });
  } catch (err) {
    console.error("Error creating Sudoku game:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/sudoku/:gameId
// Return the current game state played by the user
async function getGameSession(req, res) {
  const { gameId } = req.params;
  const { username } = req.body;
  try {
    const session = await findSession(username, gameId);
    if (!session) {
      const game = await findGameById(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      const board = game.initialBoard;
      await createSession({ userName: username, gameId, currentBoard: board });
    }

    res.status(200).json(session.currentBoard);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/sudoku/:gameId
async function deleteSudoku(req, res) {
  const { gameId } = req.params;
  const { username } = req.body;
  if (!gameId) return res.status(400).json({ message: "gameId is required" });

  try {
    const game = await findGameById(gameId);
    if (game.creatorUsername !== username) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this game" });
    }
    const deleted = await deleteGameById(gameId);
    if (!deleted) return res.status(404).json({ message: "Game not found" });

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    console.error("Error deleting Sudoku game:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/sudoku/:gameId
// Update a user's game state
async function updateSudoku(req, res) {
  const { gameId } = req.params;
  const { username, board, completed } = req.body;

  if (!gameId || !username) {
    return res
      .status(400)
      .json({ message: "gameId and username are required" });
  }

  try {
    if (completed) {
      // Mark session as completed
      await markCompleted(username, gameId);
      return res.status(200).json({ message: "Game marked as completed" });
    }
    await updateBoard(username, gameId, board);
    res.status(200).json({ message: "Game updated successfully" });
  } catch (err) {
    console.error("Error updating Sudoku game:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  getAllGames,
  createSudoku,
  deleteSudoku,
  updateSudoku,
  getGameSession,
};
