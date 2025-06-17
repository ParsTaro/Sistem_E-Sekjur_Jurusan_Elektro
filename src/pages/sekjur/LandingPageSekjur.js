import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { menuByRole } from "../../constants/sidebarMenu";
import backgroundImage from "../../assets/bg-hero.jpg";
import { BriefcaseBusiness, ShieldCheck } from "lucide-react"; // Icon lucide
import { getUserFromToken } from "../../utils/auth"; // ✅ import nama dari token

export default function LandingPageSekjur() {

  const user = getUserFromToken(); // Ambil nama dari token
  const nama = user?.nama || "Sekjur";

  return (
    <DashboardLayout menuItems={menuByRole["sekjur"]}>
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
              "linear-gradient(110deg, rgba(0,217,255,0.14) 0%, rgba(12, 17, 36, 0.73) 100%)",
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
            background: "rgba(18, 24, 34, 0.63)",
            borderRadius: "2.3rem",
            boxShadow: "0 10px 40px 0 rgba(0,217,255,0.12), 0 2px 28px 0 rgba(0,0,0,0.17)",
            border: "1.5px solid rgba(0,217,255,0.13)",
            textAlign: "center",
            color: "#f4fdff",
            backdropFilter: "blur(10px)",
            animation: "fadeInUp 1.1s cubic-bezier(0.23, 1, 0.32, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Icon lucide briefcase as simbol manajemen jurusan */}
          <div
            style={{
              background: "linear-gradient(135deg, #00d9ff 70%, #a2ffe3 120%)",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 26px auto",
              boxShadow: "0 2px 28px #00d9ff55",
              border: "3px solid #d0fcff66",
            }}
          >
            <BriefcaseBusiness size={36} color="#18191c" />
          </div>
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "2.4rem",
              marginBottom: 13,
              color: "#00d9ff",
              letterSpacing: 1,
              textShadow: "0 0 16px #00e6ff2a, 0 2px 10px #00f0ff18",
              lineHeight: 1.16,
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
              textShadow: "0 1px 8px rgba(0,0,0,0.08)",
              lineHeight: 1.7,
              letterSpacing: 0.01,
            }}
          >
            Jadikan setiap keputusanmu berdampak positif  
            untuk mahasiswa dan institusi.
          </p>
          <a
            href="/sekjur/rekap"
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
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px #19e0c366")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 24px 0 #00e6ff44, 0 0.5px 12px 0 #00e6ff22")}
          >
            <ShieldCheck size={22} color="#18191c" />
            Menuju Rekap Nilai
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
