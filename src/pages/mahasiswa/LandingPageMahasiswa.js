import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { menuByRole } from "../../constants/sidebarMenu";
import backgroundImage from "../../assets/bg-hero.jpg";
import { GraduationCap } from "lucide-react"; // Pastikan lucide-react sudah diinstall
import { getUserFromToken } from "../../utils/auth"; // ✅ import nama dari token

export default function LandingPageMahasiswa() {

  const user = getUserFromToken(); // Ambil nama dari token
  const nama = user?.nama || "Mahasiswa";

  return (
    <DashboardLayout menuItems={menuByRole["mahasiswa"]}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "92vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Overlay: gradient biru + glass */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(120deg, rgba(0,217,255,0.18) 0%, rgba(16, 18, 31, 0.76) 100%)",
            backdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        />

        {/* Glass Card + animasi masuk */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "52px 36px",
            minWidth: 340,
            maxWidth: 500,
            background: "rgba(22, 22, 25, 0.65)",
            borderRadius: "2.3rem",
            boxShadow: "0 10px 40px 0 rgba(0,217,255,0.10), 0 1.5px 24px 0 rgba(0,0,0,0.18)",
            border: "1.5px solid rgba(0,217,255,0.14)",
            textAlign: "center",
            color: "#f4fdff",
            backdropFilter: "blur(9px)",
            animation: "fadeInUp 1.2s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {/* Icon lucide graduation */}
          <div
            style={{
              background: "linear-gradient(135deg, #00d9ff 70%, #a2ffe3 120%)",
              borderRadius: "50%",
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 26px auto",
              boxShadow: "0 2px 28px #00d9ff66",
              border: "3.5px solid #e9fdff44",
              position: "relative"
            }}
          >
            <GraduationCap size={40} color="#161619" />
            <span
              style={{
                position: "absolute",
                bottom: 7,
                right: 9,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: "radial-gradient(circle, #fff 75%, #00d9ff 100%)",
                border: "1.5px solid #0ff",
                boxShadow: "0 0 7px #00e6ff66",
              }}
            ></span>
          </div>
          {/* Judul & highlight */}
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              marginBottom: 13,
              color: "#00d9ff",
              letterSpacing: 1,
              textShadow: "0 0 20px #00e6ff22, 0 2px 10px #00f0ff18",
              lineHeight: 1.13,
            }}
          >
            Selamat Datang, {nama}
          </h1>
          {/* Ucapan Inspiratif */}
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "1.21rem",
              color: "#eafaff",
              marginBottom: 25,
              textShadow: "0 1px 8px rgba(0,0,0,0.07)",
              lineHeight: 1.7,
              letterSpacing: 0.01,
            }}
          >
            Teruslah belajar, berani bermimpi,  
            dan jadilah inspirasi bagi sekitarmu.
          </p>
          {/* Tombol glowing */}
          <a
            href="/mahasiswa/upload"
            style={{
              display: "inline-block",
              padding: "13px 38px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #00d9ff 0%, #19e0c3 100%)",
              color: "#18191c",
              fontWeight: 700,
              fontSize: "1.13rem",
              letterSpacing: 0.5,
              textDecoration: "none",
              boxShadow: "0 2px 24px 0 #00e6ff44, 0 0.5px 12px 0 #00e6ff22",
              transition: "background 0.2s, box-shadow 0.19s",
              marginTop: 2,
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px #19e0c366")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 24px 0 #00e6ff44, 0 0.5px 12px 0 #00e6ff22")}
          >
            Mulai Pengisian Semester Antara
          </a>
        </div>
        {/* Simple fadeInUp animation (inject style global di index.html atau _app.js) */}
        <style>
          {`
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translate3d(0, 60px, 0);
              }
              100% {
                opacity: 1;
                transform: none;
              }
            }
          `}
        </style>
      </div>
    </DashboardLayout>
  );
}
