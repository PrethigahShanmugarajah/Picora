// Client / src / components / Layout / AppLayout.jsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <Navbar />

      <Sidebar />

      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
