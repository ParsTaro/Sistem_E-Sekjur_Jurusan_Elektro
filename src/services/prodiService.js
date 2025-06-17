import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/prodi";

// 1. Ambil daftar pengajuan valid (siap penugasan dosen)
export async function getDaftarPengajuan() {
  const res = await fetch(`${API_BASE}/pengajuan`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil daftar pengajuan");
  return Array.isArray(data) ? data : [];
}

// 2. Ambil daftar dosen untuk dropdown penugasan
export async function getDaftarDosen() {
  const res = await fetch(`${API_BASE}/dosen`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil daftar dosen");
  return Array.isArray(data) ? data : [];
}

// 3. Proses penugasan dosen (update dosen_pengampu, tanggal_mulai, tempat_pelaksanaan)
export async function kirimPenugasan(id_detail, dosen_username, tanggal_mulai, tempat) {
  const res = await fetch(`${API_BASE}/penugasan/${id_detail}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ dosen_username, tanggal_mulai, tempat })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memproses penugasan dosen");
  return data;
}

// 4. Ambil riwayat penugasan (semua matakuliah yg sudah ditugaskan dosen)
export async function getRiwayatPenugasan() {
  const res = await fetch(`${API_BASE}/riwayat-penugasan`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil riwayat penugasan");
  return Array.isArray(data) ? data : [];
}
