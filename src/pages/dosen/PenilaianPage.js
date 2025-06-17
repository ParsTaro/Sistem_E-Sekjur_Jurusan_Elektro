import React, { useEffect, useState } from "react";
import { getPenugasanSaya, updateNilaiAkhir } from "../../services/dosenService";
import {
  FileCheck2,
  UserCheck,
  BadgeCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      document.querySelectorAll(".tooltip").forEach(el => el.remove());
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}

function PenilaianPage() {
  const [daftar, setDaftar] = useState([]);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useBootstrapTooltip(daftar);

  useEffect(() => {
    async function fetchAll() {
      setNotif("");
      setError("");
      setLoading(true);
      try {
        const data = await getPenugasanSaya();
        setDaftar(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchAll();
  }, [notif]);

  const handleChange = (e, detail_id) => {
    const { name, value } = e.target;
    let updated = {
      ...form[detail_id],
      [name]: value,
    };

    if (name === "nilai_akhir") {
      if (["A", "B", "C"].includes(value)) {
        updated.status = "lulus";
      } else if (["D", "E"].includes(value)) {
        updated.status = "tidak lulus";
      } else {
        updated.status = "";
      }
    }

    setForm({
      ...form,
      [detail_id]: updated,
    });
  };

  const handleNilai = async (row) => {
    const detail_id = row.id_detail;
    const values = form[detail_id] || {};

    if (!values.nilai_akhir) {
      setError("Silakan pilih nilai akhir terlebih dahulu.");
      return;
    }

    try {
      setError("");
      setNotif("");
      setLoading(true);
      await updateNilaiAkhir(detail_id, values.nilai_akhir);
      setNotif("Penilaian berhasil disimpan!");
      setForm({});
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const statusBadge = (status) => {
    if (status === "lulus") {
      return (
        <span className="badge bg-success rounded-pill d-flex align-items-center justify-content-center gap-1">
          <ThumbsUp size={15} /> Lulus
        </span>
      );
    }
    if (status === "tidak lulus") {
      return (
        <span className="badge bg-danger rounded-pill d-flex align-items-center justify-content-center gap-1">
          <ThumbsDown size={15} /> Tidak Lulus
        </span>
      );
    }
    return <span className="badge bg-secondary rounded-pill">-</span>;
  };

  return (
    <div className="container py-4 d-flex flex-column align-items-center" style={{ minHeight: "92vh" }}>
      <div className="p-4 shadow rounded-4 w-100" style={{ maxWidth: 1200, background: "#fff" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <BadgeCheck size={28} style={{ color: "#00d9ff" }} />
          <h4 className="fw-bold text-primary mb-0">Penilaian Semester Antara</h4>
        </div>

        <div className="alert alert-info py-2 d-flex align-items-center gap-2">
          <FileCheck2 size={18} style={{ color: "#00d9ff" }} />
          Silakan pilih <strong>nilai akhir (A–E)</strong>. Status kelulusan akan muncul otomatis.
        </div>

        {notif && (
          <div className="alert alert-success d-flex align-items-center gap-2">
            <UserCheck size={18} /> {notif}
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" />
            <div className="mt-2">Memuat data...</div>
          </div>
        ) : daftar.length === 0 ? (
          <div className="alert alert-warning text-center">
            Tidak ada mahasiswa yang ditugaskan saat ini.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>Tanggal</th>
                  <th>Mahasiswa</th>
                  <th>Prodi</th>
                  <th>Mata Kuliah</th>
                  <th>Semester</th>
                  <th>SKS</th>
                  <th>Nilai Awal</th>
                  <th>Tanggal Mulai</th>
                  <th>Tempat</th>
                  <th>Nilai Akhir</th>
                  <th>Kelulusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {daftar.map((row) => {
                  const detail_id = row.id_detail;
                  return (
                    <tr key={detail_id}>
                      <td>{new Date(row.tanggal_pengajuan).toLocaleDateString("id-ID")}</td>
                      <td>
                        <span
                      data-bs-toggle="tooltip"
                      data-bs-title={
                        `Nama: ${row.nama_mahasiswa}\n` +
                        `NIM: ${row.nim}\n` +
                        `Email: ${row.email || "-"}\n` +
                        `No Telp: ${row.no_telp || "-"}\n` +
                        `Jurusan: ${row.jurusan || "-"}\n` +
                        `Prodi: ${row.prodi || "-"}\n` +
                        `Angkatan: ${row.angkatan || "-"}`
                      }
                      data-bs-html="true"
                      data-bs-custom-class="tooltip-left"
                      style={{ cursor: "pointer", textDecoration: "underline dotted" }}
                    >
                      {row.nama_mahasiswa}
                    </span>

                      </td>
                      <td>{row.prodi}</td>
                      <td>{row.nama_matakuliah}</td>
                      <td>{row.semester}</td>
                      <td>{row.sks}</td>
                      <td>{row.nilai_awal}</td>
                      <td>{row.tanggal_mulai ? new Date(row.tanggal_mulai).toLocaleDateString("id-ID") : "-"}</td>
                      <td>{row.tempat_pelaksanaan || "-"}</td>
                      <td>
                        <select
                          name="nilai_akhir"
                          className="form-select"
                          value={form[detail_id]?.nilai_akhir || ""}
                          onChange={(e) => handleChange(e, detail_id)}
                        >
                          <option value="">Pilih</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </td>
                      <td>{statusBadge(form[detail_id]?.status || row.status_kelulusan)}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm rounded-pill px-3"
                          onClick={() => handleNilai(row)}
                        >
                          Simpan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PenilaianPage;
