import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' in window.scrollTo ? 'instant' : 'auto' });
  }, [location.pathname]);

  return (
    <div className="shell">
      <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} sidebarOpen={sidebarOpen} />
      <div className="layout">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <button
          type="button"
          className={`scrim${sidebarOpen ? ' open' : ''}`}
          aria-hidden={!sidebarOpen}
          tabIndex={-1}
          onClick={() => setSidebarOpen(false)}
        />
        <main className="content" id="main-content">
          <div className="content__inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
