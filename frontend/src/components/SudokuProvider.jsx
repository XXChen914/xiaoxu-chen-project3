import { createContext, useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { isValid } from "../utils/validator.js";
import { getModeByDifficulty } from "common/constants.js";

export const SudokuContext = createContext(null);

// Pure function - defined OUTSIDE component so no dependency issues
function computeIncorrectCells(currentBoard, currentInitialBoard, difficulty) {
  if (!currentBoard || !currentInitialBoard || !difficulty) {
    return new Set();
  }

  const currentMode = getModeByDifficulty(difficulty);
  const { size, boxHeight, boxWidth } = currentMode;
  const newIncorrectCells = new Set();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const value = currentBoard[row][col];
      if (currentInitialBoard[row][col] !== 0) continue;
      if (value === 0) continue;

      if (!isValid(currentBoard, row, col, value, boxHeight, boxWidth)) {
        newIncorrectCells.add(`${row},${col}`);
      }
    }
  }

  return newIncorrectCells;
}

// Pure function - defined OUTSIDE component
function checkCompletion(currentBoard, incorrectCellsSet) {
  if (!currentBoard) return false;

  const size = currentBoard.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (currentBoard[row][col] === 0) return false;
    }
  }

  return incorrectCellsSet.size === 0;
}

export default function SudokuProvider({ children }) {
  const { username } = useOutletContext();

  const [mode, setMode] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameName, setGameName] = useState("");
  const [initialBoard, setInitialBoard] = useState(null);
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [incorrectCells, setIncorrectCells] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning || isComplete) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isComplete]);

  const getGameSession = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`/api/sudoku/${id}`);

      const initialPuzzle = data.initialPuzzle.map((row) => [...row]);

      // Compute incorrect cells based on loaded board state
      const loadedIncorrectCells = computeIncorrectCells(
        data.currentBoard,
        initialPuzzle,
        data.mode
      );

      setMode(data.mode);
      setBoard(data.currentBoard);
      setGameName(data.gameName);
      setGameId(id);
      setInitialBoard(initialPuzzle);
      setSelectedCell(null);
      setIncorrectCells(loadedIncorrectCells);
      setIsComplete(data.completed);
      setTimer(data.elapsedTime);
      setIsTimerRunning(!data.completed);
    } catch (err) {
      console.error("Error loading game:", err.message);
      setError("Failed to load game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetBoard = useCallback(async () => {
    if (!gameId || !initialBoard) return;

    const previousBoard = board;
    setError(null);

    try {
      setBoard(initialBoard.map((row) => [...row]));
      setSelectedCell(null);
      setIncorrectCells(new Set());
      setIsComplete(false);
      setTimer(0);
      setIsTimerRunning(true);

      const { data } = await axios.post(`/api/sudoku/${gameId}/reset`);
      setBoard(data.currentBoard);
    } catch (err) {
      console.error("Error resetting board:", err.message);
      setBoard(previousBoard);
      setError("Failed to reset board. Please try again.");
    }
  }, [gameId, board, initialBoard]);

  const isCellEditable = useCallback(
    (row, col) => {
      if (!initialBoard) return false;
      return initialBoard[row][col] === 0;
    },
    [initialBoard]
  );

  const isCellIncorrect = useCallback(
    (row, col) => {
      return incorrectCells.has(`${row},${col}`);
    },
    [incorrectCells]
  );

  const selectCell = useCallback(
    (row, col) => {
      if (!isComplete && isCellEditable(row, col)) {
        setSelectedCell({ row, col });
      }
    },
    [isComplete, isCellEditable]
  );

  const inputValue = useCallback(
    async (row, col, value) => {
      if (!board || !initialBoard || !mode || !gameId) return;
      if (isComplete || !isCellEditable(row, col)) return;
      if (!Number.isInteger(value)) return;

      const maxValue = board.length;
      if (value !== 0 && (value < 1 || value > maxValue)) return;

      const previousBoard = board;
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value;

      // ✅ Fixed: Pass all 3 arguments
      const newIncorrectCells = computeIncorrectCells(
        newBoard,
        initialBoard,
        mode
      );
      const completed = checkCompletion(newBoard, newIncorrectCells);

      // Optimistic update
      setBoard(newBoard);
      setIncorrectCells(newIncorrectCells);

      if (completed) {
        setIsComplete(true);
        setIsTimerRunning(false);
      }

      try {
        const { data } = await axios.put(`/api/sudoku/${gameId}`, {
          board: newBoard,
          completed: completed,
          timer: timer,
          gameName: gameName,
        });

        setBoard(data.currentBoard);
      } catch (err) {
        console.error("Failed to save move:", err.message);
        // Rollback on failure
        setBoard(previousBoard);
        setIncorrectCells(
          computeIncorrectCells(previousBoard, initialBoard, mode)
        );
        if (completed) {
          setIsComplete(false);
          setIsTimerRunning(true);
        }
        setError("Failed to save move. Please try again.");
      }
    },
    [
      isComplete,
      isCellEditable,
      board,
      initialBoard,
      mode,
      gameId,
      timer,
      gameName,
    ]
  );

  const clearError = useCallback(() => setError(null), []);

  const value = {
    // State
    username,
    gameName,
    mode,
    board,
    initialBoard,
    selectedCell,
    timer,
    isComplete,
    incorrectCells,
    isTimerRunning,
    isLoading,
    error,
    // Actions
    resetBoard,
    selectCell,
    isCellEditable,
    isCellIncorrect,
    inputValue,
    getGameSession,
    clearError,
  };

  return (
    <SudokuContext.Provider value={value}>{children}</SudokuContext.Provider>
  );
}
