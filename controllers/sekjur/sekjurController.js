const db = require("../../models/db");
const { Parser } = require("json2csv");
const { parse } = require("json2csv"); // ← WAJIB ditambahkan

// --- USER MANAGEMENT (CRUD) ---

// Get all users (with filter + pagination)
exports.getAllUsers = (req, res) => {
  const { role, prodi, search, page = 1, pageSize = 15 } = req.query;
  let sql = `SELECT * FROM users WHERE 1=1`;
  const params = [];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }
  if (prodi) {
    sql += ` AND prodi = ?`;
    params.push(prodi);
  }
  if (search) {
    sql += ` AND (nama LIKE ? OR username LIKE ? OR email LIKE ? OR nim LIKE ? OR nip LIKE ?)`;
    const q = `%${search}%`;
    params.push(q, q, q, q, q);
  }

  sql += ` ORDER BY role, nama LIMIT ? OFFSET ?`;
  params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal mengambil data user" });
    res.json(rows);
  });
};

// Create user (cek duplikat username/nim/nip)
exports.createUser = (req, res) => {
  const {
    nama, username, password, role, tempat_lahir, tanggal_lahir,
    alamat, email, prodi, angkatan, jenis_kelamin, no_telp, nim, nip
  } = req.body;

  if (!nama || !username || !password || !role)
    return res.status(400).json({ message: "Field wajib tidak boleh kosong!" });

  const cek = `SELECT * FROM users WHERE username = ? OR nim = ? OR nip = ?`;
  db.query(cek, [username, nim, nip], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal cek duplikat user" });
    if (rows.length > 0) {
      return res.status(400).json({ message: "Username, NIM, atau NIP sudah digunakan!" });
    }

    const sql = `
      INSERT INTO users 
      (nama, username, password, role, tempat_lahir, tanggal_lahir, alamat, email, prodi, angkatan, jenis_kelamin, no_telp, nim, nip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nama, username, password, role, tempat_lahir, tanggal_lahir, alamat, email, prodi, angkatan, jenis_kelamin, no_telp, nim, nip], (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menambah user", error: err });
      res.json({ message: "User berhasil ditambah!" });
    });
  });
};

// Update user (cek duplikat username/nim/nip, kecuali diri sendiri)
exports.updateUser = (req, res) => {
  const {
    nama, username, password, role, tempat_lahir, tanggal_lahir,
    alamat, email, prodi, angkatan, jenis_kelamin, no_telp, nim, nip
  } = req.body;
  const id = req.params.id;

  const cek = `SELECT * FROM users WHERE (username = ? OR nim = ? OR nip = ?) AND id != ?`;
  db.query(cek, [username, nim, nip, id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Gagal cek duplikat user" });
    if (rows.length > 0) {
      return res.status(400).json({ message: "Username, NIM, atau NIP sudah digunakan oleh user lain!" });
    }

    let sql = `
      UPDATE users SET 
      nama = ?, username = ?, role = ?, tempat_lahir = ?, tanggal_lahir = ?, alamat = ?, 
      email = ?, prodi = ?, angkatan = ?, jenis_kelamin = ?, no_telp = ?, nim = ?, nip = ?`;
    const params = [nama, username, role, tempat_lahir, tanggal_lahir, alamat, email, prodi, angkatan, jenis_kelamin, no_telp, nim, nip];

    if (password) {
      sql += `, password = ?`;
      params.push(password);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal update user" });
      res.json({ message: "User berhasil diupdate!" });
    });
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  db.query(`SELECT * FROM users WHERE id = ?`, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    if (!rows.length) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(rows[0]);
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  db.query(`DELETE FROM users WHERE id = ?`, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal hapus user" });
    res.json({ message: "User berhasil dihapus!" });
  });
};

exports.exportCSV = (req, res) => {
  const { role, prodi, search } = req.query;

  let sql = `
    SELECT
      nama,
      role,
      nim,
      nip,
      username,
      email,
      prodi,
      angkatan,
      no_telp
    FROM users
    WHERE 1=1
  `;

  const params = [];

  if (role) {
    sql += " AND role = ?";
    params.push(role);
  }

  if (prodi) {
    sql += " AND prodi = ?";
    params.push(prodi);
  }

  if (search) {
    sql += ` AND (
      nama LIKE ? OR username LIKE ? OR email LIKE ? OR nim LIKE ? OR nip LIKE ?
    )`;
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error SQL Export:", err);
      return res.status(500).json({ message: "Gagal export data." });
    }

    try {
      const cleanedResults = results.map((row) => {
        const cleanedRow = {};
        for (let key in row) {
          cleanedRow[key] = String(row[key] || "")
            .replace(/\r?\n|\r/g, " ")
            .trim();
        }
        return cleanedRow;
      });

      const parser = new Parser({
        delimiter: ";",     // ✅ Titik koma supaya Excel pecah kolom
        quote: "",           // Hilangkan tanda kutip
        header: true,
      });

      const csv = parser.parse(cleanedResults);

      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("data_user_filtered.csv");
      return res.send(csv);
    } catch (err) {
      console.error("Error parsing CSV:", err);
      return res.status(500).json({ message: "Gagal membuat CSV." });
    }
  });
};


// --- VALIDASI PENGAJUAN ---

exports.getAllPengajuan = (req, res) => {
  const { status, prodi, search } = req.query;
  let sql = `
    SELECT
      ps.*, u.nama AS nama_mahasiswa, u.prodi, u.email, u.nim, u.no_telp
    FROM pengajuan_sa ps
    JOIN users u ON ps.nim = u.username
    WHERE 1=1
  `;
  const params = [];
  if (status) {
    sql += ` AND ps.status = ?`;
    params.push(status);
  }
  if (prodi) {
    sql += ` AND u.prodi = ?`;
    params.push(prodi);
  }
  if (search) {
    sql += ` AND (u.nama LIKE ? OR u.nim LIKE ? OR ps.nim LIKE ?)`;
    const q = `%${search}%`;
    params.push(q, q, q);
  }
  sql += ` ORDER BY ps.tanggal_pengajuan DESC, ps.id DESC`;

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json(rows);
  });
};

exports.getPengajuanDetail = (req, res) => {
  db.query(
    `SELECT
       ps.id AS id_pengajuan,
        u.nama, u.email, u.prodi, u.no_telp, u.nim,
        d.id AS id_detail,
        m.nama_matakuliah, d.semester, d.sks,
        m.total_harga,
        ud.nama AS nama_dosen_pengampu,
        ud.nip AS nip_dosen_pengampu,
        d.nilai_awal, d.nilai_akhir, d.status_kelulusan, d.status_proses,
        ps.tanggal_pengajuan
      FROM pengajuan_sa ps
      JOIN users u ON ps.nim = u.username
      JOIN pengajuan_sa_detail d ON ps.id = d.id_pengajuan
      JOIN matakuliah m ON d.matakuliah_id = m.id
      LEFT JOIN users ud ON d.dosen_pengampu = ud.username
      WHERE ps.id = ?
      ORDER BY d.id ASC`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json(rows);
    }
  );
};

exports.validasiPengajuan = (req, res) => {
  const { status, alasan } = req.body;

  db.query(
    `UPDATE pengajuan_sa SET status = ?, alasan = ? WHERE id = ?`,
    [status, alasan || null, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal validasi" });

      // VALID: lanjutkan ke penugasan
      if (status === "valid") {
        db.query(
          `UPDATE pengajuan_sa_detail SET status_proses = 'menunggu penugasan' WHERE id_pengajuan = ?`,
          [req.params.id],
          (err2) => {
            if (err2) return res.status(500).json({ message: "Gagal update status proses detail" });
            res.json({ message: "Status pengajuan dan proses detail berhasil diubah!" });
          }
        );
      }

      // INVALID: tolak pengajuan
      else if (status === "invalid") {
        db.query(
          `UPDATE pengajuan_sa_detail SET status_proses = 'ditolak' WHERE id_pengajuan = ?`,
          [req.params.id],
          (err2) => {
            if (err2) return res.status(500).json({ message: "Gagal update status proses detail" });
            res.json({ message: "Pengajuan ditolak dan status detail diubah ke 'ditolak'." });
          }
        );
      }

      // Default case
      else {
        res.json({ message: "Status pengajuan berhasil diubah!" });
      }
    }
  );
};



// --- REKAP NILAI & EXPORT ---
exports.getRekapNilai = (req, res) => {
  db.query(
    `SELECT
      ps.tanggal_pengajuan,
      ps.status AS status_pengajuan,
      d.status_proses,
      u.nama AS nama_mahasiswa, u.nim, u.prodi, u.angkatan, u.email AS email_mahasiswa, u.no_telp AS no_telp_mahasiswa,
      d.id AS id_detail, m.nama_matakuliah, d.semester, d.sks,
      ud.nama AS nama_dosen_pengampu, ud.nip AS nip_dosen_pengampu, ud.prodi AS prodi_dosen_pengampu,
      d.nilai_awal, d.nilai_akhir, d.status_kelulusan
    FROM pengajuan_sa ps
    JOIN users u ON ps.nim = u.username
    JOIN pengajuan_sa_detail d ON ps.id = d.id_pengajuan
    JOIN matakuliah m ON d.matakuliah_id = m.id
    LEFT JOIN users ud ON d.dosen_pengampu = ud.username
    ORDER BY ps.tanggal_pengajuan DESC, d.id ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil rekap" });
      res.json(rows);
    }
  );
};


exports.downloadRekapCSV = (req, res) => {
  db.query(
    `SELECT
      ps.tanggal_pengajuan, ps.status AS status_pengajuan,
      u.nama AS nama_mahasiswa, u.nim, u.prodi, u.angkatan, u.email AS email_mahasiswa, u.no_telp AS no_telp_mahasiswa,
      d.id AS id_detail, m.nama_matakuliah, d.semester, d.sks,
      ud.nama AS nama_dosen_pengampu, ud.nip AS nip_dosen_pengampu, ud.prodi AS prodi_dosen_pengampu,
      d.nilai_awal, d.nilai_akhir, d.status_kelulusan, d.status_proses
    FROM pengajuan_sa ps
    JOIN users u ON ps.nim = u.username
    JOIN pengajuan_sa_detail d ON ps.id = d.id_pengajuan
    JOIN matakuliah m ON d.matakuliah_id = m.id
    LEFT JOIN users ud ON d.dosen_pengampu = ud.username
    ORDER BY ps.tanggal_pengajuan DESC, d.id ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil rekap" });
      if (!rows.length) return res.status(404).send("Tidak ada data");

      const fields = [
        { label: "Tanggal Pengajuan", value: "tanggal_pengajuan" },
        { label: "Status Pengajuan", value: "status_pengajuan" },
        { label: "Nama Mahasiswa", value: "nama_mahasiswa" },
        { label: "NIM", value: "nim" },
        { label: "Prodi Mahasiswa", value: "prodi" },
        { label: "Angkatan", value: "angkatan" },
        { label: "Email Mahasiswa", value: "email_mahasiswa" },
        { label: "No Telp Mahasiswa", value: "no_telp_mahasiswa" },
        { label: "Matakuliah", value: "nama_matakuliah" },
        { label: "Semester", value: "semester" },
        { label: "SKS", value: "sks" },
        { label: "Nama Dosen", value: "nama_dosen_pengampu" },
        { label: "NIP Dosen", value: "nip_dosen_pengampu" },
        { label: "Prodi Dosen", value: "prodi_dosen_pengampu" },
        { label: "Nilai Awal", value: "nilai_awal" },
        { label: "Nilai Akhir", value: "nilai_akhir" },
        { label: "Status Kelulusan", value: "status_kelulusan" },
        { label: "Status Proses", value: "status_proses" }
      ];
      const parser = new Parser({ fields, delimiter: ";" });
      const csv = parser.parse(rows);

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", "attachment; filename=rekap-nilai-semester-antara.csv");
      res.status(200).send(csv);
    }
  );
};

// Hapus satu pengajuan detail berdasarkan ID
exports.deleteDetailById = (req, res) => {
  const id_detail = req.params.id;

  // 1. Ambil id_pengajuan dari detail
  db.query(`SELECT id_pengajuan FROM pengajuan_sa_detail WHERE id = ?`, [id_detail], (err1, result1) => {
    if (err1) return res.status(500).json({ message: "Gagal mencari data detail", error: err1 });
    if (!result1.length) return res.status(404).json({ message: "Data detail tidak ditemukan" });

    const id_pengajuan = result1[0].id_pengajuan;

    // 2. Hapus data detail
    db.query(`DELETE FROM pengajuan_sa_detail WHERE id = ?`, [id_detail], (err2, result2) => {
      if (err2) return res.status(500).json({ message: "Gagal menghapus data detail", error: err2 });

      // 3. Cek apakah masih ada data detail lain
      db.query(`SELECT COUNT(*) AS total FROM pengajuan_sa_detail WHERE id_pengajuan = ?`, [id_pengajuan], (err3, result3) => {
        if (err3) return res.status(500).json({ message: "Gagal cek sisa detail", error: err3 });

        if (result3[0].total === 0) {
          // 4. Jika tidak ada lagi, hapus juga data utama
          db.query(`DELETE FROM pengajuan_sa WHERE id = ?`, [id_pengajuan], (err4) => {
            if (err4) return res.status(500).json({ message: "Gagal menghapus pengajuan utama", error: err4 });
            return res.json({ message: "Detail dan pengajuan utama berhasil dihapus (karena kosong)." });
          });
        } else {
          return res.json({ message: "Data detail berhasil dihapus." });
        }
      });
    });
  });
};


// Hapus pengajuan detail berdasarkan filter
exports.deleteDetailByFilter = (req, res) => {
  const { status_proses, nim, matakuliah_id } = req.body;

  let sql = `DELETE d FROM pengajuan_sa_detail d
             JOIN pengajuan_sa ps ON d.id_pengajuan = ps.id
             WHERE 1=1`;
  const params = [];

  if (status_proses) {
    sql += ` AND d.status_proses = ?`;
    params.push(status_proses);
  }
  if (nim) {
    sql += ` AND ps.nim = ?`;
    params.push(nim);
  }
  if (matakuliah_id) {
    sql += ` AND d.matakuliah_id = ?`;
    params.push(matakuliah_id);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal menghapus data berdasarkan filter", error: err });
    res.json({ message: `${result.affectedRows} data berhasil dihapus.` });
  });
};

// Hapus seluruh pengajuan & detail
exports.deletePengajuanById = (req, res) => {
  const id_pengajuan = req.params.id;

  db.query(`DELETE FROM pengajuan_sa_detail WHERE id_pengajuan = ?`, [id_pengajuan], (err1) => {
    if (err1) return res.status(500).json({ message: "Gagal hapus detail", error: err1 });

    db.query(`DELETE FROM pengajuan_sa WHERE id = ?`, [id_pengajuan], (err2) => {
      if (err2) return res.status(500).json({ message: "Gagal hapus pengajuan utama", error: err2 });

      res.json({ message: "Pengajuan dan semua matakuliah berhasil dihapus!" });
    });
  });
};


// =========================
// 📚 MANAJEMEN MATAKULIAH
// =========================

// ✅ Ambil semua matakuliah dengan optional filter
exports.getAllMatakuliah = (req, res) => {
  const { prodi, semester, sks, search } = req.query;
  let sql = `SELECT * FROM matakuliah WHERE 1=1`;
  const params = [];

  if (prodi) {
    sql += ` AND prodi LIKE ?`;
    params.push(`%${prodi}%`);
  }

  if (semester) {
    sql += ` AND semester = ?`;
    params.push(Number(semester));
  }

  if (sks) {
    sql += ` AND sks = ?`;
    params.push(Number(sks));
  }

  if (search) {
    sql += ` AND nama_matakuliah LIKE ?`;
    params.push(`%${search}%`);
  }

  sql += ` ORDER BY semester ASC, nama_matakuliah ASC`;

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("GET MATAKULIAH ERROR:", err);
      return res.status(500).json({ message: "Gagal mengambil matakuliah" });
    }
    res.json(result);
  });
};

// ✅ Tambah matakuliah baru
exports.createMatakuliah = (req, res) => {
  const { nama_matakuliah, semester, sks, prodi } = req.body;

  if (!nama_matakuliah || !semester || !sks || !prodi) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  const harga_per_sks = 300000;
  const total_harga = harga_per_sks * parseInt(sks);

  const sql = `INSERT INTO matakuliah (nama_matakuliah, semester, sks, prodi, harga_per_sks, total_harga)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [nama_matakuliah, parseInt(semester), parseInt(sks), prodi, harga_per_sks, total_harga],
    (err, result) => {
      if (err) {
        console.error("CREATE MATAKULIAH ERROR:", err);
        return res.status(500).json({ message: "Gagal menambahkan matakuliah" });
      }
      res.json({ message: "Matakuliah berhasil ditambahkan" });
    }
  );
};

// ✅ Update matakuliah by ID
exports.updateMatakuliah = (req, res) => {
  const id = req.params.id;
  const { nama_matakuliah, semester, sks, prodi } = req.body;

  if (!nama_matakuliah || !semester || !sks || !prodi) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  const harga_per_sks = 300000;
  const total_harga = harga_per_sks * parseInt(sks);

  const sql = `UPDATE matakuliah
               SET nama_matakuliah = ?, semester = ?, sks = ?, prodi = ?, harga_per_sks = ?, total_harga = ?
               WHERE id = ?`;

  db.query(
    sql,
    [nama_matakuliah, parseInt(semester), parseInt(sks), prodi, harga_per_sks, total_harga, id],
    (err, result) => {
      if (err) {
        console.error("UPDATE MATAKULIAH ERROR:", err);
        return res.status(500).json({ message: "Gagal mengupdate matakuliah" });
      }
      res.json({ message: "Matakuliah berhasil diupdate" });
    }
  );
};

// ✅ Hapus matakuliah by ID
exports.deleteMatakuliah = (req, res) => {
  const id = req.params.id;

  db.query(`DELETE FROM matakuliah WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error("DELETE MATAKULIAH ERROR:", err);
      return res.status(500).json({ message: "Gagal menghapus matakuliah" });
    }
    res.json({ message: "Matakuliah berhasil dihapus" });
  });
};


exports.exportMatakuliahCSV = (req, res) => {
  const { prodi, semester, sks, search } = req.query;

  let sql = `SELECT nama_matakuliah, prodi, semester, sks, total_harga FROM matakuliah WHERE 1=1`;
  const params = [];

  if (prodi) {
    sql += ` AND prodi LIKE ?`;
    params.push(`%${prodi}%`);
  }

  if (semester) {
    sql += ` AND semester = ?`;
    params.push(Number(semester));
  }

  if (sks) {
    sql += ` AND sks = ?`;
    params.push(Number(sks));
  }

  if (search) {
    sql += ` AND nama_matakuliah LIKE ?`;
    params.push(`%${search}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("EXPORT MATAKULIAH CSV ERROR:", err);
      return res.status(500).json({ message: "Gagal mengekspor data" });
    }

    try {
      // Pastikan semua data tidak null dan properti cocok
      const safeData = results.map(row => ({
        nama_matakuliah: row.nama_matakuliah || "",
        prodi: row.prodi || "",
        semester: row.semester || 0,
        sks: row.sks || 0,
        total_harga: row.total_harga || 0
      }));

      const csv = parse(safeData, {
        fields: ["nama_matakuliah", "prodi", "semester", "sks", "total_harga"],
        delimiter: ";",
      });

      res.setHeader("Content-Type", "text/csv");
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;

        res.setHeader("Content-Disposition", `attachment; filename=matakuliah_export_${timestamp}.csv`);

      res.status(200).end(csv);
    } catch (e) {
      console.error("CSV PARSE ERROR:", e);
      res.status(500).json({ message: "Gagal memproses CSV" });
    }
  });
};
