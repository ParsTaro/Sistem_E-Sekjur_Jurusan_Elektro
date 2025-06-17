import React, { useEffect, useState } from "react";
import {
  getDaftarPengajuan,
  getDaftarDosen,
  kirimPenugasan,
} from "../../services/prodiService";
import { UserCheck, CalendarDays, MapPin, BadgeCheck, Loader2 } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


function useBootstrapTooltip(dep) {
  useEffect(() => {
    if (window.bootstrap) {
      const list = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      list.forEach(el => new window.bootstrap.Tooltip(el));
    }
  }, [dep]);
}


function PenugasanPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const [assigning, setAssigning] = useState("");
  useBootstrapTooltip(pengajuan); // agar tooltip aktif saat data pengajuan dimuat


  useEffect(() => {
    async function fetchAll() {
      setNotif("");
      setError("");
      try {
        const [pengajuanData, dosenData] = await Promise.all([
          getDaftarPengajuan(),
          getDaftarDosen(),
        ]);
        setPengajuan(pengajuanData);

        const defaultForm = {};
        pengajuanData.forEach(row => {
          defaultForm[row.id_detail] = {
            dosen_username: "",
            tanggal_mulai: "",
            tempat: "",
          };
        });
        setForm(defaultForm);
        setDosenList(dosenData);
      } catch (err) {
        setError(err.message || "Gagal mengambil data");
      }
    }
    fetchAll();
    // eslint-disable-next-line
  }, [notif]);

  const handleChange = (e, id_detail) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id_detail]: {
        ...prev[id_detail],
        [name]: value,
      },
    }));
  };

  const handleAssign = async (id_detail) => {
    setError("");
    setNotif("");
    setAssigning(id_detail);
    const values = form[id_detail] || {};
    const row = pengajuan.find(p => p.id_detail === id_detail);

    if (!values.dosen_username || !values.tanggal_mulai || !values.tempat) {
      setError("Pilih dosen, isi tanggal dan tempat!");
      setAssigning("");
      return;
    }

    try {
      await kirimPenugasan(
        id_detail,
        values.dosen_username,
        values.tanggal_mulai,
        values.tempat
      );
      setNotif(`✅ Penugasan berhasil untuk ${row.nama_mahasiswa} - ${row.nama_matakuliah}`);
    } catch (err) {
      setError(err.message || "Gagal menugaskan dosen");
    }
    setAssigning("");
  };

  const getDosenAvatar = username => {
    const dosen = dosenList.find(d => d.username === username);
    if (!dosen) return null;
    return (
      <span style={{
        background: "linear-gradient(135deg, #00d9ff 70%, #1be7c3 120%)",
        color: "#222",
        borderRadius: "50%",
        width: 32,
        height: 32,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 16,
        marginRight: 7,
        boxShadow: "0 2px 10px #00d9ff44"
      }}>
        {dosen.nama[0]}
      </span>
    );
  };

  const getProdiDosenByProdiMahasiswa = (prodiMahasiswa) => {
  if (!prodiMahasiswa) return "";
  if (prodiMahasiswa.includes("INFORMATIKA")) return "TEKNIK INFORMATIKA";
  if (prodiMahasiswa.includes("LISTRIK")) return "TEKNIK LISTRIK";
  if (prodiMahasiswa.includes("KOMPUTER")) return "TEKNIK KOMPUTER";
  return "";
};


  return (
    <div className="container py-4" style={{
      minHeight: "92vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.98)",
        borderRadius: "2.3rem",
        boxShadow: "0 10px 42px #00d9ff19, 0 1.5px 24px 0 #b1f6fd14",
        border: "1.5px solid #b6f6fd33",
        padding: "32px 20px 28px 20px",
        width: "100%",
        maxWidth: 1260
      }}>
        <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
          <BadgeCheck size={34} style={{ color: "#00d9ff" }} />
          <h2 className="fw-bold text-primary mb-0" style={{ letterSpacing: 0.7 }}>
            Penugasan Dosen Semester Antara
          </h2>
        </div>
        <div className="alert alert-info py-2 mb-3 shadow-sm fw-semibold">
          <UserCheck size={20} className="me-2" style={{ color: "#00d9ff" }} />
          Prodi dapat memilih dosen, mengatur tanggal mulai, dan tempat pelaksanaan.
        </div>
        {notif && <div className="alert alert-success shadow-sm">{notif}</div>}
        {error && <div className="alert alert-danger shadow-sm">{error}</div>}

        {pengajuan.length === 0 ? (
          <div className="alert alert-info text-center mb-0">
            Tidak ada pengajuan baru yang perlu penugasan.
          </div>
        ) : (
          <div style={{
            background: "rgba(249,254,255,0.99)",
            borderRadius: "1.4rem",
            boxShadow: "0 2px 20px #00d9ff18",
            border: "1.1px solid #b6f6fd24",
            padding: "10px 10px 0 10px",
            overflowX: "auto"
          }}>
            <table className="table table-bordered align-middle mb-3" style={{
              minWidth: "1000px",
              borderRadius: "1rem",
              fontFamily: "Poppins, Arial, sans-serif",
              fontSize: "0.95rem",
              borderCollapse: "collapse",
              backgroundColor: "#ffffff"
            }}>
              <thead className="table-light text-center" style={{
                background: "linear-gradient(90deg,#e9fcff,#ccf7ff 100%)"
              }}>
                <tr>
                  <th>NIM</th>
                  <th>Nama</th>
                  <th>Semester</th>
                  <th>Prodi</th>
                  <th>Mata Kuliah</th>
                  <th>
                    Dosen Pengampu<br /><span className="text-muted" style={{ fontSize: 12 }}>(Usulan Mahasiswa)</span>
                  </th>
                  <th>Pilih Dosen</th>
                  <th><CalendarDays size={17} /> Tanggal Mulai</th>
                  <th><MapPin size={17} /> Tempat</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengajuan.map((row) => (
                  <tr key={row.id_detail} style={{ background: "rgba(255,255,255,0.96)" }}>
                    <td className="fw-semibold">{row.nim}</td>
                  <td>
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-title={
                        `NIM: ${row.nim}\n` +
                        `Prodi: ${row.prodi}\n` +
                        `Angkatan: ${row.angkatan || "-"}\n` +
                        `No. Telp: ${row.no_telp || "-"}`
                      }
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline dotted",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {row.nama_mahasiswa}
                    </span>
                  </td>

                    <td>{row.semester}</td>
                    <td>{row.prodi}</td>
                    <td>{row.nama_matakuliah}</td>
                    <td>
                      {row.nama_dosen_usulan ? (
                        <span className="badge bg-info text-dark px-3 py-1">
                          {row.nama_dosen_usulan}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td style={{ minWidth: 150 }}>
                      <div className="d-flex align-items-center">
                        {getDosenAvatar(form[row.id_detail]?.dosen_username)}
                        <Autocomplete
                          size="small"
                          fullWidth
                          disablePortal
                          options={dosenList.filter(d =>
                            d.prodi === getProdiDosenByProdiMahasiswa(row.prodi)
                          )}
                          getOptionLabel={(option) => `${option.nama} - ${option.prodi}`}
                          value={dosenList.find(d => d.username === form[row.id_detail]?.dosen_username) || null}
                          onChange={(_, newValue) =>
                            handleChange(
                              { target: { name: "dosen_username", value: newValue?.username || "" } },
                              row.id_detail
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Cari & pilih dosen"
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{
                                backgroundColor: "#f8fdff",
                                fontSize: "0.9rem",
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "10px",
                                  border: "1.5px solid #b8e3ef",
                                  paddingY: "4px"
                                },
                                "& .MuiAutocomplete-input": {
                                  padding: "6.5px 4px"
                                },
                                "& input": {
                                  fontSize: "0.85rem"
                                }
                              }}
                            />
                          )}
                          ListboxProps={{
                            style: {
                              maxHeight: 250,
                              fontSize: "0.88rem",
                              overflowY: "auto"
                            }
                          }}
                        />

                      </div>
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        name="tanggal_mulai"
                        onChange={(e) => handleChange(e, row.id_detail)}
                        value={form[row.id_detail]?.tanggal_mulai || ""}
                        style={{
                          borderRadius: 10,
                          background: "#f8fdff",
                          border: "1.5px solid #b8e3ef"
                        }}
                      />
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="tempat"
                        placeholder="Tempat pelaksanaan"
                        onChange={(e) => handleChange(e, row.id_detail)}
                        value={form[row.id_detail]?.tempat || ""}
                        style={{
                          borderRadius: 10,
                          background: "#f8fdff",
                          border: "1.5px solid #b8e3ef"
                        }}
                      />
                    </td>
                    <td className="text-center" style={{ minWidth: 100 }}>
                      <button
                        className="btn btn-primary btn-sm px-3"
                        onClick={() => handleAssign(row.id_detail)}
                        disabled={assigning === row.id_detail}
                        style={{
                          borderRadius: "100px",
                          fontWeight: 600,
                          boxShadow: "0 2px 10px #00d9ff33"
                        }}
                      >
                        {assigning === row.id_detail ? (
                          <>
                            <Loader2 size={16} className="me-1 spinner-border spinner-border-sm" />
                            Memproses...
                          </>
                        ) : "Tugaskan"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PenugasanPage;
