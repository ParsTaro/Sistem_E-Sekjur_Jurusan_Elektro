import React, { useEffect, useState } from "react";
import {
  getAllMatakuliah,
  createMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
  exportMatakuliahCSV
} from "../../services/sekjurService";
import { BookOpen, Edit, Trash2, Loader2, PlusCircle } from "lucide-react";

const PRODI_OPTIONS = ["D4 INFORMATIKA", "D4 LISTRIK", "D3 LISTRIK", "D3 KOMPUTER"];

function ManajemenMatakuliahPage() {
  const [matkul, setMatkul] = useState([]);
  const [filter, setFilter] = useState({ prodi: "", semester: "", sks: "", search: "" });
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formProdi, setFormProdi] = useState("");
  const [formSemester, setFormSemester] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setNotif(""); setError("");
    try {
      const data = await getAllMatakuliah(filter);
      setMatkul(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filter)]); // agar selalu update ketika filter berubah

  const resetForm = () => {
    setEditData(null);
    setShowModal(false);
    setFormProdi("");
    setFormSemester("");
    setNotif("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    setNotif(""); setError(""); setLoading(true);
    try {
      if (editData?.id) {
        await updateMatakuliah(editData.id, form);
        setNotif("Matakuliah berhasil diupdate!");
      } else {
        await createMatakuliah(form);
        setNotif("Matakuliah baru berhasil ditambahkan!");
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus matakuliah ini?")) return;
    setLoading(true);
    try {
      await deleteMatakuliah(id);
      setNotif("Matakuliah berhasil dihapus.");
      fetchData();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const getSemesterOptions = (prodi) => {
    if (!prodi) return [];
    return prodi.startsWith("D4") ? [...Array(7)].map((_, i) => i + 1) : [...Array(5)].map((_, i) => i + 1);
  };

  const sksList = [...new Set(matkul.map(m => m.sks))];

  return (
    <div className="container py-4" style={{ maxWidth: 1150 }}>
      <div className="d-flex align-items-center mb-3" style={{ gap: 10 }}>
        <BookOpen size={28} className="text-info" />
        <h3 className="fw-bold mb-0">Manajemen Matakuliah</h3>
        <button className="btn btn-outline-success" onClick={() => exportMatakuliahCSV(filter)}>
          Export CSV
        </button>
        <button className="btn btn-primary" onClick={() => {
          setEditData(null);
          setFormProdi("");
          setFormSemester("");
          setShowModal(true);
        }}>
          <PlusCircle size={16} className="me-1" /> Tambah
        </button>
      </div>

      {/* FILTER */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-select" value={filter.prodi} onChange={e => setFilter(f => ({ ...f, prodi: e.target.value }))}>
            <option value="">Semua Prodi</option>
            {PRODI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filter.semester} onChange={e => setFilter(f => ({ ...f, semester: e.target.value }))}>
            <option value="">Semua Semester</option>
            {getSemesterOptions(filter.prodi).map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filter.sks} onChange={e => setFilter(f => ({ ...f, sks: e.target.value }))}>
            <option value="">Semua SKS</option>
            {sksList.map(s => <option key={s} value={s}>{s} SKS</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Cari nama matakuliah..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-secondary w-100" onClick={() => setFilter({ prodi: "", semester: "", sks: "", search: "" })}>
            Reset
          </button>
        </div>
      </div>

      {notif && <div className="alert alert-success">{notif}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle table-striped">
          <thead className="table-light">
            <tr>
              <th>Nama Matakuliah</th>
              <th>Prodi</th>
              <th>Semester</th>
              <th>SKS</th>
              <th>Total Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {matkul.map((mk) => (
              <tr key={mk.id}>
                <td>{mk.nama_matakuliah}</td>
                <td>{mk.prodi}</td>
                <td>{mk.semester}</td>
                <td>{mk.sks}</td>
                <td>{mk.total_harga?.toLocaleString("id-ID")}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-1" onClick={() => {
                    setEditData(mk);
                    setFormProdi(mk.prodi);
                    setFormSemester(mk.semester);
                    setShowModal(true);
                  }}>
                    <Edit size={16} />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mk.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={6}><Loader2 className="me-2 spinner-border spinner-border-sm" /> Memuat...</td></tr>}
            {!loading && matkul.length === 0 && <tr><td colSpan={6}><i>Data tidak ditemukan.</i></td></tr>}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editData ? "Edit Matakuliah" : "Tambah Matakuliah"}</h5>
                  <button type="button" className="btn-close" onClick={resetForm}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label">Nama Matakuliah</label>
                      <input name="nama_matakuliah" required className="form-control" defaultValue={editData?.nama_matakuliah} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Prodi</label>
                      <select
                        name="prodi"
                        required
                        className="form-select"
                        value={formProdi}
                        onChange={(e) => {
                          setFormProdi(e.target.value);
                          setFormSemester("");
                        }}
                      >
                        <option value="">Pilih Prodi</option>
                        {PRODI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Semester</label>
                      <select
                        name="semester"
                        required
                        className="form-select"
                        value={formSemester}
                        onChange={(e) => setFormSemester(e.target.value)}
                        disabled={!formProdi}
                      >
                        <option value="">Pilih Semester</option>
                        {getSemesterOptions(formProdi).map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">SKS</label>
                      <input name="sks" type="number" min={1} required className="form-control" defaultValue={editData?.sks || ""} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">{editData ? "Update" : "Tambah"}</button>
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

export default ManajemenMatakuliahPage;
