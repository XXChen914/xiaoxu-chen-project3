import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/games");
  };

  return (
    <main className="home-container">
      <section className="welcome-section">
        <h1>Welcome to Lucy's Sudoku</h1>
        <p>Sharpen your mind, relax, and enjoy the challenge.</p>
        <button type="button" className="start-btn" onClick={handleStartClick}>
          Start
        </button>
      </section>
    </main>
  );
}