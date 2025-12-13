// import { useContext } from "react";
// import { SudokuContext } from "./SudokuProvider";
// import "./SudokuCell.css";

// export default function SudokuCell(props) {
//   const { x, y } = props;
//   const {
//     board,
//     selectedCell,
//     isCellEditable,
//     isCellIncorrect,
//     selectCell,
//     inputValue,
//     isComplete,
//   } = useContext(SudokuContext);

//   const value = board[x][y];
//   const isEditable = isCellEditable(x, y);
//   const isIncorrect = isCellIncorrect(x, y);
//   const isSelected = selectedCell?.row === x && selectedCell?.col === y;

//   let className = "sudoku-cell";
//   if (!isEditable) className += " fixed";
//   if (isSelected) className += " selected";
//   if (isIncorrect) className += " incorrect";
//   if (isEditable && !isComplete) className += " editable";

//   function handleKeyDown(e) {
//     if (!isSelected || !isEditable || isComplete) return;

//     const key = e.key;

//     if (key === "Backspace" || key === "Delete") {
//       e.preventDefault();
//       inputValue(x, y, 0);
//       return;
//     }

//     const size = board.length;
//     const digit = parseInt(key);
//     if (!Number.isNaN(digit) && digit >= 1 && digit <= size) {
//       e.preventDefault();
//       inputValue(x, y, digit);
//     }
//   }

//   return (
//     <div
//       className={className}
//       onClick={() => selectCell(x, y)}
//       onKeyDown={handleKeyDown}
//       tabIndex={isEditable ? 0 : -1}
//     >
//       {value !== 0 ? value : ""}
//     </div>
//   );
// }

import { useContext } from "react";
import { SudokuContext } from "./SudokuProvider";
import "./SudokuCell.css";

export default function SudokuCell(props) {
  const { x, y } = props;
  const {
    board,
    selectedCell,
    isCellEditable,
    isCellIncorrect,
    selectCell,
    inputValue,
    isComplete,
  } = useContext(SudokuContext);

  const value = board[x][y];
  const isEditable = isCellEditable(x, y);
  const isIncorrect = isCellIncorrect(x, y);
  const isSelected = selectedCell?.row === x && selectedCell?.col === y;

  const maxValue = board.length; // 6 for easy, 9 for normal

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

    const key = e.key;

    // Clear on Backspace/Delete
    if (key === "Backspace" || key === "Delete") {
      e.preventDefault();
      inputValue(x, y, 0);
      return;
    }
  }

  function handleChange(e) {
    if (!isEditable || isComplete) return;

    const raw = e.target.value;

    // If user clears the input, set 0 (empty)
    if (raw === "") {
      inputValue(x, y, 0);
      return;
    }

    // Take the last character typed
    const lastChar = raw[raw.length - 1];
    const digit = parseInt(lastChar, 10);

    if (!Number.isNaN(digit) && digit >= 1 && digit <= maxValue) {
      inputValue(x, y, digit);
    } else {
      // Invalid input → revert to previous valid
      e.target.value = value === 0 ? "" : String(value);
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
      readOnly={!isEditable || isComplete}
    />
  );
}
