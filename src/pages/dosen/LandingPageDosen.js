import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { menuByRole } from "../../constants/sidebarMenu";
import backgroundImage from "../../assets/bg-hero.jpg";
import { UserCheck, BookOpen } from "lucide-react";

export default function LandingPageDosen() {
  // Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const namaDosen = user?.nama || "Dosen";

  return (
    <DashboardLayout menuItems={menuByRole["dosen"]}>
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Overlay gradient+blur */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(7px)",
            background:
              "linear-gradient(120deg, rgba(0,217,255,0.10) 0%, rgba(16, 18, 31, 0.72) 100%)",
            zIndex: 1,
          }}
        />

        {/* Glass Card */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "48px 32px",
            minWidth: 340,
            maxWidth: 460,
            background: "rgba(22, 22, 25, 0.68)",
            borderRadius: "2rem",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.27)",
            border: "1px solid rgba(0,217,255,0.13)",
            textAlign: "center",
            color: "#f4fdff",
            backdropFilter: "blur(7px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #00d9ff 60%, #1be7c3 100%)",
              borderRadius: "50%",
              width: 68,
              height: 68,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px auto",
              boxShadow: "0 2px 24px #00d9ff44",
            }}
          >
            <UserCheck size={36} color="#18191c" />
          </div>

          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: "2.4rem",
              marginBottom: 18,
              color: "#00d9ff",
              textShadow: "0 0 18px #00d9ff22",
              letterSpacing: 1,
            }}
          >
            Selamat Datang, {namaDosen}
          </h1>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: "1.15rem",
              color: "#eafaff",
              marginBottom: 28,
              textShadow: "0 1px 6px rgba(0,0,0,0.08)",
              lineHeight: 1.7,
            }}
          >
            Selamat bertugas!  
            Semoga harimu menyenangkan dan penuh semangat.
          </p>

          <a
            href="/dosen/penilaian"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 36px",
              borderRadius: "100px",
              background: "linear-gradient(90deg, #00d9ff 0%, #1be7c3 100%)",
              color: "#18191c",
              fontWeight: 700,
              fontSize: "1.09rem",
              letterSpacing: 0.5,
              textDecoration: "none",
              boxShadow: "0 2px 18px 0 #00d9ff33",
              transition: "background 0.21s",
            }}
          >
            <BookOpen size={22} color="#18191c" />
            Menuju Penilaian Mahasiswa
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
