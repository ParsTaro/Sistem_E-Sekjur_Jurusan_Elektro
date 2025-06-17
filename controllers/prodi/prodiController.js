const db = require("../../models/db");

// --- 1. GET semua pengajuan (siap ditugaskan Prodi) ---
exports.getDaftarPengajuan = (req, res) => {
  db.query(
    `SELECT
      ps.id AS id_pengajuan,
      ps.tanggal_pengajuan,
      u.nama AS nama_mahasiswa,
      u.nim,
      u.prodi,
      u.angkatan,
      u.no_telp,
      d.id AS id_detail,
      m.nama_matakuliah,
      d.semester,
      d.sks,
      d.dosen_pengampu AS dosen_usulan,
      ud.nama AS nama_dosen_usulan,
      d.nilai_awal,
      ps.status AS status_pengajuan,
      d.status_proses
    FROM pengajuan_sa ps
    JOIN users u ON ps.nim = u.username
    JOIN pengajuan_sa_detail d ON ps.id = d.id_pengajuan
    JOIN matakuliah m ON d.matakuliah_id = m.id
    LEFT JOIN users ud ON d.dosen_pengampu = ud.username
    WHERE ps.status = 'valid' AND d.status_proses = 'menunggu penugasan'
    ORDER BY ps.tanggal_pengajuan DESC, d.id ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json(rows);
    }
  );
};

// --- 2. GET daftar dosen (untuk dropdown penugasan) ---
exports.getDaftarDosen = (req, res) => {
  db.query(
    `SELECT username, nama, prodi, angkatan, no_telp, email FROM users WHERE role = 'dosen' ORDER BY nama`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil dosen" });
      res.json(rows);
    }
  );
};

// --- 3. PROSES PENUGASAN DOSEN (update dosen_pengampu & jadwal) ---
exports.kirimPenugasan = (req, res) => {
  const { id_detail } = req.params;
  const { dosen_username, tanggal_mulai, tempat } = req.body;

  if (!dosen_username || !tanggal_mulai || !tempat) {
    return res.status(400).json({ message: "Semua field penugasan wajib diisi!" });
  }

  db.query(
    `UPDATE pengajuan_sa_detail
     SET dosen_pengampu = ?, tanggal_mulai = ?, tempat_pelaksanaan = ?, status_proses = 'menunggu penilaian'
     WHERE id = ?`,
    [dosen_username, tanggal_mulai, tempat, id_detail],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menyimpan penugasan" });

      res.json({ message: "Penugasan dosen berhasil diproses!" });
    }
  );
};

// --- 4. RIWAYAT PENUGASAN (semua pengajuan yang sudah punya dosen) ---
// 📄 GET Riwayat Penugasan Dosen (tanpa status dari pengajuan_sa)
exports.getRiwayatPenugasan = (req, res) => {
  db.query(
    `SELECT
      ps.tanggal_pengajuan,
      u.nama AS nama_mahasiswa,
      u.nim,
      u.prodi,
      d.id AS id_detail,
      m.nama_matakuliah,
      d.semester,
      d.sks,
      d.tanggal_mulai,
      d.tempat_pelaksanaan,
      d.dosen_pengampu,
      ud.nama AS nama_dosen,
      ud.prodi AS prodi_dosen,
      d.nilai_awal,
      d.nilai_akhir,
      d.status_kelulusan,
      d.status_proses
    FROM pengajuan_sa_detail d
    JOIN pengajuan_sa ps ON ps.id = d.id_pengajuan
    JOIN users u ON ps.nim = u.username
    JOIN matakuliah m ON d.matakuliah_id = m.id
    LEFT JOIN users ud ON d.dosen_pengampu = ud.username
    WHERE d.status_proses NOT IN ('menunggu validasi', 'menunggu penugasan', 'ditolak')
    ORDER BY d.tanggal_mulai DESC, d.id ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json(rows);
    }
  );
};



