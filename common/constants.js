export const Mode = Object.freeze({
  EASY: {
    difficulty: "easy",
    size: 6,
    boxHeight: 2,
    boxWidth: 3,
    keepCellsMin: 18,
    keepCellsMax: 18,
  },

  NORMAL: {
    difficulty: "normal",
    size: 9,
    boxHeight: 3,
    boxWidth: 3,
    keepCellsMin: 28,
    keepCellsMax: 30,
  },
});

export function getModeByDifficulty(difficulty) {
  if (difficulty === Mode.EASY.difficulty) return Mode.EASY;
  if (difficulty === Mode.NORMAL.difficulty) return Mode.NORMAL;
  throw new Error(`Unsupported difficulty: ${difficulty}`);
}
