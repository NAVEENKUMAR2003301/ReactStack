export default function DemoCard({ label = 'Live demo', children }) {
  return (
    <div className="demo">
      <div className="demo__label">
        <span className="dot" aria-hidden="true" />
        {label}
      </div>
      <div className="demo__stage">{children}</div>
    </div>
  );
}
