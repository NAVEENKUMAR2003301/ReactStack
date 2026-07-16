const ICONS = { tip: '💡', warn: '⚠️', why: '🤔' };

export default function Callout({ type = 'tip', title, children }) {
  return (
    <div className={`callout callout--${type}`} role="note">
      <span className="callout__icon" aria-hidden="true">{ICONS[type]}</span>
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 4, color: 'var(--heading)' }}>{title}</strong>}
        {children}
      </div>
    </div>
  );
}
