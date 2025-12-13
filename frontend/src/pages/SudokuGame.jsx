import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SudokuContext } from "../components/SudokuProvider";
import SudokuBoard from "../components/SudokuBoard";
import { Mode, getModeByDifficulty } from "../constants/Mode";
import "./SudokuGame.css";

export default function SudokuGame() {
  const { difficulty } = useParams();
  const {
    createNewGame,
    resetBoard,
    inputValue,
    selectedCell,
    timer,
    isComplete,
    mode,
  } = useContext(SudokuContext);

  // Sync URL difficulty with context mode
  useEffect(() => {
    if (difficulty && difficulty !== mode) {
      createNewGame(difficulty);
    }
  }, [difficulty, mode, createNewGame]);

  const maxValue = getModeByDifficulty(mode).size;

  // Header text based on mode
  const isEasy = mode === Mode.EASY.difficulty;
  const titleText = isEasy ? "Easy Game — 6×6" : "Normal Game — 9×9";
  const subtitleText = isEasy
    ? "Kick off your Sudoku journey!"
    : "Challenge yourself with the full Sudoku grid!";

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  function handleNumberClick(num) {
    if (selectedCell && !isComplete) {
      inputValue(selectedCell.row, selectedCell.col, num);
    }
  }

  function handleClear() {
    if (selectedCell && !isComplete) {
      inputValue(selectedCell.row, selectedCell.col, 0);
    }
  }

  const numberButtons = [];
  for (let i = 1; i <= maxValue; i++) {
    numberButtons.push(
      <button
        key={i}
        className="sudoku-game__number-button"
        onClick={() => handleNumberClick(i)}
        disabled={isComplete}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="sudoku-game">
      <header className="sudoku-game__header">
        <h1 className="sudoku-game__title">{titleText}</h1>
        <p className="sudoku-game__subtitle">{subtitleText}</p>

        <div className="sudoku-game__timer">
          Time: <span>{formatTime(timer)}</span>
        </div>

        {isComplete && (
          <div className="sudoku-game__congratulations">
            Congratulations! You solved the puzzle!
          </div>
        )}
      </header>

      <main className="sudoku-game__main">
        <SudokuBoard />

        <section className="sudoku-game__number-pad">
          {numberButtons}
          <button
            className="sudoku-game__number-button sudoku-game__number-button--clear"
            onClick={handleClear}
            disabled={isComplete}
          >
            Clear
          </button>
        </section>

        <section className="sudoku-game__controls">
          <button
            className="sudoku-game__control-button sudoku-game__control-button--new"
            onClick={() => createNewGame(mode)}
          >
            New Game
          </button>
          <button
            className="sudoku-game__control-button sudoku-game__control-button--reset"
            onClick={resetBoard}
          >
            Reset
          </button>
        </section>
      </main>
    </div>
  );
}
