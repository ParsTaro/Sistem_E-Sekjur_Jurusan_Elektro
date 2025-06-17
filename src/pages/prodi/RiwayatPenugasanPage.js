import React, { useEffect, useState } from "react";
import { getRiwayatPenugasan } from "../../services/prodiService";
import { Loader2, Filter } from "lucide-react";

function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function RiwayatPenugasanPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ prodi: "", status: "", kelulusan: "", search: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useBootstrapTooltip(data);

  const filterData = () => {
    return data.filter(row =>
      (!filter.prodi || row.prodi?.toLowerCase().includes(filter.prodi.toLowerCase())) &&
      (!filter.status || row.status_proses === filter.status) &&
      (!filter.kelulusan || row.status_kelulusan === filter.kelulusan) &&
      (!filter.search ||
        row.nama_mahasiswa?.toLowerCase().includes(filter.search.toLowerCase()) ||
        row.nim?.toLowerCase().includes(filter.search.toLowerCase()) ||
        row.nama_dosen?.toLowerCase().includes(filter.search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const rows = await getRiwayatPenugasan();
        setData(rows);
      } catch (err) {
        setError("Gagal memuat data penugasan.");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="container py-4" style={{ minHeight: "88vh" }}>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <Filter size={28} style={{ color: "#22d3ee" }} />
        <h3 className="fw-bold mb-0 text-primary">Riwayat Penugasan Dosen Semester Antara</h3>
      </div>

      {/* FILTER */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input className="form-control" placeholder="Prodi" value={filter.prodi} onChange={e => setFilter(f => ({ ...f, prodi: e.target.value }))} />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">Semua Status</option>
            <option value="dalam penugasan">Penugasan</option>
            <option value="menunggu penilaian">Menunggu Penilaian</option>
            <option value="sudah dinilai">Sudah Dinilai</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={filter.kelulusan} onChange={e => setFilter(f => ({ ...f, kelulusan: e.target.value }))}>
            <option value="">Semua Kelulusan</option>
            <option value="lulus">Lulus</option>
            <option value="tidak lulus">Tidak Lulus</option>
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Cari nama/nim/dosen" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-info w-100" onClick={() => setFilter({ prodi: "", status: "", kelulusan: "", search: "" })}>
            Reset Filter
          </button>
        </div>
      </div>

      {/* TABEL */}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Tanggal</th>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              <th>Prodi</th>
              <th>Mata Kuliah</th>
              <th>Semester</th>
              <th>SKS</th>
              <th>Dosen Pengampu</th>
              <th>Tanggal Mulai</th>
              <th>Tempat</th>
              <th>Nilai Awal</th>
              <th>Nilai Akhir</th>
              <th>Status Kelulusan</th>
              <th>Status Proses</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={14}><Loader2 className="me-2 spinner-border spinner-border-sm" /> Memuat...</td>
              </tr>
            )}
            {!loading && filterData().length === 0 && (
              <tr><td colSpan={14}><i>Data kosong.</i></td></tr>
            )}
            {filterData().map((row, idx) => (
              <tr key={row.id_detail + "-" + idx}>
                <td>{new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID")}</td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-title={`NIM: ${row.nim}\nProdi: ${row.prodi}`}
                    style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  >
                    {row.nama_mahasiswa}
                  </span>
                </td>
                <td>{row.nim}</td>
                <td>{row.prodi}</td>
                <td>{row.nama_matakuliah}</td>
                <td className="text-center">{row.semester}</td>
                <td className="text-center">{row.sks}</td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-title={`Nama: ${row.nama_dosen || "-"}\nProdi: ${row.prodi_dosen || "-"}`}
                    style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  >
                    {row.nama_dosen || "-"}
                  </span>
                </td>
                <td>{row.tanggal_mulai ? new Date(row.tanggal_mulai).toLocaleDateString("id-ID") : "-"}</td>
                <td>{row.tempat_pelaksanaan || "-"}</td>
                <td className="text-center">{row.nilai_awal ?? "-"}</td>
                <td className="text-center">{row.nilai_akhir ?? "-"}</td>
                <td className="text-center">
                  {row.status_kelulusan === "lulus" && <span className="badge bg-success">Lulus</span>}
                  {row.status_kelulusan === "tidak lulus" && <span className="badge bg-danger">Tidak Lulus</span>}
                  {!row.status_kelulusan && <span className="badge bg-secondary">-</span>}
                </td>
                <td className="text-center">
                  {row.status_proses === "dalam penugasan" && <span className="badge bg-primary">Penugasan</span>}
                  {row.status_proses === "menunggu penilaian" && <span className="badge bg-warning text-dark">Menunggu Penilaian</span>}
                  {row.status_proses === "sudah dinilai" && <span className="badge bg-info text-dark">Sudah Dinilai</span>}
                  {row.status_proses === "selesai" && <span className="badge bg-success">Selesai</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: "#006" }} className="mt-2">
        <i>Klik/hover pada nama mahasiswa atau dosen untuk melihat detail kontak.</i>
      </div>
    </div>
  );
}

export default RiwayatPenugasanPage;
