import React, { useEffect, useState } from "react";
import {
  getDaftarMatakuliah,
  getDaftarDosen,
  kirimPengajuan,
} from "../../services/mahasiswaService";
import {
  UploadCloud, Loader2, FileCheck, PlusCircle, Eye, XCircle
} from "lucide-react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

const NILAI_OPTIONS = ["A", "B", "C", "D", "E"];

function UploadBuktiPage() {
  const [matkulList, setMatkulList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [bukti, setBukti] = useState(null);
  const [jumlah, setJumlah] = useState("");
  const [prodi, setProdi] = useState("");
  const [semester, setSemester] = useState("");
  const [totalHarga, setTotalHarga] = useState(0);
  const [matakuliah, setMatakuliah] = useState([
    { matakuliah_id: "", dosen_pengampu: "", nilai_awal: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchMaster() {
      try {
        const [matkuls, dosens] = await Promise.all([
          getDaftarMatakuliah(),
          getDaftarDosen(),
        ]);
        setMatkulList(matkuls);
        setDosenList(dosens);
      } catch {
        setError("Gagal mengambil data matakuliah/dosen.");
      }
    }
    fetchMaster();
  }, []);

  const daftarProdi = [...new Set(matkulList.map((m) => m.prodi))];
  const daftarSemester = prodi
    ? [...new Set(matkulList.filter((m) => m.prodi === prodi).map((m) => m.semester))].sort()
    : [];

  const filteredMatkulList = prodi && semester
    ? matkulList.filter((mk) => mk.prodi === prodi && String(mk.semester) === String(semester))
    : [];

  const getProdiDosen = (prodiMahasiswa) => {
    if (!prodiMahasiswa) return "";
    const p = prodiMahasiswa.toUpperCase();
    if (p.includes("INFORMATIKA")) return "TEKNIK INFORMATIKA";
    if (p.includes("LISTRIK")) return "TEKNIK LISTRIK";
    return "";
  };

  const filteredDosenList = prodi
    ? dosenList.filter((dosen) => {
        const prodiDosen = getProdiDosen(prodi);
        return dosen.prodi?.toUpperCase() === prodiDosen;
      })
    : [];

  const handleChangeMatkul = (idx, field, value) => {
    const updated = matakuliah.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setMatakuliah(updated);
    const total = updated.reduce((sum, item) => {
      const mk = matkulList.find((m) => m.id === item.matakuliah_id);
      return sum + (mk?.total_harga || 0);
    }, 0);
    setTotalHarga(total);
  };

  const handleAddMatkul = () => {
    setMatakuliah(prev => [...prev, { matakuliah_id: "", dosen_pengampu: "", nilai_awal: "" }]);
  };

  const handleRemoveMatkul = (idx) => {
    const filtered = matakuliah.filter((_, i) => i !== idx);
    setMatakuliah(filtered);
    const total = filtered.reduce((sum, item) => {
      const mk = matkulList.find((m) => m.id === item.matakuliah_id);
      return sum + (mk?.total_harga || 0);
    }, 0);
    setTotalHarga(total);
  };

  const renderFilePreview = () => {
    if (!bukti) return null;
    const isImage = bukti.type.startsWith("image/");
    return (
      <div className="mb-3">
        <div className="fw-semibold mb-2">Preview Bukti:</div>
        <div style={{ border: "2px dashed #b8e3ef", padding: 12, borderRadius: 14 }}>
          {isImage ? (
            <img
              src={URL.createObjectURL(bukti)}
              alt="Preview"
              style={{ maxWidth: "100%", borderRadius: 10 }}
            />
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Eye size={18} /> <span>{bukti.name}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleSubmitFinal = async () => {
    setShowModal(false);
    setNotif("");
    setError("");
    setLoading(true);

    if (!bukti) {
      setError("File bukti pembayaran wajib diupload.");
      setLoading(false);
      return;
    }

    if (bukti.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB!");
      setLoading(false);
      return;
    }

    if (!jumlah || isNaN(jumlah)) {
      setError("Jumlah pembayaran wajib diisi dengan angka.");
      setLoading(false);
      return;
    }

    if (!prodi || !semester) {
      setError("Prodi dan semester wajib dipilih.");
      setLoading(false);
      return;
    }

    if (matakuliah.some(mk => !mk.matakuliah_id || !mk.dosen_pengampu || !mk.nilai_awal)) {
      setError("Setiap matakuliah wajib diisi lengkap, termasuk nilai awal!");
      setLoading(false);
      return;
    }

    if (totalHarga > Number(jumlah)) {
      setError("Total harga matakuliah melebihi jumlah pembayaran!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("bukti_pembayaran", bukti);
      formData.append("jumlah_pembayaran", jumlah);
      formData.append("matakuliahList", JSON.stringify(matakuliah));
      const res = await kirimPengajuan(formData);
      if (res?.message?.includes("sudah dalam proses") || res?.message?.includes("sedang berlangsung")) {
        setError(res.message);
        setLoading(false);
        return;
      }
      setNotif("Pengajuan berhasil dikirim! Menunggu validasi Sekjur.");
      setBukti(null);
      setJumlah("");
      setSemester("");
      setProdi("");
      setMatakuliah([{ matakuliah_id: "", dosen_pengampu: "", nilai_awal: "" }]);
      setTotalHarga(0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal mengirim pengajuan");
    }
    setLoading(false);
  };

  return (
    <div className="container py-4" style={{ minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ background: "rgba(255,255,255,0.99)", borderRadius: "2.2rem", boxShadow: "0 10px 32px #00d9ff19", border: "1.5px solid #b6f6fd33", padding: 30, width: "100%", maxWidth: 580 }}>
        <div className="d-flex align-items-center mb-2" style={{ gap: 8 }}>
          <UploadCloud size={33} style={{ color: "#00d9ff" }} />
          <h2 className="fw-bold text-primary mb-0">Pengajuan Semester Antara</h2>
        </div>

        <div className="alert alert-warning mb-3" style={{ borderRadius: 14 }}>
          <strong>⚠️ Perhatian:</strong> Sebelum mengajukan Semester Antara, pastikan Anda telah melihat <strong>riwayat pengajuan sebelumnya</strong> terlebih dahulu.<br />
          Pengajuan ganda terhadap matakuliah atau semester yang sama <u>dapat ditolak</u> oleh pihak Sekjur atau Prodi.
          <div className="mt-2">
            <a href="/mahasiswa/riwayat" className="btn btn-outline-primary btn-sm">
              <Eye size={16} className="me-1" /> Lihat Riwayat Pengajuan Anda
            </a>
          </div>
        </div>

        <div className="alert alert-info py-2 mb-3">Silakan upload bukti pembayaran dan pilih matakuliah yang ingin diambil.</div>
        {notif && <div className="alert alert-success mb-2">{notif}</div>}
        {error && <div className="alert alert-danger mb-2">{error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label fw-semibold">Bukti Pembayaran <span className="text-danger">*</span></label>
            <input type="file" className="form-control" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setBukti(e.target.files[0])} style={{ borderRadius: 12, background: "#f8fdff" }} />
            {renderFilePreview()}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Jumlah Pembayaran (Rp) <span className="text-danger">*</span></label>
            <input type="number" className="form-control" placeholder="cth: 900000" value={jumlah} onChange={e => setJumlah(e.target.value)} min={1} style={{ borderRadius: 12, background: "#f8fdff" }} />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Program Studi <span className="text-danger">*</span></label>
            <select className="form-select" value={prodi} onChange={(e) => {
              setProdi(e.target.value);
              setSemester("");
              setMatakuliah([{ matakuliah_id: "", dosen_pengampu: "", nilai_awal: "" }]);
              setTotalHarga(0);
            }} style={{ borderRadius: 12, background: "#f8fdff" }}>
              <option value="">Pilih Prodi</option>
              {daftarProdi.map((prd, idx) => (
                <option key={idx} value={prd}>{prd}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Semester yang Ditempuh <span className="text-danger">*</span></label>
            <select className="form-select" value={semester} onChange={(e) => {
              setSemester(e.target.value);
              setMatakuliah([{ matakuliah_id: "", dosen_pengampu: "", nilai_awal: "" }]);
              setTotalHarga(0);
            }} disabled={!prodi} style={{ borderRadius: 12, background: "#f8fdff" }}>
              <option value="">Pilih Semester</option>
              {daftarSemester.map((smt) => (
                <option key={smt} value={smt}>Semester {smt}</option>
              ))}
            </select>
          </div>

          {jumlah && totalHarga > Number(jumlah) && (
            <div className="alert alert-warning">Total biaya matakuliah ({totalHarga.toLocaleString("id-ID")}) melebihi jumlah pembayaran!</div>
          )}

          <div className="mb-2">
            <label className="form-label fw-semibold">Matakuliah, Dosen, & Nilai Awal <span className="text-danger">*</span></label>
            {matakuliah.map((row, idx) => (
              <div key={idx} className="row mb-2 align-items-center">
                <div className="col-md-5 mb-1">
                  <Autocomplete
                    disablePortal
                    options={filteredMatkulList}
                    getOptionLabel={(option) => `${option.nama_matakuliah} (SMT ${option.semester}, ${option.sks} SKS)`}
                    value={filteredMatkulList.find(mk => mk.id === row.matakuliah_id) || null}
                    onChange={(_, newValue) => handleChangeMatkul(idx, "matakuliah_id", newValue ? newValue.id : "")}
                    renderInput={(params) => <TextField {...params} label="Cari Matakuliah" size="small" sx={{ background: "#f8fdff", borderRadius: 2 }} />}
                  />
                </div>
                <div className="col-md-4 mb-1">
                  <Autocomplete
                    disablePortal
                    options={filteredDosenList}
                    getOptionLabel={(option) => `${option.nama} (${option.username})`}
                    value={filteredDosenList.find(ds => ds.username === row.dosen_pengampu) || null}
                    onChange={(_, newValue) => handleChangeMatkul(idx, "dosen_pengampu", newValue ? newValue.username : "")}
                    renderInput={(params) => <TextField {...params} label="Cari Dosen" size="small" sx={{ background: "#f8fdff", borderRadius: 2 }} />}
                  />
                </div>
                <div className="col-md-2 mb-1">
                  <select className="form-select" value={row.nilai_awal} onChange={e => handleChangeMatkul(idx, "nilai_awal", e.target.value)}>
                    <option value="">Nilai</option>
                    {NILAI_OPTIONS.map(val => <option key={val} value={val}>{val}</option>)}
                  </select>
                </div>
                <div className="col-md-1 text-center">
                  {matakuliah.length > 1 && (
                    <Tooltip title="Hapus">
                      <button type="button" className="btn btn-link text-danger" onClick={() => handleRemoveMatkul(idx)}>
                        <XCircle size={18} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-info mt-2" onClick={handleAddMatkul}>
              <PlusCircle size={16} className="me-1" /> Tambah Matakuliah
            </button>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-primary px-4 py-2" type="submit" disabled={loading}>
              {loading ? <><Loader2 size={18} className="me-2 spinner-border spinner-border-sm" /> Mengirim...</> : <>Ajukan Semester Antara <FileCheck size={18} className="ms-1" /></>}
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Pengajuan</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <Eye size={38} className="text-primary mb-2" />
                  <h5 className="fw-bold mb-2">Sudah Cek Riwayat Anda?</h5>
                  <p className="text-muted mb-1">
                    Sebelum melanjutkan, pastikan Anda telah <strong>meninjau riwayat pengajuan</strong> sebelumnya.
                  </p>
                  <p className="text-muted mb-0">
                    <em>Pengajuan ganda untuk matakuliah yang sama dapat <strong>ditolak otomatis</strong>.</em>
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitFinal}>Ya, Saya Yakin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadBuktiPage;
