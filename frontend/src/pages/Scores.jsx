import Layout from "../components/Layout.jsx";
import "./Scores.css";

export default function Scores() {
  const scores = [
    { rank: 1, username: "master", gamesCompleted: 142 },
    { rank: 2, username: "grid_guru", gamesCompleted: 121 },
    { rank: 3, username: "number_ninja", gamesCompleted: 110 },
    { rank: 4, username: "lil_solver", gamesCompleted: 98 },
    { rank: 5, username: "random_player", gamesCompleted: 72 },
  ];

  return (
    <div className="scores-page">
      <Layout title="Top 5 Scores">
        <table className="score-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Games Completed</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((row) => (
              <tr key={row.rank}>
                <td className="rank">{row.rank}</td>
                <td>{row.username}</td>
                <td>{row.gamesCompleted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}
