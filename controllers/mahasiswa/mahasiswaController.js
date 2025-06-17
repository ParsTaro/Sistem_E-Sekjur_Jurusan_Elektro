const db = require("../../models/db");

// 🔍 Ambil daftar semua dosen
exports.getDaftarDosen = (req, res) => {
  db.query(
    `SELECT username, nama, email, nip, prodi 
     FROM users 
     WHERE role = 'dosen' 
     ORDER BY nama`,
    [],
    (err, rows) => {
      if (err) {
        console.error("DB ERROR DOSEN:", err);
        return res.status(500).json({ message: "Gagal mengambil dosen" });
      }
      res.json(rows);
    }
  );
};


exports.getDaftarMatakuliah = (req, res) => {
  const { prodi, semester } = req.query;

  let sql = `SELECT id, nama_matakuliah, prodi, semester, sks, harga_per_sks, total_harga FROM matakuliah`;
  const params = [];

  const conditions = [];

  if (prodi) {
    conditions.push(`prodi = ?`);
    params.push(prodi);
  }

  if (!isNaN(parseInt(semester))) {
    conditions.push(`semester = ?`);
    params.push(parseInt(semester));
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  sql += ` ORDER BY semester ASC, nama_matakuliah ASC`;

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("DB ERROR MATKUL:", err);
      return res.status(500).json({ message: "Gagal mengambil matakuliah" });
    }
    res.json(rows);
  });
};


exports.uploadPengajuan = (req, res) => {
  const nim = req.user.username;
  const file = req.file;
  const { jumlah_pembayaran, matakuliahList, alasan } = req.body;

  let matakuliahArr;
  try {
    matakuliahArr = typeof matakuliahList === "string"
      ? JSON.parse(matakuliahList)
      : matakuliahList;
  } catch (e) {
    return res.status(400).json({ message: "Format matakuliahList salah." });
  }

  if (!file) return res.status(400).json({ message: "Bukti pembayaran wajib diupload." });
  if (!jumlah_pembayaran || isNaN(jumlah_pembayaran))
    return res.status(400).json({ message: "Jumlah pembayaran wajib diisi dengan angka." });

  if (!Array.isArray(matakuliahArr) || matakuliahArr.length === 0)
    return res.status(400).json({ message: "Pilih minimal satu matakuliah." });

  const mkIds = matakuliahArr.map((mk) => mk.matakuliah_id);

  // ✅ CEK: Apakah salah satu matakuliah sedang dalam proses (tidak selesai/ditolak)
  const cekQuery = `
    SELECT d.matakuliah_id
    FROM pengajuan_sa_detail d
    JOIN pengajuan_sa ps ON ps.id = d.id_pengajuan
    WHERE ps.nim = ?
      AND d.matakuliah_id IN (${mkIds.map(() => "?").join(",")})
      AND d.status_proses NOT IN ('selesai', 'ditolak')
  `;

  db.query(cekQuery, [nim, ...mkIds], (errCek, existing) => {
    if (errCek) {
      console.error("DB ERROR DUPLICATE CHECK:", errCek);
      return res.status(500).json({ message: "Gagal cek pengajuan sebelumnya." });
    }

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Terdapat matakuliah yang masih dalam proses atau belum selesai. Mohon cek riwayat Anda sebelum mengajukan kembali."
      });
    }

    // ✅ INSERT HEADER
    const insertHeader = `
      INSERT INTO pengajuan_sa (nim, bukti_pembayaran, jumlah_pembayaran, tanggal_pengajuan, alasan, status)
      VALUES (?, ?, ?, CURDATE(), ?, 'pending')
    `;
    db.query(insertHeader, [nim, file.filename, jumlah_pembayaran, alasan || null], (err, result) => {
      if (err) {
        console.error("DB ERROR HEADER:", err);
        return res.status(500).json({ message: "Gagal simpan pengajuan." });
      }

      const pengajuanId = result.insertId;

      db.query(
        `SELECT id, semester, sks, total_harga FROM matakuliah WHERE id IN (${mkIds.map(() => "?").join(",")})`,
        mkIds,
        (err2, matkulRows) => {
          if (err2) {
            console.error("DB ERROR MATKUL:", err2);
            return res.status(500).json({ message: "Gagal ambil data matakuliah." });
          }

          const mkMap = {};
          matkulRows.forEach((mk) => (mkMap[mk.id] = mk));

          const totalHarga = matakuliahArr.reduce((acc, mk) => {
            const harga = mkMap[mk.matakuliah_id]?.total_harga || 0;
            return acc + harga;
          }, 0);

          if (totalHarga > jumlah_pembayaran) {
            return res.status(400).json({
              message: `Total harga matakuliah (${totalHarga}) melebihi jumlah pembayaran (${jumlah_pembayaran})`
            });
          }

          const detailValues = matakuliahArr.map((mk) => [
            pengajuanId,
            mk.matakuliah_id,
            mk.dosen_pengampu,
            mkMap[mk.matakuliah_id]?.semester,
            mkMap[mk.matakuliah_id]?.sks,
            mkMap[mk.matakuliah_id]?.total_harga,
            mk.nilai_awal || null,
            null,
            null,
            'menunggu validasi',
            null,
            null
          ]);

          db.query(
            `INSERT INTO pengajuan_sa_detail 
              (id_pengajuan, matakuliah_id, dosen_pengampu, semester, sks, total_harga, 
               nilai_awal, nilai_akhir, status_kelulusan, status_proses, tanggal_mulai, tempat_pelaksanaan)
             VALUES ?`,
            [detailValues],
            (err3) => {
              if (err3) {
                console.error("DB ERROR DETAIL:", err3);
                return res.status(500).json({ message: "Gagal simpan detail matakuliah." });
              }
              res.json({ message: "Pengajuan Semester Antara berhasil dikirim!" });
            }
          );
        }
      );
    });
  });
};



// 📑 Ambil riwayat pengajuan mahasiswa
exports.getPengajuanHistory = (req, res) => {
  const nim = req.user.username;

  db.query(
    `SELECT 
        ps.id AS id_pengajuan,
        ps.tanggal_pengajuan,
        u.nama AS nama_mahasiswa,
        u.prodi,
        d.id AS id_detail,
        m.nama_matakuliah,
        d.semester,
        d.sks,
        d.dosen_pengampu,
        ud.nama AS nama_dosen_pengampu,
        ud.email AS email_dosen_pengampu,
        ud.no_telp AS no_telp_dosen_pengampu,
        d.nilai_awal,
        d.nilai_akhir,
        d.status_kelulusan,
        d.status_proses
     FROM pengajuan_sa ps
     JOIN users u ON ps.nim = u.username
     JOIN pengajuan_sa_detail d ON ps.id = d.id_pengajuan
     JOIN matakuliah m ON d.matakuliah_id = m.id
     LEFT JOIN users ud ON d.dosen_pengampu = ud.username
     WHERE ps.nim = ?
     ORDER BY ps.tanggal_pengajuan DESC, d.id ASC`,
    [nim],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json({ data: rows });
    }
  );
};

// 👤 Ambil profil mahasiswa
exports.getProfilMahasiswa = (req, res) => {
  const nim = req.user.username;
  db.query(
    "SELECT username, nama, prodi, email, no_telp FROM users WHERE username = ?",
    [nim],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil data profil" });
      if (!rows.length) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
      res.json(rows[0]);
    }
  );
};
