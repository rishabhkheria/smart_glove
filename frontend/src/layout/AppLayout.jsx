import { NavLink, Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="pageShell">
      <header className="topNav">
        <NavLink to="/" className="brandMark">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
          </svg>
          Smart Glove
        </NavLink>

        <nav className="topLinks">
          <NavLink to="/" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/project-info" className={({ isActive }) => `navLink ${isActive ? 'active' : ''}`}>
            Architecture
          </NavLink>
        </nav>
      </header>

      <main className="contentArea">
        <Outlet />
      </main>

      <footer className="siteFooter">
        <p>Built by <span>Rishabh</span> | Smart Glove Project &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default AppLayout;
