import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/login/RegisterPage";

// Mahasiswa Pages
import UploadBuktiPage from "../pages/mahasiswa/UploadBuktiPage";
import LandingPageMahasiswa from "../pages/mahasiswa/LandingPageMahasiswa";
import CutiPageMahasiswa from "../pages/mahasiswa/CutiPage";
import RiwayatPengajuanPage from "../pages/mahasiswa/RiwayatPengajuanPage";

// Sekjur Pages
import ValidasiBuktiPage from "../pages/sekjur/ValidasiBuktiPage";
import RekapNilaiPage from "../pages/sekjur/RekapNilaiPage";
import UserManagementPage from "../pages/sekjur/UserManagementPage";
import ManajemenMatakuliahPage from "../pages/sekjur/ManajemenMatakuliahPage";
import CutiPageSekjur from "../pages/sekjur/CutiPage";
import LandingPageSekjur from "../pages/sekjur/LandingPageSekjur";

// Prodi Pages
import PenugasanPage from "../pages/prodi/PenugasanPage";
import RiwayatPenugasanPage from "../pages/prodi/RiwayatPenugasanPage";
import CutiPageProdi from "../pages/prodi/CutiPage";
import LandingPageProdi from "../pages/prodi/LandingPageProdi";

// Dosen Pages
import RiwayatNilaiDosenPage from "../pages/dosen/RiwayatNilaiDosenPage";
import CutiPageDosen from "../pages/dosen/CutiPage";
import LandingPageDosen from "../pages/dosen/LandingPageDosen";


import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import { menuByRole } from "../constants/sidebarMenu";
import PenilaianPage from "../pages/dosen/PenilaianPage";

function getCurrentRole() {
  return localStorage.getItem("role");
}

function getLayout(element, role) {
  const activeRole = role || getCurrentRole();
  return (
    <DashboardLayout menuItems={menuByRole[activeRole] || []}>
      {element}
    </DashboardLayout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* MAHASISWA */}
      <Route path="/mahasiswa/landing" element={<ProtectedRoute allowedRoles={["mahasiswa"]}><LandingPageMahasiswa /></ProtectedRoute>} />
      <Route path="/mahasiswa/upload" element={<ProtectedRoute allowedRoles={["mahasiswa"]}>{getLayout(<UploadBuktiPage />, "mahasiswa")}</ProtectedRoute>} />
      <Route path="/mahasiswa/riwayat" element={<ProtectedRoute allowedRoles={["mahasiswa"]}>{getLayout(<RiwayatPengajuanPage />, "mahasiswa")}</ProtectedRoute>} />
      <Route path="/mahasiswa/cuti" element={<ProtectedRoute allowedRoles={["mahasiswa"]}>{getLayout(<CutiPageMahasiswa />, "mahasiswa")}</ProtectedRoute>} />

      {/* SEKJUR */}
      <Route path="/sekjur/landing" element={<ProtectedRoute allowedRoles={["sekjur"]}><LandingPageSekjur /></ProtectedRoute>} />
      <Route path="/sekjur/validasi" element={<ProtectedRoute allowedRoles={["sekjur"]}>{getLayout(<ValidasiBuktiPage />, "sekjur")}</ProtectedRoute>} />
      <Route path="/sekjur/rekap" element={<ProtectedRoute allowedRoles={["sekjur"]}>{getLayout(<RekapNilaiPage />, "sekjur")}</ProtectedRoute>} />
      <Route path="/sekjur/user" element={<ProtectedRoute allowedRoles={["sekjur"]}>{getLayout(<UserManagementPage />, "sekjur")}</ProtectedRoute>} />
      <Route path="/sekjur/matakuliah" element={<ProtectedRoute allowedRoles={["sekjur"]}>{getLayout(<ManajemenMatakuliahPage />, "sekjur")}</ProtectedRoute>} />
      <Route path="/sekjur/cuti" element={<ProtectedRoute allowedRoles={["sekjur"]}>{getLayout(<CutiPageSekjur />, "sekjur")}</ProtectedRoute>} />

      {/* PRODI */}
      <Route path="/prodi/landing" element={<ProtectedRoute allowedRoles={["prodi"]}><LandingPageProdi /></ProtectedRoute>} />
      <Route path="/prodi/penugasan" element={<ProtectedRoute allowedRoles={["prodi"]}>{getLayout(<PenugasanPage />, "prodi")}</ProtectedRoute>} />
      <Route path="/prodi/riwayat-penugasan" element={<ProtectedRoute allowedRoles={["prodi"]}>{getLayout(<RiwayatPenugasanPage />, "prodi")}</ProtectedRoute>} />
      <Route path="/prodi/cuti" element={<ProtectedRoute allowedRoles={["prodi"]}>{getLayout(<CutiPageProdi />, "prodi")}</ProtectedRoute>} />

      {/* DOSEN */}
      <Route path="/dosen/landing" element={<ProtectedRoute allowedRoles={["dosen"]}><LandingPageDosen /></ProtectedRoute>} />
      <Route path="/dosen/penilaian" element={<ProtectedRoute allowedRoles={["dosen"]}>{getLayout(<PenilaianPage />, "dosen")}</ProtectedRoute>} />
      <Route path="/dosen/riwayat-nilai" element={<ProtectedRoute allowedRoles={["dosen"]}>{getLayout(<RiwayatNilaiDosenPage />, "dosen")}</ProtectedRoute>} />
      <Route path="/dosen/cuti" element={<ProtectedRoute allowedRoles={["dosen"]}>{getLayout(<CutiPageDosen />, "dosen")}</ProtectedRoute>} />

      {/* Fallback unauthorized */}
      <Route path="/unauthorized" element={<div>❌ Tidak diizinkan</div>} />
    </Routes>
  );
}

export default AppRoutes;
