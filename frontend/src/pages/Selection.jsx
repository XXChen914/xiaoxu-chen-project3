// src/pages/Selection.jsx
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import "./Selection.css";

export default function Selection() {
  const navigate = useNavigate();

  const goEasy = () => navigate("/games/easy");
  const goNormal = () => navigate("/games/normal");

  return (
    <div className="selection-page">
      <Layout title="Game Selection" subtitle="Pick a game">
        <ul className="game-list">

          {/* EASY GAME */}
          <li className="game-item" onClick={goEasy}>
            <div>
              <strong>Easy Sudoku</strong>
              <div className="game-meta">6×6 grid · Great for warm-up</div>
            </div>
            <div>
              <span className="small">Easy</span>
            </div>
          </li>

          <li className="game-item" onClick={goNormal}>
            <div>
              <strong>Normal Sudoku</strong>
              <div className="game-meta">9×9 grid · Challenge yourself</div>
            </div>
            <div>
              <span className="small">Normal</span>
            </div>
          </li>

        </ul>
      </Layout>
    </div>
  );
}
