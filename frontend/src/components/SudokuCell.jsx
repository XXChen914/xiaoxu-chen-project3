import { useContext } from "react";
import { SudokuContext } from "./SudokuProvider";
import "./SudokuCell.css";

export default function SudokuCell({ x, y }) {
  const {
    board,
    selectedCell,
    isCellEditable,
    isCellIncorrect,
    selectCell,
    inputValue,
    isComplete,
  } = useContext(SudokuContext);

  // Prevent crash during async load
  if (!board?.length || !board[x]) {
    return <div className="sudoku-cell loading" />;
  }

  const value = board[x][y];
  const isEditable = isCellEditable(x, y);
  const isIncorrect = isCellIncorrect(x, y);
  const isSelected = selectedCell?.row === x && selectedCell?.col === y;
  const maxValue = board.length;

  let className = "sudoku-cell";
  if (!isEditable) className += " fixed";
  if (isEditable && !isComplete) className += " editable";
  if (isSelected) className += " selected";
  if (isIncorrect) className += " incorrect";

  function handleSelect() {
    if (isEditable && !isComplete) {
      selectCell(x, y);
    }
  }

  function handleKeyDown(e) {
    if (!isEditable || isComplete) return;

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      inputValue(x, y, 0);
    }
  }

  function handleChange(e) {
    if (!isEditable || isComplete) return;

    const raw = e.target.value;
    if (raw === "") {
      inputValue(x, y, 0);
      return;
    }

    const digit = parseInt(raw.slice(-1), 10);
    if (!Number.isNaN(digit) && digit >= 1 && digit <= maxValue) {
      if (digit !== value) {
        inputValue(x, y, digit);
      }
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      value={value === 0 ? "" : String(value)}
      onClick={handleSelect}
      onFocus={handleSelect}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      disabled={isComplete}
      aria-label={`Row ${x + 1}, Column ${y + 1}`}
    />
  );
}
