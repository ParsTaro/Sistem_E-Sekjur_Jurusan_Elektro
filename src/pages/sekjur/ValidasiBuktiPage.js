import React, { useEffect, useState } from "react";
import {
  getAllPengajuan,
  getPengajuanDetail,
  validasiPengajuan,
  deleteDetailById,
  deletePengajuanById
} from "../../services/sekjurService";
import { Loader2, Search, FileText, Check, XCircle, Trash2 } from "lucide-react";

function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      document.querySelectorAll(".tooltip").forEach(el => el.remove());
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function ValidasiBuktiPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [filter, setFilter] = useState({
    status: "pending",
    prodi: "",
    search: ""
  });
  const [detail, setDetail] = useState(null);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  useBootstrapTooltip(pengajuan);
  useBootstrapTooltip(detail);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const rows = await getAllPengajuan(filter);
        setPengajuan(rows);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchAll();
  }, [filter, notif]);

  const handleShowDetail = async (id) => {
    setDetail(null);
    setError("");
    try {
      const data = await getPengajuanDetail(id);
      setDetail(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleValidasi = async (id, status) => {
    setValidating(true);
    setNotif("");
    setError("");
    let alasan = null;
    if (status === "invalid") {
      alasan = window.prompt("Masukkan alasan penolakan:");
      if (!alasan) {
        setValidating(false);
        return;
      }
    }
    try {
      await validasiPengajuan(id, { status, alasan });
      setNotif(`Pengajuan berhasil divalidasi: ${status === "valid" ? "Status lanjut ke penugasan" : "Ditolak"}.`);
      setDetail(null);
    } catch (err) {
      setError(err.message);
    }
    setValidating(false);
  };

  const handleDeleteOne = async (id_detail, id_pengajuan) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus matakuliah ini?");
    if (!konfirmasi) return;

    try {
      await deleteDetailById(id_detail);
      setNotif("Matakuliah berhasil dihapus.");

      const sisa = await getPengajuanDetail(id_pengajuan);
      if (!sisa || sisa.length === 0) {
        setDetail(null);
        setNotif("Semua matakuliah telah dihapus. Pengajuan akan dihapus.");
      } else {
        setDetail(sisa);
      }

      const rows = await getAllPengajuan(filter);
      setPengajuan(rows);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePengajuan = async (id_pengajuan) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus seluruh pengajuan ini beserta semua matakuliah?");
    if (!konfirmasi) return;

    try {
      await deletePengajuanById(id_pengajuan);
      setNotif("Pengajuan berhasil dihapus.");
      const rows = await getAllPengajuan(filter);
      setPengajuan(rows);
      setDetail(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-4" style={{ minHeight: "88vh" }}>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <FileText size={28} style={{ color: "#2dd4bf" }} />
        <h3 className="fw-bold mb-0 text-primary">
          Validasi Pengajuan Semester Antara
        </h3>
      </div>

      {/* Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="invalid">Ditolak</option>
            <option value="on process (penugasan)">Penugasan</option>
            <option value="on process (penilaian dosen)">Penilaian</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Cari Prodi"
            value={filter.prodi}
            onChange={(e) =>
              setFilter((f) => ({ ...f, prodi: e.target.value }))
            }
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Cari nama/NIM/email"
            value={filter.search}
            onChange={(e) =>
              setFilter((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-info w-100"
            onClick={() =>
              setFilter({ status: "pending", prodi: "", search: "" })
            }
          >
            Reset Filter
          </button>
        </div>
      </div>

      {notif && <div className="alert alert-success">{notif}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Tanggal</th>
              <th>Nama Mahasiswa</th>
              <th>Prodi</th>
              <th>NIM</th>
              <th>Status</th>
              <th>Bukti</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7}>
                  <Loader2 className="me-2 spinner-border spinner-border-sm" /> Memuat...
                </td>
              </tr>
            )}
            {!loading && pengajuan.length === 0 && (
              <tr><td colSpan={7}><i>Data pengajuan kosong.</i></td></tr>
            )}
            {pengajuan.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID")}</td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-title={`NIM: ${row.nim}\nProdi: ${row.prodi}\nEmail: ${row.email}\nNo. Telp: ${row.no_telp}`}
                    style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  >
                    {row.nama_mahasiswa}
                  </span>
                </td>
                <td>{row.prodi}</td>
                <td>{row.nim}</td>
                <td>
                  {row.status === "pending" && <span className="badge bg-warning text-dark">Pending</span>}
                  {row.status === "invalid" && <span className="badge bg-danger">Ditolak</span>}
                  {row.status === "on process (penugasan)" && <span className="badge bg-primary">Penugasan</span>}
                  {row.status === "on process (penilaian dosen)" && <span className="badge bg-info text-dark">Penilaian</span>}
                  {row.status === "selesai" && <span className="badge bg-success">Selesai</span>}
                </td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/bukti/${row.bukti_pembayaran}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-info"
                  >
                    Lihat Bukti
                  </a>
                </td>
                <td className="d-flex gap-1">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleShowDetail(row.id)}
                  >
                    <Search size={16} /> Detail
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePengajuan(row.id)}
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && Array.isArray(detail) && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Pengajuan Mahasiswa</h5>
                <button type="button" className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body">
                <div>
                  <b>Mahasiswa:</b> {detail[0].nama} <br />
                  <b>NIM:</b> {detail[0].nim} <br />
                  <b>Prodi:</b> {detail[0].prodi} <br />
                  <b>Email:</b> {detail[0].email} <br />
                  <b>Telp:</b> {detail[0].no_telp} <br />
                  <b>Tanggal Pengajuan:</b> {new Date(detail[0].tanggal_pengajuan).toLocaleDateString("id-ID")}
                </div>
                <div className="table-responsive mt-3">
                  <table className="table table-bordered align-middle">
                    <thead>
                      <tr>
                        <th>Matakuliah</th>
                        <th>Semester</th>
                        <th>SKS</th>
                        <th>Total Harga</th>
                        <th>Dosen Pengampu</th>
                        <th>Nilai Awal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.map((d) => (
                        <tr key={d.id_detail}>
                          <td>{d.nama_matakuliah}</td>
                          <td>{d.semester}</td>
                          <td>{d.sks}</td>
                          <td>
                            {d.total_harga
                              ? `Rp${Number(d.total_harga).toLocaleString("id-ID")}`
                              : "-"}
                          </td>
                          <td>
                            <span
                              data-bs-toggle="tooltip"
                              data-bs-title={`NIP: ${d.nip_dosen_pengampu || "-"}\nNama: ${d.nama_dosen_pengampu || "-"}`}
                              style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                            >
                              {d.nama_dosen_pengampu || <i>-</i>}
                            </span>
                          </td>
                          <td>{d.nilai_awal || <span className="text-muted">-</span>}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteOne(d.id_detail, d.id_pengajuan)}
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-end">
                  <button
                    className="btn btn-success me-2"
                    disabled={validating}
                    onClick={() =>
                      handleValidasi(detail[0].id_pengajuan, "valid")
                    }
                  >
                    <Check size={17} className="me-1" />
                    Validasi (Terima)
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={validating}
                    onClick={() =>
                      handleValidasi(detail[0].id_pengajuan, "invalid")
                    }
                  >
                    <XCircle size={17} className="me-1" />
                    Tolak Pengajuan
                  </button>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setDetail(null)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidasiBuktiPage;
