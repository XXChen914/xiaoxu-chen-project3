import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout.jsx";
import { SudokuContext } from "../components/SudokuProvider";
import { Mode } from "common/constants";
import "./Selection.css";

export default function Selection() {
  const { setMode, setGameId, setGameName } = useContext(SudokuContext);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all existing games
  const fetchGames = async () => {
    try {
      const { data } = await axios.get("/api/sudoku");
      setGames(data);
    } catch (err) {
      console.error("Error fetching games:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Create a new game and redirect
  const createGame = async (difficulty) => {
    try {
      const { data } = await axios.post("/api/sudoku", { difficulty });
      setMode(difficulty);
      setGameId(data.gameId);
      setGameName(data.gameName);
      navigate(`/game/${data.gameId}`);
    } catch (err) {
      console.error("Error creating game:", err.message);
    }
  };

  // Navigate to an existing game
  const goToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="selection-page">
      <Layout title="Game Selection" subtitle="Pick a game or create a new one">
        <div className="create-buttons">
          <button onClick={() => createGame(Mode.EASY.difficulty)}>
            Create Easy Game
          </button>
          <button onClick={() => createGame(Mode.NORMAL.difficulty)}>
            Create Normal Game
          </button>
        </div>

        <h2>Available Games</h2>
        {loading ? (
          <p>Loading games...</p>
        ) : games.length === 0 ? (
          <p>No games available yet. Create one!</p>
        ) : (
          <ul className="game-list">
            {games.map((game) => (
              <li
                key={game.gameId}
                className="game-item"
                onClick={() => goToGame(game.gameId)}
              >
                <div>
                  <strong>{game.gameName}</strong>
                  <div className="game-meta">
                    Created by {game.creator} · {game.createdAt}
                  </div>
                </div>
                <div>
                  <span className="small">{game.difficulty}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Layout>
    </div>
  );
}
