import Layout from "../components/Layout.jsx";
import "./Rules.css";

export default function Rules() {
  return (
    <Layout title="Rules">
      <section className="hero">
        <h3>General Rules</h3>
        <ol className="rules-list">
          <li>
            Fill every row and column with the correct numbers (1-9 for 9×9, 1-6
            for 6×6).
          </li>
          <li>
            Each number may appear only once in each subgrid and each
            row/column.
          </li>
          <li>Use logic only — no guessing.</li>
        </ol>

        <h4>Scoring</h4>
        <p className="small">Scores are based on speed and accuracy.</p>

        <h4>Credits</h4>
        <div className="credits">
          <p>
            Made by <strong>Lucy Chen</strong>
          </p>
          <p>
            <a href="mailto:chen.xiaoxu@northeastern.edu">Email</a> •{" "}
            <a
              href="https://github.com/XXChen914"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>{" "}
            •{" "}
            <a
              href="https://www.linkedin.com/in/xxchen914"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
