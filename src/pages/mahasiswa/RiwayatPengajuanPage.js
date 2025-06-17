import React, { useEffect, useState } from "react";
import { getRiwayatPengajuan } from "../../services/mahasiswaService";
import { Info, GraduationCap, BookOpen, } from "lucide-react";

function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function RiwayatPengajuanPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ status: "", kelulusan: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useBootstrapTooltip(data);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const rows = await getRiwayatPengajuan();
        setData(rows);
      } catch {
        setError("Gagal mengambil riwayat pengajuan.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredData = data.filter(row =>
    (!filter.status || row.status_proses === filter.status) &&
    (!filter.kelulusan || row.status_kelulusan === filter.kelulusan) &&
    (!filter.search || row.nama_matakuliah.toLowerCase().includes(filter.search.toLowerCase()))
  );

  const formatStatusProses = (proses) => {
    if (proses === "menunggu penugasan") return <span className="badge bg-info text-dark">Menunggu Penugasan</span>;
    if (proses === "dalam penugasan") return <span className="badge bg-primary">Sedang Ditugaskan</span>;
    if (proses === "menunggu penilaian") return <span className="badge bg-warning text-dark">Menunggu Penilaian</span>;
    if (proses === "selesai") return <span className="badge bg-success">Selesai</span>;
    return <span className="badge bg-secondary">{proses}</span>;
  };

  const formatKelulusan = kelulusan => {
    if (!kelulusan) return <span className="badge bg-secondary">-</span>;
    if (kelulusan === "lulus") return <span className="badge bg-success">Lulus</span>;
    if (kelulusan === "tidak lulus") return <span className="badge bg-danger">Tidak Lulus</span>;
    return <span className="badge bg-secondary">{kelulusan}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="glass-card px-4 py-5 text-center" style={{
          borderRadius: "2rem", boxShadow: "0 8px 32px #00e0ff22",
          background: "rgba(255,255,255,0.66)", backdropFilter: "blur(9px)"
        }}>
          <div className="spinner-border text-info mb-3" style={{ width: "2.8rem", height: "2.8rem" }} />
          <div style={{ color: "#22d3ee", fontWeight: 600, letterSpacing: 0.4 }}>
            Memuat data riwayat...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center rounded-3" style={{ fontSize: 18, gap: 8 }}>
          <Info size={24} className="me-2" /> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ minHeight: "92vh" }}>
      <div style={{
        background: "rgba(255,255,255,0.99)",
        borderRadius: "2.2rem",
        boxShadow: "0 10px 32px #00d9ff19, 0 1.5px 24px 0 #b1f6fd14",
        border: "1.5px solid #b6f6fd33",
        padding: "34px 20px 28px 20px",
        width: "100%",
        maxWidth: 1080,
        margin: "auto"
      }}>
        <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
          <GraduationCap size={28} style={{ color: "#00d9ff" }} />
          <h3 className="fw-bold text-primary mb-0" style={{ letterSpacing: 0.7 }}>
            Riwayat Pengajuan Semester Antara
          </h3>
        </div>

        {/* Filter */}
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <select className="form-select" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
              <option value="">Semua Proses</option>
              <option value="menunggu penugasan">Menunggu Penugasan</option>
              <option value="dalam penugasan">Sedang Ditugaskan</option>
              <option value="menunggu penilaian">Menunggu Penilaian</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filter.kelulusan} onChange={e => setFilter(f => ({ ...f, kelulusan: e.target.value }))}>
              <option value="">Semua Kelulusan</option>
              <option value="lulus">Lulus</option>
              <option value="tidak lulus">Tidak Lulus</option>
            </select>
          </div>
          <div className="col-md-4">
            <input className="form-control" placeholder="Cari matakuliah" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-info w-100" onClick={() => setFilter({ status: "", kelulusan: "", search: "" })}>
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive" style={{ borderRadius: 20 }}>
          <table className="table table-hover align-middle mb-0" style={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontSize: "1.02rem"
          }}>
            <thead className="table-light text-center" style={{
              background: "linear-gradient(90deg,#e9fcff,#ccf7ff 100%)"
            }}>
              <tr>
                <th>Tanggal</th>
                <th>Prodi</th>
                <th>Matakuliah</th>
                <th>Semester</th>
                <th>SKS</th>
                <th>Dosen</th>
                <th>Nilai Awal</th>
                <th>Nilai Akhir</th>
                <th>Status Kelulusan</th>
                <th>Proses</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice().reverse().map((row) => (
                <tr key={row.id_detail} style={{ background: "rgba(255,255,255,0.98)" }}>
                  <td className="fw-semibold text-center align-middle">
                    {new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID")}
                  </td>
                  <td className="fw-semibold text-center align-middle">{row.prodi}</td>
                  <td>
                    <span className="d-flex align-items-center">
                      <BookOpen size={16} className="me-2 text-primary" />
                      {row.nama_matakuliah}
                    </span>
                  </td>
                  <td className="text-center">{row.semester}</td>
                  <td className="text-center">{row.sks}</td>
                  <td>
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-title={
                        `NIP: ${row.dosen_pengampu}\n` +
                        `Email: ${row.email_dosen_pengampu || '-'}\n` +
                        `No. Telp: ${row.no_telp_dosen_pengampu || '-'}`
                      }
                      style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                    >
                      {row.nama_dosen_pengampu}
                    </span>
                  </td>
                  <td className="text-center">{row.nilai_awal ?? <span className="text-muted">-</span>}</td>
                  <td className="text-center">{row.nilai_akhir ?? <span className="text-muted">-</span>}</td>
                  <td className="text-center">{formatKelulusan(row.status_kelulusan)}</td>
                  <td className="text-center">{formatStatusProses(row.status_proses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2" style={{ fontSize: 13, color: "#2563eb" }}>
          <i>Klik/hover pada nama dosen untuk melihat detail kontak dosen pengampu lalu hubungi.</i>
        </div>
      </div>
    </div>
  );
}

export default RiwayatPengajuanPage;
