import { createContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { isValid } from "../utils/validator.js";
import { getModeByDifficulty } from "common/constants.js";

export const SudokuContext = createContext();

export default function SudokuProvider(props) {
  const { username } = useOutletContext();

  const [mode, setMode] = useState(null); // 'easy' or 'normal'
  const [gameId, setGameId] = useState(null);
  const [gameName, setGameName] = useState("");
  const [initialBoard, setInitialBoard] = useState([[]]); // immutable cells
  const [board, setBoard] = useState([[]]); // current board state
  const [selectedCell, setSelectedCell] = useState(null); // {row, col}
  const [incorrectCells, setIncorrectCells] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning && !isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isComplete]);

  // Get the game session on gameId change
  // useEffect(() => {
  //   getGameSession(gameId);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  /**
   * Get the game session from backend for the current user and gameId.
   */
  async function getGameSession(gameId) {
    try {
      // Fetch the current session to get the board state

      const { data } = await axios.get(`/api/sudoku/${gameId}`);

      setMode(data.mode);
      setBoard(data.currentBoard);
      setGameName(data.gameName);
      setGameId(gameId);
      setInitialBoard(data.initialPuzzle.map((row) => [...row]));
      setSelectedCell(null);
      setIncorrectCells(new Set());
      setIsComplete(data.completed);
      setTimer(0);
      setIsTimerRunning(true);
    } catch (err) {
      console.error("Error creating new game:", err.message);
    }
  }

  async function resetBoard() {
    // Restore to initial state
    const { data } = await axios.post(`/api/sudoku/${gameId}/reset`);
    setBoard(data.currentBoard);
    setSelectedCell(null);
    setIncorrectCells(new Set());
    setIsComplete(false);
    setTimer(0);
    setIsTimerRunning(true);
  }

  function isCellEditable(row, col) {
    return initialBoard[row][col] === 0;
  }

  function isCellIncorrect(row, col) {
    return incorrectCells.has(`${row},${col}`);
  }

  function selectCell(row, col) {
    // Only select if it's editable and game not complete
    if (!isComplete && isCellEditable(row, col)) {
      setSelectedCell({ row, col });
    }
  }

  async function inputValue(row, col, value) {
    // Check if cell is editable and game not complete
    if (isComplete || !isCellEditable(row, col)) return;
    // Check if value is an integer
    if (!Number.isInteger(value)) return;

    const maxValue = board.length;

    // Validate input range
    if (value !== 0 && (value < 1 || value > maxValue)) return;

    // Create new board with updated value
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;

    // Validate the cell and get incorrect cells
    const newIncorrectCells = computeIncorrectCells(newBoard, mode);
    checkCompletion(newBoard, newIncorrectCells);

    const { data } = await axios.put(`/api/sudoku/${gameId}`, {
      board: newBoard,
      completed: isComplete,
    });
    setBoard(data.currentBoard);
    setIncorrectCells(newIncorrectCells);
  }

  function computeIncorrectCells(currentBoard, difficulty) {
    const currentMode = getModeByDifficulty(difficulty);
    const { size, boxHeight, boxWidth } = currentMode;
    const newIncorrectCells = new Set();

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = currentBoard[row][col];
        if (initialBoard[row][col] !== 0) continue; // Skip immutable cells
        if (value === 0) continue;

        // Check if this cell violates rules
        if (!isValid(currentBoard, row, col, value, boxHeight, boxWidth)) {
          newIncorrectCells.add(`${row},${col}`);
        }
      }
    }

    return newIncorrectCells;
  }

  function checkCompletion(board, incorrectCellsSet) {
    const size = board.length;

    // Check if all cells are filled
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) return;
      }
    }

    // Check if there are any invalid cells
    if (incorrectCellsSet.size === 0) {
      setIsComplete(true);
      setIsTimerRunning(false);
    }
  }

  const globalDataAndFunctions = {
    resetBoard,
    selectCell,
    isCellEditable,
    isCellIncorrect,
    inputValue,
    getGameSession,
    setGameId,
    setGameName,
    setMode,
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
  };

  return (
    <SudokuContext.Provider value={globalDataAndFunctions}>
      {props.children}
    </SudokuContext.Provider>
  );
}
