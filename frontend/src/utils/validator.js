export function isValid(board, row, col, val, boxHeight, boxWidth) {
  const size = board.length;
  if (val === 0) return true;

  // Check row
  for (let x = 0; x < size; x++) {
    if (x !== col && board[row][x] === val) return false;
  }

  // Check column
  for (let x = 0; x < size; x++) {
    if (x !== row && board[x][col] === val) return false;
  }

  // Check box
  const boxR = Math.floor(row / boxHeight) * boxHeight;
  const boxC = Math.floor(col / boxWidth) * boxWidth;

  for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
      const currentRow = boxR + i;
      const currentCol = boxC + j;
      if (
        (currentRow !== row || currentCol !== col) &&
        board[currentRow][currentCol] === val
      )
        return false;
    }
  }

  return true;
}
