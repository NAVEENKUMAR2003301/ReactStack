import { Link } from 'react-router-dom';

const CURRICULUM = [
  { slug: 'jsx', icon: '🧩', title: 'JSX & Rendering', text: 'Understand how React turns JSX into elements and renders them to the DOM.' },
  { slug: 'props', icon: '📦', title: 'Props', text: 'Pass read-only data from parent to child and compose components cleanly.' },
  { slug: 'state', icon: '🔁', title: 'State & useState', text: "Learn the fundamental hook for managing data that changes over time." },
  { slug: 'use-effect', icon: '🌐', title: 'Effects & useEffect', text: 'Master handling side-effects like data fetching and subscriptions.' },
  { slug: 'context', icon: '🛰️', title: 'Context API', text: 'Share data across your component tree without prop drilling.' },
  { slug: 'composition', icon: '🧱', title: 'Composition & Children', text: 'Build flexible, reusable components instead of deep prop-drilling.' },
  { slug: 'custom-hooks', icon: '🪝', title: 'Custom Hooks', text: 'Build your own hooks to encapsulate and reuse stateful logic.' },
  { slug: 'use-reducer', icon: '🧮', title: 'useReducer', text: 'Manage complex state transitions with actions and a pure reducer.' },
  { slug: 'performance', icon: '⚡', title: 'useMemo & useCallback', text: 'Memoize expensive values and skip needless re-renders.' },
  { slug: 'error-boundaries', icon: '🛡️', title: 'Error Boundaries', text: 'Catch render-time errors gracefully instead of crashing the app.' },
];

export default function CurriculumHighlights() {
  return (
    <section className="home-section">
      <div className="section-heading">
        <h2>Course Curriculum</h2>
        <p className="section-sub">Ten of the twenty lessons inside — from your first component to advanced patterns.</p>
      </div>
      <div className="curriculum-grid">
        {CURRICULUM.map((c) => (
          <Link key={c.slug} to={`/learn/${c.slug}`} className="curriculum-card">
            <span className="curriculum-card__icon" aria-hidden="true">{c.icon}</span>
            <div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
