import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { menuByRole } from "../../constants/sidebarMenu";
import backgroundImage from "../../assets/bg-hero.jpg";
import { Users, Target } from "lucide-react"; // Icon lucide
import { getUserFromToken } from "../../utils/auth"; // ✅ import nama dari token


export default function LandingPageProdi() {

  const user = getUserFromToken(); // Ambil nama dari token
  const nama = user?.nama || "Kaprodi";

  return (
    <DashboardLayout menuItems={menuByRole["prodi"]}>
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
        {/* Overlay gradient + blur */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(112deg, rgba(0,217,255,0.16) 0%, rgba(24, 25, 37, 0.72) 100%)",
            backdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        />

        {/* Glass Card + animasi */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "52px 36px",
            minWidth: 340,
            maxWidth: 500,
            background: "rgba(22, 22, 25, 0.63)",
            borderRadius: "2.3rem",
            boxShadow: "0 10px 40px 0 rgba(0,217,255,0.13), 0 2px 28px 0 rgba(0,0,0,0.16)",
            border: "1.5px solid rgba(0,217,255,0.14)",
            textAlign: "center",
            color: "#f4fdff",
            backdropFilter: "blur(10px)",
            animation: "fadeInUp 1.12s cubic-bezier(0.23, 1, 0.32, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Icon leadership */}
          <div
            style={{
              background: "linear-gradient(135deg, #00d9ff 65%, #a2ffe3 120%)",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 26px auto",
              boxShadow: "0 2px 28px #00d9ff55",
              border: "3px solid #e6fdff55",
            }}
          >
            <Users size={38} color="#18191c" />
          </div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "2.3rem",
              marginBottom: 13,
              color: "#00d9ff",
              letterSpacing: 1,
              textShadow: "0 0 16px #00e6ff22, 0 2px 10px #00f0ff12",
              lineHeight: 1.15,
            }}
          >
            Selamat Datang, {nama}
          </h1>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "1.13rem",
              color: "#eafaff",
              marginBottom: 26,
              textShadow: "0 1px 8px rgba(0,0,0,0.07)",
              lineHeight: 1.7,
              letterSpacing: 0.01,
            }}
          >
            Kepemimpinan Anda membawa perubahan positif  
            untuk seluruh civitas akademika.
          </p>
          <a
            href="/prodi/penugasan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 38px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #00d9ff 0%, #1be7c3 100%)",
              color: "#18191c",
              fontWeight: 700,
              fontSize: "1.13rem",
              letterSpacing: 0.5,
              textDecoration: "none",
              boxShadow: "0 2px 24px 0 #00e6ff44, 0 0.5px 12px 0 #00e6ff22",
              transition: "background 0.2s, box-shadow 0.18s",
              marginTop: 2,
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 38px #19e0c366")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 24px 0 #00e6ff44, 0 0.5px 12px 0 #00e6ff22")}
          >
            <Target size={22} color="#18191c" />
            Menuju Penugasan Dosen
          </a>
        </div>
        {/* Animasi masuk card */}
        <style>
          {`
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translate3d(0, 70px, 0);
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
