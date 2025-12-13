import { useContext } from "react";
import { SudokuContext } from "./SudokuProvider";
import SudokuCell from "./SudokuCell";
import { getModeByDifficulty } from "../constants/Mode";
import "./SudokuBoard.css";

export default function SudokuBoard() {
  const { board, mode } = useContext(SudokuContext);
  const size = board.length;
  const currentMode = getModeByDifficulty(mode);
  const { boxHeight, boxWidth } = currentMode;

  const boardComponent = board.map((row, rowIdx) => {
    return (
      <div className="sudoku-row" key={rowIdx}>
        {row.map((_, colIdx) => {
          let cellClass = "";
          if ((colIdx + 1) % boxWidth === 0 && colIdx < size - 1) {
            cellClass += " boxBorderRight";
          }
          if ((rowIdx + 1) % boxHeight === 0 && rowIdx < size - 1) {
            cellClass += " boxBorderBottom";
          }
          return (
            <div className={cellClass} key={colIdx}>
              <SudokuCell x={rowIdx} y={colIdx} />
            </div>
          );
        })}
      </div>
    );
  });

  return <div className="sudoku-board">{boardComponent}</div>;
}
