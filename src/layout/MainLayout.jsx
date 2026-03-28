import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <nav>
        <h2>Re-Mmogo</h2>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>© 2026</p>
      </footer>
    </div>
  );
}