import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { setToken, getUserFromToken } from "../../utils/auth";
import logoPolimdo from "../../assets/logo_polimdo.png";
import bg from "../../assets/background.jpg";
import { Lock, User, KeyRound, LogIn } from "lucide-react";

function LoginPage() {
  const [form, setForm] = useState({ role: "", nipOrNim: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        role: form.role.toLowerCase(),
        username: form.nipOrNim, // untuk semua role (admin pakai username, lain tetap nim/nip)
        password: form.password,
      };

      const res = await loginUser(credentials); // res = { token, user }
      setToken(res.token);


      const user = getUserFromToken();
      if (!user || !user.role) throw new Error("Token tidak valid");

      localStorage.setItem("role", user.role);

      switch (user.role) {
        case "mahasiswa":
          navigate("/mahasiswa/landing");
          break;
        case "sekjur":
          navigate("/sekjur/landing");
          break;
        case "prodi":
          navigate("/prodi/landing");
          break;
        case "dosen":
          navigate("/dosen/landing");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      setError(err.message || "Login gagal");
    }
  };

  // Neon animated overlay style
  const neonOverlay = {
    position: "fixed",
    zIndex: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse 110% 70% at 70% 0,#00e6ff44 10%,transparent 100%)," +
      "radial-gradient(ellipse 140% 85% at 0 100%,#22e3e344 5%,transparent 85%)",
    animation: "bgMove 12s ease-in-out infinite alternate",
    filter: "blur(14px)",
    opacity: 0.95
  };

  // Neon border for card
  const neonCardBorder = {
    border: "2px solid #00e6ff55",
    boxShadow: "0 10px 32px 2px #00eaff38, 0 1.5px 16px 0 #b1f6fd19"
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        transition: "background-image 0.5s",
        zIndex: 1,
      }}
    >
      {/* Neon Animated Overlay */}
      <div style={neonOverlay} />
      {/* Glass Card */}
      <div
        className="card shadow-lg border-0 w-100 position-relative"
        style={{
          ...neonCardBorder,
          maxWidth: 440,
          width: "100%",
          borderRadius: 30,
          margin: "30px 10px",
          background: "rgba(255,255,255,0.84)",
          backdropFilter: "blur(13px)",
          boxShadow: "0 8px 36px 2px rgba(30,30,80,0.20)"
        }}
      >
        <div className="card-body px-4 py-4">
          {/* Logo & Heading */}
          <div className="text-center mb-4 mt-1">
            <div
              style={{
                background: "linear-gradient(135deg, #00e5ff22 0%, #eefcff22 100%)",
                borderRadius: "50%",
                padding: 6,
                marginBottom: 9,
                boxShadow: "0 2px 12px #00e5ff24",
                display: "inline-block"
              }}
            >
              <img
                src={logoPolimdo}
                alt="Logo Polimdo"
                style={{
                  width: 62,
                  height: 62,
                  objectFit: "contain",
                  borderRadius: 18,
                  background: "#fff",
                  boxShadow: "0 2px 12px #1b356f22"
                }}
              />
            </div>
            <h3
              className="fw-bold mb-1 mt-2"
              style={{
                color: "#00e6ff",
                textShadow: "0 2px 18px #00e6ff44, 0 1px 6px #1b1b5d19"
              }}
            >
              Sistem E-Sekjur
            </h3>
            <div
              className="small text-secondary mb-2"
              style={{ letterSpacing: 1.2, fontWeight: 500 }}
            >
              Jurusan Elektro, Politeknik Negeri Manado
            </div>
            <span
              className="badge bg-primary mb-3"
              style={{
                fontSize: "14px",
                padding: "8px 20px",
                letterSpacing: 1.1,
                borderRadius: 8,
                boxShadow: "0 2px 9px #00e6ff17"
              }}
            >
              <Lock size={15} className="me-1 mb-1" /> LOGIN DASHBOARD
            </span>
          </div>
          {error && (
            <div className="alert alert-danger py-2" style={{ fontSize: 15 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="role">
                <User size={17} className="mb-1 me-1" /> Role
              </label>
              <select
                id="role"
                name="role"
                className="form-select"
                onChange={handleChange}
                required
                value={form.role}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              >
                <option value="">-- Pilih Role --</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="sekjur">Sekjur</option>
                <option value="prodi">Prodi</option>
                <option value="dosen">Dosen</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="nipOrNim">
                <KeyRound size={16} className="mb-1 me-1" /> NIM / NIP 
              </label>
              <input
                id="nipOrNim"
                name="nipOrNim"
                className="form-control"
                placeholder="Masukkan NIM/NIP/Username"
                autoComplete="username"
                onChange={handleChange}
                required
                value={form.nipOrNim}
                inputMode="text"
                spellCheck={false}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="password">
                <Lock size={15} className="mb-1 me-1" /> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={handleChange}
                required
                value={form.password}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            <button
                className="btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                type="submit"
                style={{
                  borderRadius: 16,
                  fontSize: 17,
                  background: "linear-gradient(90deg, #0098ff 30%, #2250e7 90%)",
                  boxShadow: "0 2px 16px #00aaff22",
                  letterSpacing: 0.8,
                  color: "#fff",
                  fontWeight: 700,
                  border: "none",
                  outline: "none",
                  transition: "background 0.25s, box-shadow 0.25s, transform 0.15s"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #006fcb 20%, #1237a3 90%)";
                  e.currentTarget.style.boxShadow = "0 4px 28px #0098ff55";
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "linear-gradient(90deg, #0098ff 30%, #2250e7 90%)";
                  e.currentTarget.style.boxShadow = "0 2px 16px #00aaff22";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <LogIn size={19} /> Login
              </button>

            <div className="text-center mt-3">
              <span className="text-secondary small">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="fw-semibold text-decoration-none text-primary"
                >
                  Daftar disini
                </a>
              </span>
            </div>
          </form>
        </div>
        <div
          className="card-footer border-0 text-center small"
          style={{
            borderRadius: "0 0 30px 30px",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: 0.7,
            paddingTop: 10,
            paddingBottom: 12,
            background: "rgba(255,255,255,0.77)",
            backdropFilter: "blur(4px)",
            color: "#22a7c3"
          }}
        >
          <span style={{ letterSpacing: 1.2 }}>
            © {new Date().getFullYear()} Made with <span style={{ color: "#ff7296" }}>♥</span> by <b>Devin Pitoy</b> &mdash; E-SEKJUR
          </span>
        </div>
      </div>
      {/* Animated neon keyframes (add to your global css) */}
      <style>
        {`
        @keyframes bgMove {
          0% { background-position: 50% 0, 0 100%; }
          100% { background-position: 65% 35%, 20% 70%; }
        }
        `}
      </style>
    </div>
  );
}

export default LoginPage;
