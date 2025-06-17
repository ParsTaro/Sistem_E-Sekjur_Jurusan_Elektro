import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/mahasiswa";

// --- Ambil daftar semua matakuliah (untuk dropdown select di form pengajuan) ---
export async function getDaftarMatakuliah() {
  const res = await fetch(`${API_BASE}/matakuliah`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil matakuliah");
  return Array.isArray(data) ? data : [];
}

// --- Ambil daftar dosen (untuk dropdown select di form pengajuan) ---
export async function getDaftarDosen() {
  const res = await fetch(`${API_BASE}/dosen`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil dosen");
  return Array.isArray(data) ? data : [];
}

// --- Kirim pengajuan semester antara (bukti + jumlah + multi matakuliah+dosen+nilai_awal) ---
// formData = FormData { bukti_pembayaran, jumlah_pembayaran, matakuliahList (JSON string) }
export async function kirimPengajuan(formData) {
  const res = await fetch(`${API_BASE}/pengajuan`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengirim pengajuan");
  return data;
}

// --- Ambil riwayat pengajuan semester antara mahasiswa ---
export async function getRiwayatPengajuan() {
  const res = await fetch(`${API_BASE}/pengajuan/history`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil riwayat pengajuan");
  return data.data || [];
}

// --- (Opsional) Ambil profil mahasiswa ---
export async function getProfilMahasiswa() {
  const res = await fetch(`${API_BASE}/profil`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil profil");
  return data;
}
