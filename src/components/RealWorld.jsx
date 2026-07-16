export default function RealWorld({ title, children }) {
  return (
    <section className="realworld">
      <div className="realworld__head">
        <span className="realworld__badge">
          <span aria-hidden="true">🌍</span> In the real world
        </span>
        {title && <h3 className="realworld__title">{title}</h3>}
      </div>
      <div className="realworld__body">{children}</div>
    </section>
  );
}
