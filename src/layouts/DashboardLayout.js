import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function DashboardLayout({ menuItems, children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  // Untuk close sidebar saat klik link di sidebar (mobile)
  const handleSidebarClose = () => setShowSidebar(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      <div className="flex-grow-1 d-flex" style={{ minHeight: "0" }}>
        <Sidebar
          menuItems={menuItems}
          show={showSidebar}
          onClose={handleSidebarClose}
        />
        <main className="flex-grow-1 p-4" style={{ minHeight: "calc(100vh - 120px)" }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
