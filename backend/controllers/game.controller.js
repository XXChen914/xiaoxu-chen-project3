import {
  createGame,
  findAllGames,
  findGameByName,
  findGameById,
  deleteGame as deleteGameById,
} from "../models/game/game.model.js";
import {
  createSession,
  findSession,
  updateBoard,
} from "../models/session/session.model.js";
import {
  createScore,
  incrementCompletions,
} from "../models/score/score.model.js";
import commonSudokuBuilder from "../utils/gameGenerator.js";
import generateGameName from "../utils/gameNameGenerator.js";
import { decodeUserName } from "../utils/userNameDecoder.js";

// Helper to get username from JWT, returns 401 if not found
function getUsernameOrUnauthorized(req, res) {
  const username = decodeUserName(req);
  if (!username) {
    res.status(401).json({ message: "Unauthorized: invalid or missing token" });
    return null;
  }
  return username;
}

// GET /api/sudoku
// Return all games
async function getAllGames(_, res) {
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
    console.error("Error fetching games:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/sudoku
// Create a new game (EASY or NORMAL)
async function createSudoku(req, res) {
  const { difficulty } = req.body;
  const username = getUsernameOrUnauthorized(req, res);
  if (!username) return;

  if (!difficulty) {
    return res.status(400).json({ message: "difficulty is required" });
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
      initialPuzzle: board,
    });

    await createSession({
      userName: username,
      gameId: newGame._id,
      currentBoard: board,
    });

    await createScore({
      gameId: newGame._id,
      userName: username,
      gameName: gameName,
    });

    res.status(201).json({ gameId: newGame._id, gameName: newGame.name });
  } catch (err) {
    console.error("Error creating Sudoku game:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/sudoku/:gameId
// Return the current game state played by the user
async function getGameSession(req, res) {
  const { gameId } = req.params;
  const username = getUsernameOrUnauthorized(req, res);
  if (!username) return;

  if (!gameId) {
    return res.status(400).json({ message: "gameId is required" });
  }

  const game = await findGameById(gameId);
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  try {
    let session = await findSession(username, gameId);
    if (!session) {
      session = await createSession({
        userName: username,
        gameId,
        currentBoard: game.initialPuzzle,
      });
    }

    res.status(200).json({
      currentBoard: session.currentBoard,
      completed: session.completed,
      initialPuzzle: game.initialPuzzle,
      mode: game.difficulty,
      gameName: game.name,
      elapsedTime: session.timer,
    });
  } catch (err) {
    console.error("Error fetching game session:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT /api/sudoku/:gameId
// Update a user's game state
async function updateSudoku(req, res) {
  const { gameId } = req.params;
  const { board, completed, timer, gameName } = req.body;
  const username = getUsernameOrUnauthorized(req, res);
  if (!username) return;

  if (!gameId) {
    return res.status(400).json({ message: "gameId is required" });
  }

  try {
    const updatedSession = await updateBoard(
      username,
      gameId,
      board,
      timer,
      completed
    );

    if (completed) {
      await incrementCompletions(gameId, gameName);
    }

    res.status(200).json({
      message: "Game state updated successfully",
      currentBoard: updatedSession.currentBoard,
    });
  } catch (err) {
    console.error("Error updating Sudoku game:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/sudoku/:gameId
async function deleteSudoku(req, res) {
  const { gameId } = req.params;
  const username = getUsernameOrUnauthorized(req, res);
  if (!username) return;
  if (!gameId) return res.status(400).json({ message: "gameId is required" });

  try {
    const game = await findGameById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (game.creatorUsername !== username) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this game" });
    }

    await deleteGameById(gameId);
    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    console.error("Error deleting Sudoku game:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/sudoku/:gameId/reset
// Reset a user's session board to initialPuzzle
async function resetSudoku(req, res) {
  const { gameId } = req.params;
  const username = getUsernameOrUnauthorized(req, res);
  if (!username) return;

  if (!gameId) {
    return res.status(400).json({ message: "gameId is required" });
  }

  try {
    const game = await findGameById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const updatedSession = await updateBoard(
      username,
      gameId,
      game.initialPuzzle,
      0
    );

    res.status(200).json({
      message: "Game reset successfully",
      currentBoard: updatedSession.currentBoard,
    });
  } catch (err) {
    console.error("Error resetting Sudoku game:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  getAllGames,
  createSudoku,
  deleteSudoku,
  updateSudoku,
  getGameSession,
  resetSudoku,
};
