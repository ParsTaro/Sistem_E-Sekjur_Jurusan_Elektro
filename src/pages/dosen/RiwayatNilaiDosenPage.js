import React, { useEffect, useState } from "react";
import { getRiwayatNilaiDosen } from "../../services/dosenService";
import { Loader2, Filter } from "lucide-react";

// Tooltip handler (Bootstrap)
function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function RiwayatNilaiDosenPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ prodi: "", semester: "", search: "" });
  const [loading, setLoading] = useState(false);

  useBootstrapTooltip(data);

  // Filter data client-side (bisa di-extend ke backend jika banyak data)
  const filterData = () => {
    return data.filter(row =>
      (!filter.prodi || (row.prodi && row.prodi.toLowerCase().includes(filter.prodi.toLowerCase())))
      && (!filter.semester || String(row.semester) === filter.semester)
      && (!filter.search ||
        row.nama_mahasiswa?.toLowerCase().includes(filter.search.toLowerCase()) ||
        row.nim?.toLowerCase().includes(filter.search.toLowerCase()) ||
        row.nama_matakuliah?.toLowerCase().includes(filter.search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const rows = await getRiwayatNilaiDosen();
        setData(rows);
      } catch { /* error ignored for ringkas */ }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="container py-4" style={{ minHeight: "85vh" }}>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <Filter size={24} style={{ color: "#16a34a" }} />
        <h3 className="fw-bold mb-0 text-primary">Riwayat Nilai yang Pernah Diinput</h3>
      </div>

      {/* Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input className="form-control" placeholder="Prodi" value={filter.prodi} onChange={e => setFilter(f => ({ ...f, prodi: e.target.value }))} />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Semester" value={filter.semester} onChange={e => setFilter(f => ({ ...f, semester: e.target.value }))} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Cari nama/nim/matakuliah" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-info w-100" onClick={() => setFilter({ prodi: "", semester: "", search: "" })}>Reset Filter</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Mahasiswa</th>
              <th>NIM</th>
              <th>Prodi</th>
              <th>Angkatan</th>
              <th>Mata Kuliah</th>
              <th>Semester</th>
              <th>SKS</th>
              <th>Nilai Awal</th>
              <th>Nilai Akhir</th>
              <th>Status Kelulusan</th>
              <th>Tempat</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={12}><Loader2 className="me-2 spinner-border spinner-border-sm" /> Memuat...</td></tr>}
            {!loading && filterData().length === 0 && <tr><td colSpan={12}><i>Tidak ada riwayat nilai.</i></td></tr>}
            {filterData().map(row => (
              <tr key={row.id_detail}>
                <td>{row.tanggal_pengajuan ? new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID") : "-"}</td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-title={
                      `NIM: ${row.nim}\nProdi: ${row.prodi}\nAngkatan: ${row.angkatan}`
                    }
                    style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                  >
                    {row.nama_mahasiswa}
                  </span>
                </td>
                <td>{row.nim}</td>
                <td>{row.prodi}</td>
                <td>{row.angkatan}</td>
                <td>{row.nama_matakuliah}</td>
                <td className="text-center">{row.semester}</td>
                <td className="text-center">{row.sks}</td>
                <td className="text-center">{row.nilai_awal}</td>
                <td className="text-center">{row.nilai_akhir}</td>
               <td className="text-center">
                {row.status_kelulusan?.toLowerCase() === "lulus" && (
                  <span className="badge bg-success">Lulus</span>
                )}
                {row.status_kelulusan?.toLowerCase() === "tidak lulus" && (
                  <span className="badge bg-danger">Tidak Lulus</span>
                )}
                {!row.status_kelulusan && <span className="badge bg-secondary">-</span>}
               </td>

                <td>{row.tempat_pelaksanaan || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: "#006" }} className="mt-2">
        <i>Klik/hover pada nama mahasiswa untuk info detail.</i>
      </div>
    </div>
  );
}

export default RiwayatNilaiDosenPage;
