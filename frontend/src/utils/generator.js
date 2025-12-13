import { getModeByDifficulty } from "../constants/Mode";
import { isValid } from "./validator";

export function commonSudokuBuilder(difficulty) {
  const mode = getModeByDifficulty(difficulty);
  const { size, keepCellsMin, keepCellsMax } = mode;
  
  // Step 1: Create an empty board
  const board = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  // Step 2: Fill the board with valid random numbers based on size
  const success = fillBoard(board, mode);
  if (!success) {
    throw new Error("Failed to generate a valid Sudoku board.");
  }

  // Step 3: Once the board is created, randomly remove cells to create the puzzle
  const cellsToRemove = size * size - getKeepCells(keepCellsMin, keepCellsMax);
  removeCells(board, cellsToRemove, size);
  
  return board;
}

function getKeepCells(keepCellsMin, keepCellsMax) {
  if (keepCellsMin === keepCellsMax) {
    return keepCellsMin;
  }
  
  return keepCellsMin + 
    Math.floor(Math.random() * (keepCellsMax - keepCellsMin + 1));
}

function removeCells(board, cellsToRemove, size) {
  const allCells = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      allCells.push([i, j]);
    }
  }
  
  // Shuffle using Fisher-Yates algorithm (more reliable than sort)
  shuffleArray(allCells);

  // Remove the required number of cells
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = allCells[i];
    board[row][col] = 0;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function fillBoard(board, mode) {
  const { size, boxHeight, boxWidth } = mode;

  // Backtracking function to create a valid sudoku board
  function backtrack(i = 0) {
    if (i === size * size) return true;

    const r = Math.floor(i / size);
    const c = i % size;

    const candidates = Array.from({ length: size }, (_, i) => i + 1).sort(
      () => Math.random() - 0.5
    );

    for (let num of candidates) {
      if (isValid(board, r, c, num, boxHeight, boxWidth)) {
        board[r][c] = num;
        if (backtrack(i + 1)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  }

  return backtrack();
}
