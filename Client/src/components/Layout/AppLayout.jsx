/* eslint-disable no-unused-vars */
// Client / src / components / Layout / AppLayout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setIsUploadOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
      />

      <Sidebar />

      <main className="app-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
