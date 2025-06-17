import { getToken } from "../utils/auth";

const API_BASE = "http://localhost:5000/api/sekjur";

// =========================
// 🔧 USER MANAGEMENT
// =========================

export async function getAllUsers({ role, prodi, search, page, pageSize } = {}) {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (prodi) params.append("prodi", prodi);
  if (search) params.append("search", search);
  if (page) params.append("page", page);
  if (pageSize) params.append("pageSize", pageSize);

  const res = await fetch(`${API_BASE}/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data user");
  return Array.isArray(data) ? data : [];
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menambah user");
  return data;
}

export async function getUserById(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil user");
  return data;
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update user");
  return data;
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal hapus user");
  return data;
}

export async function exportUserCSV({ role, prodi, search } = {}) {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (prodi) params.append("prodi", prodi);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/users/export-csv?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!res.ok) throw new Error("Gagal export CSV");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // 🔽 Format nama file dengan timestamp
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
  link.setAttribute("download", `data_user_${timestamp}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}





// =========================
// 📥 VALIDASI PENGAJUAN
// =========================

export async function getAllPengajuan({ status, prodi, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.append("status", status); // dibaca sebagai status_proses
  if (prodi) params.append("prodi", prodi);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/pengajuan?${params.toString()}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil pengajuan");
  return Array.isArray(data) ? data : [];
}

export async function getPengajuanDetail(id) {
  const res = await fetch(`${API_BASE}/pengajuan/${id}/detail`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail pengajuan");
  return Array.isArray(data) ? data : [];
}

export async function validasiPengajuan(id, { status, alasan }) {
  const res = await fetch(`${API_BASE}/pengajuan/${id}/validasi`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, alasan }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal validasi pengajuan");
  return data;
}

// =========================
// 📊 REKAP NILAI
// =========================

export async function getRekapNilai() {
  const res = await fetch(`${API_BASE}/rekap`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil rekap nilai");
  return Array.isArray(data) ? data : [];
}

export function downloadRekapCSV() {
  const token = getToken();
  const url = `${API_BASE}/rekap/download/csv?token=${token}`;
  window.open(url, "_blank");
}

// =========================
// ❌ HAPUS DATA
// =========================

export async function deleteDetailById(id) {
  const res = await fetch(`${API_BASE}/pengajuan/detail/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus detail pengajuan");
  return data;
}

export async function deleteDetailByFilter(filter = {}) {
  const res = await fetch(`${API_BASE}/pengajuan/detail/delete-by-filter`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filter),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus data berdasarkan filter");
  return data;
}

// ✅ Hapus satu pengajuan beserta semua detail-nya
export async function deletePengajuanById(id_pengajuan) {
  const res = await fetch(`${API_BASE}/pengajuan/${id_pengajuan}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

// =========================
// 📚 MANAJEMEN MATAKULIAH
// =========================

// ✅ Ambil semua matakuliah dengan optional filter
export async function getAllMatakuliah({ prodi, semester, sks, search } = {}) {
  const params = new URLSearchParams();
  if (prodi) params.append("prodi", prodi);
  if (semester) params.append("semester", semester);
  if (sks) params.append("sks", sks);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/matakuliah?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil matakuliah");
  return Array.isArray(data) ? data : [];
}

// ✅ Tambah matakuliah baru
export async function createMatakuliah(data) {
  const res = await fetch(`${API_BASE}/matakuliah`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama_matakuliah: data.nama_matakuliah,
      prodi: data.prodi,
      semester: parseInt(data.semester),
      sks: parseInt(data.sks),
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal menambah matakuliah");
  return result;
}

// ✅ Update matakuliah by ID
export async function updateMatakuliah(id, data) {
  const res = await fetch(`${API_BASE}/matakuliah/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nama_matakuliah: data.nama_matakuliah,
      prodi: data.prodi,
      semester: parseInt(data.semester),
      sks: parseInt(data.sks),
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal update matakuliah");
  return result;
}

// ✅ Hapus matakuliah by ID
export async function deleteMatakuliah(id) {
  const res = await fetch(`${API_BASE}/matakuliah/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Gagal hapus matakuliah");
  return result;
}

// ✅ Export CSV Matakuliah (download langsung dari URL dengan token & filter)
export function exportMatakuliahCSV({ prodi, semester, sks, search } = {}) {
  const params = new URLSearchParams();
  if (prodi) params.append("prodi", prodi);
  if (semester) params.append("semester", semester);
  if (sks) params.append("sks", sks);
  if (search) params.append("search", search);
  params.append("token", getToken()); // tambahkan token di query

  const url = `${API_BASE}/matakuliah/export/csv?${params.toString()}`;
  window.open(url, "_blank");
}

