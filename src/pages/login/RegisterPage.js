import React, { useState } from "react";
import { registerMahasiswa } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import logoPolimdo from "../../assets/logo_polimdo.png";
import bg from "../../assets/background.jpg";
import { User, KeyRound, LogIn, CheckCircle2 } from "lucide-react";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",        // Sekarang username, bukan nim!
    nama: "",
    password: "",
    confirmPassword: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    email: "",
    jurusan: "",
    prodi: "",
    angkatan: "",
    jenis_kelamin: "L",  // default: Laki-laki
    no_telp: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok");
      return;
    }
    try {
      // Kirim form ke service
      await registerMahasiswa(form);
      setSuccess("Registrasi berhasil, silakan login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Neon overlay (background animated)
  const neonOverlay = {
    position: "fixed",
    zIndex: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    background:
      "radial-gradient(ellipse 110% 70% at 80% 0,#00e6ff33 10%,transparent 100%)," +
      "radial-gradient(ellipse 120% 100% at 0 110%,#ff418855 5%,transparent 95%)",
    animation: "bgMove 13s ease-in-out infinite alternate",
    filter: "blur(13px)",
    opacity: 0.88
  };

  const neonCardBorder = {
    border: "2px solid #00e6ff55",
    boxShadow: "0 10px 32px 2px #00eaff30, 0 1.5px 16px 0 #b1f6fd16"
  };

  const cardBodyStyle = window.innerWidth > 576
    ? { padding: "2rem 2.5rem" }
    : { padding: "1.5rem" };

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
        <div className="card-body" style={cardBodyStyle}>
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
              className="badge bg-success mb-3"
              style={{
                fontSize: "14px",
                padding: "8px 20px",
                letterSpacing: 1.1,
                borderRadius: 8,
                boxShadow: "0 2px 9px #00e6ff17"
              }}
            >
              <CheckCircle2 size={15} className="me-1 mb-1" /> REGISTER MAHASISWA
            </span>
          </div>
          {error && (
            <div className="alert alert-danger py-2" style={{ fontSize: 15 }}>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success py-2" style={{ fontSize: 15 }}>
              {success}
            </div>
          )}
          <form onSubmit={handleRegister} autoComplete="on">
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                <User size={17} className="mb-1 me-1" /> Username / NIM
              </label>
              <input
                id="username"
                name="username"
                className="form-control"
                placeholder="Masukkan Username/NIM"
                onChange={handleChange}
                required
                value={form.username}
                autoComplete="username"
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nama" className="form-label fw-semibold">
                <User size={16} className="mb-1 me-1" /> Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                className="form-control"
                placeholder="Masukkan Nama Lengkap"
                onChange={handleChange}
                required
                value={form.nama}
                autoComplete="name"
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            {/* --- Field Mahasiswa Lengkap --- */}
            <div className="mb-3">
              <label htmlFor="tempat_lahir" className="form-label fw-semibold">
                Tempat Lahir
              </label>
              <input
                id="tempat_lahir"
                name="tempat_lahir"
                className="form-control"
                placeholder="Tempat lahir"
                onChange={handleChange}
                value={form.tempat_lahir}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tanggal_lahir" className="form-label fw-semibold">
                Tanggal Lahir
              </label>
              <input
                id="tanggal_lahir"
                name="tanggal_lahir"
                type="date"
                className="form-control"
                onChange={handleChange}
                value={form.tanggal_lahir}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="alamat" className="form-label fw-semibold">
                Alamat
              </label>
              <input
                id="alamat"
                name="alamat"
                className="form-control"
                placeholder="Alamat domisili"
                onChange={handleChange}
                value={form.alamat}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Email aktif"
                onChange={handleChange}
                value={form.email}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jurusan" className="form-label fw-semibold">
                Jurusan
              </label>
              <input
                id="jurusan"
                name="jurusan"
                className="form-control"
                placeholder="Jurusan"
                onChange={handleChange}
                value={form.jurusan}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="prodi" className="form-label fw-semibold">
                Program Studi
              </label>
              <input
                id="prodi"
                name="prodi"
                className="form-control"
                placeholder="Program Studi"
                onChange={handleChange}
                value={form.prodi}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="angkatan" className="form-label fw-semibold">
                Angkatan
              </label>
              <input
                id="angkatan"
                name="angkatan"
                className="form-control"
                placeholder="Tahun angkatan"
                onChange={handleChange}
                value={form.angkatan}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jenis_kelamin" className="form-label fw-semibold">
                Jenis Kelamin
              </label>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                className="form-select"
                value={form.jenis_kelamin}
                onChange={handleChange}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="no_telp" className="form-label fw-semibold">
                No. Telepon
              </label>
              <input
                id="no_telp"
                name="no_telp"
                className="form-control"
                placeholder="No HP aktif"
                onChange={handleChange}
                value={form.no_telp}
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef"
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                <KeyRound size={15} className="mb-1 me-1" /> Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Buat password"
                onChange={handleChange}
                required
                value={form.password}
                autoComplete="new-password"
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">
                <KeyRound size={15} className="mb-1 me-1" /> Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Ulangi password"
                onChange={handleChange}
                required
                value={form.confirmPassword}
                autoComplete="new-password"
                style={{
                  borderRadius: 10,
                  background: "#f8fdff",
                  border: "1.5px solid #b8e3ef",
                  fontWeight: 500
                }}
              />
            </div>
            {/* Tombol DAFTAR */}
            <button
              className="btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              type="submit"
              style={{
                borderRadius: 16,
                fontSize: 17,
                background: "linear-gradient(92deg,#ff4b2b 20%,#ff416c 90%)",
                boxShadow: "0 2px 16px #ff4b2b22",
                letterSpacing: 0.8,
                color: "#fff",
                fontWeight: 700,
                border: "none",
                outline: "none",
                transition: "background 0.25s, box-shadow 0.25s, transform 0.15s"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "linear-gradient(90deg,#b1001f 30%,#c74077 100%)";
                e.currentTarget.style.boxShadow = "0 4px 28px #ff4b2b44";
                e.currentTarget.style.transform = "scale(1.04)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "linear-gradient(92deg,#ff4b2b 20%,#ff416c 90%)";
                e.currentTarget.style.boxShadow = "0 2px 16px #ff4b2b22";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <LogIn size={19} /> Daftar
            </button>
            <div className="text-center mt-3">
              <span className="text-secondary small">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="fw-semibold text-decoration-none text-danger"
                >
                  Login disini
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
            © {new Date().getFullYear()} Jurusan Elektro Polimdo &mdash; E-SEKJUR
          </span>
        </div>
      </div>
      <style>
        {`
        @keyframes bgMove {
          0% { background-position: 60% 0, 0 100%; }
          100% { background-position: 82% 22%, 30% 60%; }
        }
        `}
      </style>
    </div>
  );
}

export default RegisterPage;
