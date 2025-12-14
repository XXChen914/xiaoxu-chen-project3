import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout.jsx";
import "./Scores.css";

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await axios.get("/api/highscore");
        const data = response.data;

        const ranked = data.map((item, index) => ({
          rank: index + 1,
          gameName: item.gameName,
          totalCompletions: item.totalCompletions,
        }));

        setScores(ranked);
      } catch (err) {
        console.error("Error fetching scores:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, []);

  if (loading) return <Layout title="Score Rank">Loading...</Layout>;

  return (
    <div className="scores-page">
      <Layout title="Score Rank">
        <div className="score-list">
          {scores.map((row) => (
            <div key={row.rank} className={`score-card rank-${row.rank}`}>
              <div className="rank">{row.rank}</div>
              <div className="game-name">{row.gameName}</div>
              <div className="completions">
                {row.totalCompletions} completions
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </div>
  );
}
