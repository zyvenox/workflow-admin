import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import "./Layout.css";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      )}

      <div className="app-main">
        <Header onMenuClick={toggleSidebar} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;