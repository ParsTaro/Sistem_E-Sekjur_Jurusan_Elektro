// services/authService.js

const API_BASE = "http://localhost:5000/api/auth";

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");

  // Simpan token dan data user ke localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data; // Kembalikan data lengkap jika ingin digunakan langsung
}


// services/authService.js

export async function registerMahasiswa(form) {
  const payload = {
    username: form.username,     // fix: sebelumnya salah pakai form.nim
    nama: form.nama,
    password: form.password,
    tempat_lahir: form.tempat_lahir,
    tanggal_lahir: form.tanggal_lahir,
    alamat: form.alamat,
    email: form.email,
    jurusan: form.jurusan,
    prodi: form.prodi,
    angkatan: form.angkatan,
    jenis_kelamin: form.jenis_kelamin,
    no_telp: form.no_telp
  };

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registrasi gagal");
  return data;
}
