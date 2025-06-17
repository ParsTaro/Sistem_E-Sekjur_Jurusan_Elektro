import React, { useState } from "react";

// Field mahasiswa (data lengkap), role lain field dasar
const defaultState = {
  nama: "",
  username: "",
  password: "",
  role: "mahasiswa",
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat: "",
  email: "",
  jurusan: "",
  prodi: "",
  angkatan: "",
  jenis_kelamin: "L",
  no_telp: "",
  nip: "",
};

function UserForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || defaultState);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Untuk edit, password kosong tidak akan diganti
    if (initialData && !form.password) {
      delete form.password;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="form-select" required>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="sekjur">Sekjur</option>
          <option value="prodi">Prodi</option>
          <option value="dosen">Dosen</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Username</label>
        <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" required />
      </div>
      <div className="mb-2">
        <label>Password {initialData && <small>(kosongkan jika tidak diganti)</small>}</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required={!initialData} />
      </div>
      <div className="mb-2">
        <label>Nama Lengkap</label>
        <input type="text" name="nama" value={form.nama} onChange={handleChange} className="form-control" required />
      </div>
      {/* Form identitas lengkap khusus mahasiswa */}
      {form.role === "mahasiswa" && (
        <>
          <div className="mb-2">
            <label>Tempat Lahir</label>
            <input type="text" name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Tanggal Lahir</label>
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Alamat</label>
            <input type="text" name="alamat" value={form.alamat} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Jurusan</label>
            <input type="text" name="jurusan" value={form.jurusan} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Prodi</label>
            <input type="text" name="prodi" value={form.prodi} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Angkatan</label>
            <input type="text" name="angkatan" value={form.angkatan} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>Jenis Kelamin</label>
            <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="form-select">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div className="mb-2">
            <label>No. Telepon</label>
            <input type="text" name="no_telp" value={form.no_telp} onChange={handleChange} className="form-control" />
          </div>
        </>
      )}
      {/* Field khusus selain mahasiswa */}
      {form.role !== "mahasiswa" && (
        <>
          <div className="mb-2">
            <label>NIP</label>
            <input type="text" name="nip" value={form.nip} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-2">
            <label>No. Telepon</label>
            <input type="text" name="no_telp" value={form.no_telp} onChange={handleChange} className="form-control" />
          </div>
        </>
      )}
      <div className="mt-3">
        <button type="submit" className="btn btn-success me-2">Simpan</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}

export default UserForm;
