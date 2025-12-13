import { createContext, useEffect, useState } from "react";
import { commonSudokuBuilder } from "../utils/generator";
import { isValid } from "../utils/validator";
import { Mode, getModeByDifficulty } from "../constants/Mode";

export const SudokuContext = createContext();

export default function SudokuProvider(props) {
  const [mode, setMode] = useState(Mode.EASY.difficulty); // 'easy' or 'normal'
  const [initialBoard, setInitialBoard] = useState([[]]); // immutable cells
  const [board, setBoard] = useState([[]]);               // current board state
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

  // Initialize board on mount
  useEffect(() => {
    createNewGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a new puzzle
  function createNewGame(newmode = mode) {
    const board = commonSudokuBuilder(newmode);

    // Deep copy for initial state
    const newInitialBoard = board.map((row) => [...row]);

    setBoard(board);
    setInitialBoard(newInitialBoard);
    setMode(newmode);
    setSelectedCell(null);
    setIncorrectCells(new Set());
    setIsComplete(false);
    setTimer(0);
    setIsTimerRunning(true);
  }

  function resetBoard() {
    // Restore to initial state
    const resetBoard = initialBoard.map((row) => [...row]);
    setBoard(resetBoard);
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

  function inputValue(row, col, value) {
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
    setBoard(newBoard);
    setIncorrectCells(newIncorrectCells);

    // Check if board is complete
    checkCompletion(newBoard);
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

  function checkCompletion(board) {
    const size = board.length;

    // Check if all cells are filled
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) return;
      }
    }

    // Check if there are any invalid cells
    if (incorrectCells.size === 0) {
      setIsComplete(true);
      setIsTimerRunning(false);
    }
  }

  const globalDataAndFunctions = {
    createNewGame,
    resetBoard,
    selectCell,
    isCellEditable,
    isCellIncorrect,
    inputValue,
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
