import { NavLink, Outlet } from "react-router-dom";
import logoUrl from "../assets/logo.png";

function AppLayout() {
  return (
    <div className="pageShell">
      <header className="topNav">
        <NavLink to="/" className="brandMark">
          <img 
            src={logoUrl} 
            alt="Smart Glove" 
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} 
          />
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
        <p>Built by <a href="https://www.linkedin.com/in/rishabh-kheria-670ab7263/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><span>Rishabh</span></a> | Smart Glove Project &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default AppLayout;
