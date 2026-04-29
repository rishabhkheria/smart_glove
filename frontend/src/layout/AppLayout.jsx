import { NavLink, Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="pageShell">
      <header className="topNav">
        <NavLink to="/" className="brandMark">
          Smart Glove
        </NavLink>

        <nav className="topLinks">
          <NavLink to="/">Hero</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/project-info">Project Info</NavLink>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="contentArea">
        <Outlet />
      </main>

      <footer id="contact" className="siteFooter">
        Built by Rishabh | Smart Glove Project
      </footer>
    </div>
  );
}

export default AppLayout;
