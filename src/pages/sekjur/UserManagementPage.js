import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  exportUserCSV, // ✅ tambahkan ini
} from "../../services/sekjurService";
import { UserPlus, Edit, Trash2, Loader2 } from "lucide-react";

const ROLE_LABELS = {
  mahasiswa: "Mahasiswa",
  dosen: "Dosen",
  prodi: "Prodi",
  sekjur: "Sekjur",
};

const PRODI_OPTIONS = ["TEKNIK INFORMATIKA", "TEKNIK LISTRIK", "TEKNIK KOMPUTER"];

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({ role: "", prodi: "", search: "" });
  const [page ] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const data = await getAllUsers({ ...filter, page });
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [filter, page]);

  const resetForm = () => {
    setEditUser(null);
    setSelectedRole("");
      setGeneratedUsername("");
    setShowModal(false);
    setNotif("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotif("");
    setError("");
    setLoading(true);
    try {
      const form = Object.fromEntries(new FormData(e.target));
      if (editUser?.id) {
        await updateUser(editUser.id, form);
        setNotif("User berhasil diupdate!");
      } else {
        await createUser(form);
        setNotif("User baru berhasil ditambahkan!");
      }
      setShowModal(false);
      const data = await getAllUsers({ ...filter, page });
      setUsers(data);
    } catch (err) {
  const msg = err.message.toLowerCase();
  if (msg.includes("username") || msg.includes("nim") || msg.includes("nip")) {
    setError("NIM / NIP / Username sudah digunakan. Silakan masukkan data yang unik.");
  } else {
    setError(err.message);
  }
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    setLoading(true);
    setNotif("");
    setError("");
    try {
      await deleteUser(id);
      setNotif("User berhasil dihapus.");
      const data = await getAllUsers({ ...filter, page });
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleExportCSV = async () => {
  try {
    await exportUserCSV({
      role: filter.role || "",
      prodi: filter.prodi || "",
      search: filter.search || "",
    });
  } catch (err) {
    alert(err.message || "Gagal export CSV!");
  }
};


  useEffect(() => {
    if (window.bootstrap) {
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [users]);

  const groupedUsers = users.reduce((acc, user) => {
    const role = user.role || "lainnya";
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  const getGroupBgColor = (role) => {
    switch (role) {
      case "mahasiswa": return "#e0f7ff";
      case "dosen": return "#ffe6e6";
      case "prodi": return "#fff5cc";
      case "sekjur": return "#e6ffe6";
      default: return "#f0f0f0";
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 1250 }}>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <UserPlus size={28} style={{ color: "#0088ff" }} />
        <h3 className="fw-bold mb-0">Manajemen User</h3>
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-success" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => { setEditUser(null); setShowModal(true); }}>
            Tambah User
          </button>
        </div>

      </div>

      {/* Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <select className="form-select" value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}>
            <option value="">Semua Role</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
            <option value="prodi">Prodi</option>
            <option value="sekjur">Sekjur</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter.prodi} onChange={e => setFilter(f => ({ ...f, prodi: e.target.value }))}>
            <option value="">Semua Prodi</option>
            {PRODI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Cari nama/username/nim/nip/email" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-info w-100" onClick={() => setFilter({ role: "", prodi: "", search: "" })}>Reset Filter</button>
        </div>
      </div>

      {notif && <div className="alert alert-success">{notif}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabel */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th>NIM</th>
              <th>NIP</th>
              <th>Username</th>
              <th>Email</th>
              <th>Prodi</th>
              <th>Angkatan</th>
              <th>No Telp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedUsers).map(([role, list]) => (
              <React.Fragment key={role}>
                <tr style={{ background: getGroupBgColor(role), borderTop: "3px solid #ccc" }}>
                  <td colSpan={10} className="fw-bold text-uppercase">▸ {ROLE_LABELS[role] || role}</td>
                </tr>
                {list.map(user => (
                  <tr key={user.id}>
                    <td>{user.nama}</td>
                    <td>{ROLE_LABELS[user.role] || user.role}</td>
                    <td>{user.nim}</td>
                    <td>{user.nip}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.prodi}</td>
                    <td>{user.angkatan}</td>
                    <td>{user.no_telp}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-1" onClick={() => { setEditUser(user); setShowModal(true); }}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {loading && <tr><td colSpan={10}><Loader2 className="me-2 spinner-border spinner-border-sm" /> Memuat...</td></tr>}
            {!loading && users.length === 0 && <tr><td colSpan={10}><i>Data user kosong.</i></td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit User */}
{showModal && (
  <div className="modal show d-block" tabIndex={-1}>
    <div className="modal-dialog modal-lg">
      <form onSubmit={handleSubmit}>
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{editUser ? "Edit User" : "Tambah User"}</h5>
            <button type="button" className="btn-close" onClick={resetForm}></button>
          </div>

          <div className="modal-body">
  {error && (
    <div className="alert alert-danger text-center">
      {error}
    </div>
  )}

  {/* Role + Identitas (Pindah ke atas) */}
  <h6 className="fw-bold mb-2">🧾 Identitas</h6>
  <div className="row g-2 mb-3">
    <div className="col-md-4">
      <label className="form-label">Role *</label>
      <select
        name="role"
        required
        className="form-select"
        value={selectedRole || editUser?.role || ""}
        onChange={(e) => {
          setSelectedRole(e.target.value);
          setGeneratedUsername("");
        }}
      >
        <option value="">Pilih Role</option>
        <option value="mahasiswa">Mahasiswa</option>
        <option value="dosen">Dosen</option>
        <option value="prodi">Prodi</option>
        <option value="sekjur">Sekjur</option>
      </select>
    </div>

    {(selectedRole || editUser?.role) === "mahasiswa" && (
      <div className="col-md-4">
        <label className="form-label">NIM</label>
        <input
          name="nim"
          defaultValue={editUser?.nim}
          className="form-control"
          placeholder="Nomor Induk Mahasiswa"
          onChange={(e) => setGeneratedUsername(e.target.value)}
        />
      </div>
    )}

    {["dosen", "sekjur", "prodi"].includes(selectedRole || editUser?.role) && (
      <div className="col-md-4">
        <label className="form-label">NIP</label>
        <input
          name="nip"
          defaultValue={editUser?.nip}
          className="form-control"
          placeholder="Nomor Induk Pegawai"
          onChange={(e) => setGeneratedUsername(e.target.value)}
        />
      </div>
    )}

    <div className="col-md-4">
      <label className="form-label">Username</label>
      <input
        name="username"
        className="form-control"
        readOnly
        value={generatedUsername || editUser?.username || ""}
        placeholder="Otomatis dari NIM / NIP"
      />
    </div>
  </div>

  {/* Akun Info */}
  <h6 className="fw-bold mb-2">🔐 Akun</h6>
  <div className="row g-2 mb-3">
    <div className="col-md-6">
      <label className="form-label">Nama Lengkap *</label>
      <input name="nama" required defaultValue={editUser?.nama} className="form-control" placeholder="Nama lengkap pengguna" />
    </div>
    <div className="col-md-6">
      <label className="form-label">Password baru / Reset Password *</label>
      <input name="password" type="password" className="form-control" placeholder="Password" />
    </div>
  </div>

  {/* Akademik + Kontak */}
  <h6 className="fw-bold mb-2">🏫 Akademik & Kontak</h6>
  <div className="row g-2 mb-3">
    <div className="col-md-4">
      <label className="form-label">Prodi</label>
      <select name="prodi" className="form-select" defaultValue={editUser?.prodi || ""}>
        <option value="">Pilih Prodi</option>
        <option value="TEKNIK INFORMATIKA">TEKNIK INFORMATIKA</option>
        <option value="TEKNIK LISTRIK">TEKNIK LISTRIK</option>
        <option value="TEKNIK KOMPUTER">TEKNIK KOMPUTER</option>
      </select>
    </div>
    <div className="col-md-4">
      <label className="form-label">Angkatan</label>
      <input name="angkatan" defaultValue={editUser?.angkatan} className="form-control" placeholder="Contoh: 2022" />
    </div>
    <div className="col-md-4">
      <label className="form-label">Email</label>
      <input name="email" defaultValue={editUser?.email} className="form-control" placeholder="Email aktif" />
    </div>
  </div>

  <div className="row g-2 mb-3">
    <div className="col-md-6">
      <label className="form-label">No Telepon</label>
      <input name="no_telp" defaultValue={editUser?.no_telp} className="form-control" placeholder="08xxxxxxxxxx" />
    </div>
    <div className="col-md-6">
      <label className="form-label">Alamat</label>
      <input name="alamat" defaultValue={editUser?.alamat} className="form-control" placeholder="Alamat lengkap" />
    </div>
  </div>

  {/* Lahir & Gender */}
  <div className="row g-2 mb-2">
    <div className="col-md-4">
      <label className="form-label">Tempat Lahir</label>
      <input name="tempat_lahir" defaultValue={editUser?.tempat_lahir} className="form-control" placeholder="Contoh: Manado" />
    </div>
    <div className="col-md-4">
      <label className="form-label">Tanggal Lahir</label>
      <input name="tanggal_lahir" type="date" defaultValue={editUser?.tanggal_lahir} className="form-control" />
    </div>
    <div className="col-md-4">
      <label className="form-label">Jenis Kelamin</label>
      <select name="jenis_kelamin" className="form-select" defaultValue={editUser?.jenis_kelamin || ""}>
        <option value="">Pilih Jenis Kelamin</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
    </div>
  </div>
</div>


          <div className="modal-footer">
            <button type="submit" className="btn btn-success">{editUser ? "Update" : "Tambah"}</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Batal</button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default UserManagementPage;
