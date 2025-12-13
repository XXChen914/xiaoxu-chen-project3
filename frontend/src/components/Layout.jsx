export default function Layout({ title, subtitle, children }) {
  return (
    <main className="container">
      <header className="page-header">
        <h1>{title}</h1>
        {subtitle && <span className="small">{subtitle}</span>}
      </header>

      <section>{children}</section>
    </main>
  );
}
