import React from "react";
import logo from "../assets/logo_polimdo.png";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

function Header({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header
      className="px-2 px-sm-4"
      style={{
        height: 58,
        position: "sticky",
        top: 0,
        zIndex: 102,
        background: "rgba(10, 14, 32, 0.97)",
        boxShadow: "0 6px 16px #00e6ff13",
        backdropFilter: "blur(8px)",
        minWidth: 0,
        width: "100%",
      }}
    >
      {/* Desktop */}
      <div className="d-none d-md-flex align-items-center justify-content-between" style={{ height: 58 }}>
        <div className="d-flex align-items-center gap-2">
          <img
            src={logo}
            alt="Logo Polimdo"
            height={34}
            style={{
              borderRadius: "50%",
              marginRight: 8,
              background: "#fff",
            }}
          />
          <span
            style={{
              color: "#00e5ff",
              fontWeight: 900,
              fontSize: "1.12rem",
              letterSpacing: 1,
              whiteSpace: "nowrap",
              textShadow: "0 0 6px #00e6ff33",
            }}
          >
            E-SEKJUR JURUSAN ELEKTRO
          </span>
        </div>
        <button
          className="btn d-flex align-items-center gap-2 px-3 fw-bold"
          onClick={handleLogout}
          style={{
            background: "linear-gradient(92deg,#ff4b2b 20%,#ff416c 90%)",
            color: "#fff",
            borderRadius: 100,
            fontWeight: 700,
            letterSpacing: 0.3,
            border: "none",
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      {/* Mobile */}
      <div className="d-flex d-md-none align-items-center justify-content-center position-relative" style={{ height: 58 }}>
        <button
          className="btn me-2 px-2 py-1"
          style={{
            background: "#00e5ff",
            color: "#16181d",
            borderRadius: "100px",
            fontWeight: 700,
            border: "none",
            position: "absolute",
            left: 5,
            zIndex: 111,
          }}
          onClick={onToggleSidebar}
        >
          <Menu size={22} />
        </button>
        <img
          src={logo}
          alt="Logo Polimdo"
          height={31}
          style={{
            borderRadius: "50%",
            marginRight: 7,
            background: "#fff",
          }}
        />
        <span
          style={{
            color: "#00e5ff",
            fontWeight: 800,
            fontSize: "1.05rem",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            textShadow: "0 0 6px #00e6ff33",
          }}
        >
          E-SEKJUR JURUSAN ELEKTRO
        </span>
        <button
          className="btn ms-auto px-2 py-1"
          onClick={handleLogout}
          style={{
            background: "linear-gradient(92deg,#ff4b2b 20%,#ff416c 90%)",
            color: "#fff",
            borderRadius: 100,
            fontWeight: 700,
            border: "none",
            marginLeft: "auto",
            marginRight: 0,
            position: "absolute",
            right: 9,
          }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

export default Header;
