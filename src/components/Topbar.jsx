import { Link } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';

export default function Topbar({ onMenuClick, sidebarOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn menu-btn"
        aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        onClick={onMenuClick}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <Link to="/" className="topbar__brand">
        <span className="topbar__brand-mark" aria-hidden="true">⚛</span>
        React Atlas
      </Link>

      <div className="topbar__spacer" />

      <button
        type="button"
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
