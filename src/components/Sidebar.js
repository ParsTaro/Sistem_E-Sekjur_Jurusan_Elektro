import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "lucide-react";

const ACCENT = "#00d9ff";
const ACCENT_LIGHT = "#e7fcff";
const MENU_COLOR = "#1e293b";
const RADIUS = "22px";
const BG_GLASS = "linear-gradient(120deg, #e7fcffcc 0%, #00d9ff22 100%)";
const BG_GLASS_ACTIVE = "linear-gradient(90deg,#e0f8ffb9 0%, #a8f0ff42 100%)";
const BORDER_GLASS = "1.5px solid rgba(0,217,255,0.07)";
const HEADER_HEIGHT = 62;
const SIDEBAR_OVERLAP = 24;
const FOOTER_HEIGHT = 50;

function Sidebar({ menuItems, show, onClose }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const renderMenu = () => (
    <Nav className="flex-column py-2 px-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <span className="fw-bold mb-3 ms-1" style={{ fontSize: 20, color: ACCENT }}>
        Menu
      </span>
      {menuItems.map((item, idx) => {
        // Dropdown
        if (item.type === "dropdown") {
          return (
            <div key={item.label} className="mb-2">
              <button
                className="nav-link btn btn-link w-100 text-start px-2 py-2"
                style={{
                  fontWeight: 600,
                  color: openDropdown === idx ? ACCENT : MENU_COLOR,
                  background: openDropdown === idx ? ACCENT_LIGHT : "transparent",
                  borderRadius: RADIUS,
                  boxShadow: openDropdown === idx ? `0 2px 14px ${ACCENT}11` : undefined,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.23s cubic-bezier(.51,2,.54,.86)",
                  transform: openDropdown === idx ? "scale(1.035)" : "scale(1)",
                }}
                onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
              >
                {item.icon}
                {item.label}
                <span className="ms-auto">
                  {openDropdown === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>
              {openDropdown === idx && (
                <div className="ps-3">
                  {item.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className="nav-link py-2 d-flex align-items-center"
                      style={{
                        fontWeight: location.pathname === child.path ? 700 : 500,
                        color: location.pathname === child.path ? ACCENT : MENU_COLOR,
                        background: location.pathname === child.path ? BG_GLASS_ACTIVE : "transparent",
                        borderRadius: RADIUS,
                        marginBottom: 2,
                        boxShadow: location.pathname === child.path ? `0 2px 14px ${ACCENT}1e` : undefined,
                        transform: location.pathname === child.path ? "scale(1.04)" : "scale(1)",
                        transition: "all 0.15s"
                      }}
                      onClick={() => {
                        if (window.innerWidth < 768) onClose();
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = ACCENT_LIGHT;
                        e.currentTarget.style.transform = "scale(1.032)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = location.pathname === child.path ? BG_GLASS_ACTIVE : "transparent";
                        e.currentTarget.style.transform = location.pathname === child.path ? "scale(1.04)" : "scale(1)";
                      }}
                    >
                      {child.icon && (
                        <span style={{ marginRight: 7, display: "inline-flex", alignItems: "center" }}>
                          {child.icon}
                        </span>
                      )}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }
        // Single Link
        else {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="nav-link py-2 px-2 mb-2 d-flex align-items-center"
              style={{
                fontWeight: isActive ? 700 : 500,
                color: isActive ? ACCENT : MENU_COLOR,
                background: isActive ? BG_GLASS_ACTIVE : "transparent",
                borderRadius: RADIUS,
                boxShadow: isActive ? `0 4px 22px ${ACCENT}1e` : undefined,
                transform: isActive ? "scale(1.04)" : "scale(1)",
                transition: "all 0.18s"
              }}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(90deg,#e7fcff 0%, #c7f7fd 100%)";
                e.currentTarget.style.transform = "scale(1.032)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isActive ? BG_GLASS_ACTIVE : "transparent";
                e.currentTarget.style.transform = isActive ? "scale(1.04)" : "scale(1)";
              }}
            >
              {item.icon}
              <span style={{ flexGrow: 1 }}>{item.label}</span>
              {item.badgeCount && (
                <span
                  style={{
                    background: ACCENT,
                    color: "#16181d",
                    borderRadius: "12px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    fontSize: 13,
                    marginLeft: 8,
                    minWidth: 22,
                    textAlign: "center",
                    boxShadow: `0 1px 8px ${ACCENT}33`
                  }}
                >
                  {item.badgeCount > 99 ? "99+" : item.badgeCount}
                </span>
              )}
            </Link>
          );
        }
      })}
    </Nav>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className="d-none d-md-flex"
        style={{
          width: 260,
          position: "sticky",
          top: HEADER_HEIGHT - SIDEBAR_OVERLAP,
          height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT - SIDEBAR_OVERLAP}px)`,
          zIndex: 101,
          flexDirection: "column",
          justifyContent: "flex-start",
          background: BG_GLASS,
          borderRight: BORDER_GLASS,
          boxShadow: "8px 0 32px rgba(0,0,0,0.09)",
          borderRadius: `0 ${RADIUS} ${RADIUS} 28px`,
          backdropFilter: "blur(12px)",
          marginTop: 0,
          marginBottom: 12,
          marginLeft: 6,
          borderTop: `3px solid ${ACCENT}`,
        }}
      >
        {renderMenu()}
      </aside>

      {/* Sidebar Mobile */}
      {show && (
        <div>
          {/* Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 103,
              background: "rgba(16,30,51,0.39)",
              backdropFilter: "blur(5px)",
              transition: "background 0.28s"
            }}
            onClick={onClose}
          />
          {/* Sidebar Slide In */}
          <div
            className="position-fixed top-0 start-0 animate-sidebar"
            style={{
              width: 260,
              height: "100vh",
              background: BG_GLASS,
              borderRight: "2.5px solid #00d9ff44",
              zIndex: 104,
              boxShadow: "12px 0 32px 0 #00d9ff36, 0 2px 20px #0af7fd13",
              borderRadius: `0 ${RADIUS} ${RADIUS} 0`,
              backdropFilter: "blur(20px)",
              overflowY: "auto",
              transform: "translateX(0)",
              animation: "slideSidebarIn 0.38s cubic-bezier(.52,1.6,.48,.94)"
            }}
          >
            <div className="d-flex justify-content-end p-2">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={onClose}
                style={{
                  borderRadius: "100px",
                  fontWeight: 700,
                  boxShadow: "0 1px 8px #00d9ff22",
                }}
              >
                ✕
              </button>
            </div>
            {renderMenu()}
          </div>
          <style>
            {`
              @keyframes slideSidebarIn {
                0% { transform: translateX(-120%); opacity: 0; }
                65% { transform: translateX(16px) scale(1.03); }
                92% { transform: translateX(-3px) scale(1.00); }
                100% { transform: translateX(0); opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}

export default Sidebar;
