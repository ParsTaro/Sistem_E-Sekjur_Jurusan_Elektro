import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/dosen"; // Pastikan sesuai backend kamu

// 1. Ambil semua penugasan aktif dosen login
export async function getPenugasanSaya() {
  const res = await fetch(`${API_BASE}/penugasan`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil penugasan dosen");
  return Array.isArray(data) ? data : [];
}

// 2. Update nilai akhir (status kelulusan ditentukan otomatis di backend)
export async function updateNilaiAkhir(id_detail, nilai_akhir) {
  const res = await fetch(`${API_BASE}/penugasan/${id_detail}/nilai`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nilai_akhir }) // hanya kirim nilai akhir saja
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update nilai akhir");
  return data;
}

// 3. Ambil riwayat nilai yang sudah diisi dosen
export async function getRiwayatNilaiDosen() {
  const res = await fetch(`${API_BASE}/riwayat-nilai`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil riwayat nilai dosen");
  return Array.isArray(data) ? data : [];
}
