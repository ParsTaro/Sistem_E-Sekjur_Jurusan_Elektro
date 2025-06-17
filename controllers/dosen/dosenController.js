const db = require("../../models/db");

// --- 1. GET semua penugasan dosen login (status_proses = 'menunggu penilaian') ---
exports.getPenugasanSaya = (req, res) => {
  const dosen = req.user.username;

  db.query(
    `SELECT
      d.id AS id_detail,
      ps.tanggal_pengajuan,
      u.nama AS nama_mahasiswa,
      u.nim,
      u.prodi,
      u.email,
      u.no_telp,
      u.jurusan,
      u.angkatan,
      m.nama_matakuliah,
      d.semester,
      d.sks,
      d.nilai_awal,
      d.nilai_akhir,
      d.status_kelulusan,
      d.tanggal_mulai,
      d.tempat_pelaksanaan,
      d.status_proses
    FROM pengajuan_sa_detail d
    JOIN pengajuan_sa ps ON d.id_pengajuan = ps.id
    JOIN users u ON ps.nim = u.username
    JOIN matakuliah m ON d.matakuliah_id = m.id
    WHERE d.dosen_pengampu = ?
      AND d.status_proses = 'menunggu penilaian'
    ORDER BY ps.tanggal_pengajuan DESC`,
    [dosen],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(rows);
    }
  );
};

// --- 2. UPDATE nilai akhir, status kelulusan & status proses jadi 'selesai' ---
exports.updateNilaiAkhir = (req, res) => {
  const dosen = req.user.username;
  const { id_detail } = req.params;
  const { nilai_akhir } = req.body;

  // Validasi input
  if (!nilai_akhir) {
    return res.status(400).json({ message: "Nilai akhir wajib diisi!" });
  }

  // Logika status kelulusan otomatis
  let status_kelulusan = "";
  if (["A", "B", "C"].includes(nilai_akhir)) {
    status_kelulusan = "lulus";
  } else if (["D", "E"].includes(nilai_akhir)) {
    status_kelulusan = "tidak lulus";
  } else {
    return res.status(400).json({ message: "Nilai akhir tidak valid!" });
  }

  // Update nilai, kelulusan, dan status proses
  const sql = `
    UPDATE pengajuan_sa_detail
    SET nilai_akhir = ?, status_kelulusan = ?, status_proses = 'selesai'
    WHERE id = ? AND dosen_pengampu = ?
  `;

  db.query(sql, [nilai_akhir, status_kelulusan, id_detail, dosen], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal update nilai." });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan atau bukan penugasan Anda." });
    }

    res.json({ message: "Nilai akhir berhasil disimpan. Status proses diselesaikan." });
  });
};

// --- 3. RIWAYAT PENILAIAN dosen (semua yang pernah dinilai dosen login) ---
exports.getRiwayatNilaiDosen = (req, res) => {
  const dosen = req.user.username;
  db.query(
    `SELECT
      d.id AS id_detail,
      ps.tanggal_pengajuan,
      u.nama AS nama_mahasiswa,
      u.nim, u.prodi, u.angkatan,
      m.nama_matakuliah,
      d.semester, d.sks,
      d.nilai_awal, d.nilai_akhir, d.status_kelulusan,
      d.tanggal_mulai, d.tempat_pelaksanaan,
      d.status_proses
    FROM pengajuan_sa_detail d
    JOIN pengajuan_sa ps ON d.id_pengajuan = ps.id
    JOIN users u ON ps.nim = u.username
    JOIN matakuliah m ON d.matakuliah_id = m.id
    WHERE d.dosen_pengampu = ?
      AND d.status_proses = 'selesai'
    ORDER BY d.tanggal_mulai DESC, d.id ASC`,
    [dosen],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json(rows);
    }
  );
};
