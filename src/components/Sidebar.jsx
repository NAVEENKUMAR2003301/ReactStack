import { NavLink } from 'react-router-dom';
import { LEVELS, TOPICS } from '../data/topics';

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`} id="sidebar" aria-label="Topic navigation">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
        style={{ marginBottom: 'var(--space-4)' }}
      >
        <span aria-hidden="true">🏠</span> Home
      </NavLink>

      {Object.entries(LEVELS).map(([levelKey, level]) => (
        <div className="sidebar__group" key={levelKey}>
          <div className="sidebar__group-title">{level.label}</div>
          {TOPICS.filter((t) => t.level === levelKey).map((topic, i) => (
            <NavLink
              key={topic.slug}
              to={`/learn/${topic.slug}`}
              onClick={onNavigate}
              className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar__num">{String(i + 1).padStart(2, '0')}</span>
              <span aria-hidden="true">{topic.icon}</span>
              <span>{topic.title}</span>
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
