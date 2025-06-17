import React, { useState, useEffect } from "react";
import { uploadBuktiPembayaran, getStatusBukti } from "../services/mahasiswaService";

function BuktiPembayaranPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [preview, setPreview] = useState(null);

  const refreshStatus = () => {
    getStatusBukti().then(res => {
      setStatus(res.status);
      setKeterangan(res.keterangan);
      setPreview(res.file ? `http://localhost:5000/uploads/${res.file}` : null);
    });
  };

  useEffect(() => { refreshStatus(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file bukti dulu!");
    await uploadBuktiPembayaran(file);
    alert("Berhasil upload, menunggu validasi");
    refreshStatus();
  };

  return (
    <div>
      <h2>Upload Bukti Pembayaran</h2>
      {status === "invalid" && (
        <div style={{color: "red"}}>Ditolak: {keterangan}</div>
      )}
      {preview && <img src={preview} alt="bukti" width={200} />}
      {(status !== "pending" && status !== "valid") && (
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])} />
          <button type="submit">Upload</button>
        </form>
      )}
      {status === "pending" && <div>Menunggu validasi Sekjur...</div>}
      {status === "valid" && <div style={{color: "green"}}>Bukti valid! Lanjut isi form Semester Antara.</div>}
    </div>
  );
}

export default BuktiPembayaranPage;
