import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-auto text-center"
      style={{
        background: "linear-gradient(90deg, #021b2e 50%, #04293d 100%)",
        color: "#00e5ff",
        boxShadow: "0 -2px 24px #00e6ff22, 0 -1.5px 12px #23e3d844",
        borderTop: "1.5px solid #00e5ff44",
        fontWeight: 600,
        fontSize: "1.06rem",
        letterSpacing: 0.3,
        padding: "15px 0 12px 0",
        userSelect: "none",
        position: "relative",
        zIndex: 100,
      }}
    >
      <div
        className="d-flex justify-content-center align-items-center gap-2"
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          textShadow: "0 2px 14px #00e5ff44"
        }}
      >
        <ShieldCheck size={21} style={{ color: "#00e5ff", marginBottom: 3 }} />
        <span>
          © 2025 <span className="fw-bold" style={{ color: "#22e3e3" }}>Politeknik Negeri Manado</span>
          {" "}• Sistem <span style={{ color: "#00e5ff" }}>E-SEKJUR</span> Jurusan Elektro
        </span>
      </div>
      <div
        className="mt-1"
        style={{
          fontSize: "0.99rem",
          color: "#bbf8ff",
          opacity: 0.7,
          letterSpacing: 0.13
        }}
      >
        Made with <span style={{ color: "#ff7296" }}>♥</span> by <b>Jurusan Elektro</b> • Powered by React
      </div>
    </footer>
  );
}
