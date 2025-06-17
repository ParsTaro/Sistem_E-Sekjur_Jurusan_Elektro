import React, { useEffect, useState, useMemo } from "react";
import {
  getRekapNilai,
  deleteDetailById,
  deleteDetailByFilter,
} from "../../services/sekjurService";
import { Loader2, FileDown, Filter, Trash2 } from "lucide-react";
import Papa from "papaparse";

function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      // Bersihkan semua tooltip lama agar tidak menumpuk
      document.querySelectorAll(".tooltip").forEach((el) => el.remove());

      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach((el) => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function RekapNilaiPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    prodi: "",
    status: "",
    kelulusan: "",
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data awal
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const rows = await getRekapNilai();
        setData(rows);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Hasil filter disimpan di memori agar stabil & efisien
  const filteredData = useMemo(() => {
    return data.filter(
      (row) =>
        (!filter.prodi ||
          row.prodi?.toLowerCase().includes(filter.prodi.toLowerCase())) &&
        (!filter.status || row.status_proses === filter.status) &&
        (!filter.kelulusan || row.status_kelulusan === filter.kelulusan) &&
        (!filter.search ||
          row.nama_mahasiswa
            ?.toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          row.nim?.toLowerCase().includes(filter.search.toLowerCase()) ||
          row.nama_dosen_pengampu
            ?.toLowerCase()
            .includes(filter.search.toLowerCase()))
    );
  }, [data, filter]);

  // Aktifkan tooltip setelah data yang difilter berubah
  useBootstrapTooltip(filteredData);

  const handleExport = () => {
    const csv = Papa.unparse(
      filteredData.map((row) => ({
        Tanggal: new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID"),
        Mahasiswa: row.nama_mahasiswa,
        NIM: row.nim,
        Prodi: row.prodi,
        Matakuliah: row.nama_matakuliah,
        Semester: row.semester,
        SKS: row.sks,
        Dosen: row.nama_dosen_pengampu,
        NIP: row.nip_dosen_pengampu || "-",
        "No. Telp Mahasiswa": row.no_telp_mahasiswa || "-",
        "Nilai Awal": row.nilai_awal,
        "Nilai Akhir": row.nilai_akhir,
        "Status Kelulusan": row.status_kelulusan,
        "Status Pengajuan": row.status_proses,
      })),
      { delimiter: ";" }
    );

    const today = new Date();
    const formattedDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}`;
    const filename = `rekap_semester_antara_${formattedDate}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDeleteOne = async (id_detail) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await deleteDetailById(id_detail);
      setData((prev) => prev.filter((item) => item.id_detail !== id_detail));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteFiltered = async () => {
    if (
      !window.confirm(
        "Yakin ingin menghapus SEMUA data yang cocok dengan filter ini?"
      )
    )
      return;

    try {
      const filterBody = {};
      if (filter.status) filterBody.status_proses = filter.status;
      if (filter.prodi) filterBody.prodi = filter.prodi;
      if (filter.kelulusan) filterBody.status_kelulusan = filter.kelulusan;
      if (filter.search) filterBody.search = filter.search;

      const response = await deleteDetailByFilter(filterBody);
      alert(response.message);

      setData((prev) => prev.filter((row) => !filteredData.includes(row)));
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <div className="container py-4" style={{ minHeight: "88vh" }}>
      <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
        <Filter size={28} style={{ color: "#22d3ee" }} />
        <h3 className="fw-bold mb-0 text-primary">
          Rekap Nilai & Pengajuan Semester Antara
        </h3>
        <button className="btn btn-success ms-auto" onClick={handleExport}>
          <FileDown size={18} className="me-1" /> Export CSV
        </button>
        <button className="btn btn-outline-danger ms-2" onClick={handleDeleteFiltered}>
          <Trash2 size={18} className="me-1" /> Hapus Filtered
        </button>
      </div>

      {/* Filter */}
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <input
            className="form-control"
            placeholder="Prodi"
            value={filter.prodi}
            onChange={(e) =>
              setFilter((f) => ({ ...f, prodi: e.target.value }))
            }
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filter.status}
            onChange={(e) =>
              setFilter((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">Semua Status</option>
            <option value="menunggu validasi">Menunggu Validasi</option>
            <option value="menunggu penugasan">Menunggu Penugasan</option>
            <option value="menunggu penilaian">Menunggu Penilaian</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={filter.kelulusan}
            onChange={(e) =>
              setFilter((f) => ({ ...f, kelulusan: e.target.value }))
            }
          >
            <option value="">Semua Kelulusan</option>
            <option value="lulus">Lulus</option>
            <option value="tidak lulus">Tidak Lulus</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Cari nama/nim/dosen"
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
              setFilter({ prodi: "", status: "", kelulusan: "", search: "" })
            }
          >
            Reset Filter
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>Tanggal</th>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              <th>Prodi</th>
              <th>Matakuliah</th>
              <th>Semester</th>
              <th>SKS</th>
              <th>Dosen</th>
              <th>Nilai Awal</th>
              <th>Nilai Akhir</th>
              <th>Status Kelulusan</th>
              <th>Status Pengajuan</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={12}>
                  <Loader2 className="me-2 spinner-border spinner-border-sm" />{" "}
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && filteredData.length === 0 && (
              <tr>
                <td colSpan={12}>
                  <i>Data kosong.</i>
                </td>
              </tr>
            )}
            {filteredData.map((row, idx) => (
              <tr key={row.id_detail + "-" + idx}>
                <td>
                  {new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID")}
                </td>
                <td>
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-title={`NIM: ${row.nim}\nProdi: ${row.prodi}\nAngkatan: ${row.angkatan}\nEmail: ${row.email_mahasiswa}\nNo. Telp: ${row.no_telp_mahasiswa}`}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline dotted",
                    }}
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
                    data-bs-title={`NIP: ${row.nip_dosen_pengampu || "-"}\nProdi: ${
                      row.prodi_dosen_pengampu || "-"
                    }`}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline dotted",
                    }}
                  >
                    {row.nama_dosen_pengampu || "-"}
                  </span>
                </td>
                <td className="text-center">
                  {row.nilai_awal ?? <span className="text-muted">-</span>}
                </td>
                <td className="text-center">
                  {row.nilai_akhir ?? <span className="text-muted">-</span>}
                </td>
                <td className="text-center">
                  {row.status_kelulusan === "lulus" && (
                    <span className="badge bg-success">Lulus</span>
                  )}
                  {row.status_kelulusan === "tidak lulus" && (
                    <span className="badge bg-danger">Tidak Lulus</span>
                  )}
                  {!row.status_kelulusan && (
                    <span className="badge bg-secondary">-</span>
                  )}
                </td>
                <td className="text-center">
                  {row.status_proses === "menunggu validasi" && (
                    <span className="badge bg-warning text-dark">
                      Menunggu Validasi
                    </span>
                  )}
                  {row.status_proses === "menunggu penugasan" && (
                    <span className="badge bg-primary">
                      Menunggu Penugasan
                    </span>
                  )}
                  {row.status_proses === "menunggu penilaian" && (
                    <span className="badge bg-info text-dark">
                      Menunggu Penilaian
                    </span>
                  )}
                  {row.status_proses === "selesai" && (
                    <span className="badge bg-success">Selesai</span>
                  )}
                  {row.status_proses === "ditolak" && (
                    <span className="badge bg-danger">Bukti Ditolak</span>
                  )}
                  <br />
                  <button
                    onClick={() => handleDeleteOne(row.id_detail)}
                    className="btn btn-sm btn-outline-danger mt-1"
                    title="Hapus data ini"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2" style={{ fontSize: 12, color: "#006" }}>
        <i>
          Klik/hover pada nama mahasiswa atau dosen untuk melihat detail
          kontak.
        </i>
      </div>
    </div>
  );
}

export default RekapNilaiPage;
