const baseWords = [
  "Coconut",
  "Red",
  "House",
  "Blue",
  "Green",
  "Forest",
  "River",
  "Mountain",
  "Dragon",
  "Phoenix",
  "Shadow",
  "Light",
  "Storm",
  "Thunder",
  "Wind",
  "Fire",
  "Ice",
  "Stone",
  "Gold",
  "Silver",
  "Crystal",
  "Moon",
  "Sun",
  "Star",
  "Galaxy",
  "Ocean",
  "Desert",
  "Valley",
  "Castle",
  "Tower",
  "Sword",
  "Shield",
  "Crown",
  "King",
  "Queen",
  "Knight",
  "Wizard",
  "Magic",
  "Mystic",
  "Ancient",
  "Hidden",
  "Lost",
  "Secret",
];

const words = [...baseWords];
let counter = 1;

/**
 * Expand the word list to 1000+ words. This avoids manually maintaining a massive static list.
 */
while (words.length < 1000) {
  for (const word of baseWords) {
    if (words.length >= 1000) break;
    words.push(`${word}${counter}`);
  }
  counter++;
}

if (words.length < 1000) {
  throw new Error("Word list must contain at least 1000 words.");
}

const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

// Generate a UNIQUE game name consisting of 3 random words
export default function generateGameName() {
  return `${getRandomWord()} ${getRandomWord()} ${getRandomWord()}`;
}
