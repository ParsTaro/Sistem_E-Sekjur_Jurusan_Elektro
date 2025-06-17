const db = require("../../models/db");
const jwt = require("jsonwebtoken");

// Register mahasiswa saja (plaintext password & username = nim)
exports.register = (req, res) => {
  const {
    nama, username, password, tempat_lahir, tanggal_lahir, alamat, email,
    jurusan, prodi, angkatan, jenis_kelamin, no_telp
  } = req.body;
  const role = "mahasiswa";
  const nim = username;

  if (!nama || !username || !password || !tempat_lahir || !tanggal_lahir || !alamat || !email || !jurusan || !prodi || !angkatan || !jenis_kelamin || !no_telp) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  const sqlCheck = "SELECT * FROM users WHERE username = ?";
  db.query(sqlCheck, [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Error cek username" });
    if (result.length > 0) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const sqlInsert = `
      INSERT INTO users
        (nama, username, password, role, nim, tempat_lahir, tanggal_lahir, alamat, email, jurusan, prodi, angkatan, jenis_kelamin, no_telp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sqlInsert,
      [
        nama, username, password, role, nim, tempat_lahir, tanggal_lahir,
        alamat, email, jurusan, prodi, angkatan, jenis_kelamin, no_telp
      ],
      (err2) => {
        if (err2) {
          console.log("ERROR REGISTER:", err2);
          return res.status(500).json({ message: "Registrasi gagal" });
        }
        res.status(201).json({ message: "Registrasi berhasil" });
      });
  });
};






exports.login = (req, res) => {
  const { username, password, role } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND role = ?";
  db.query(sql, [username, role], (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal login" });
    if (result.length === 0) return res.status(404).json({ message: "Pengguna tidak ditemukan" });

    const user = result[0];

    // LANGSUNG COCOKKAN PLAINTEXT, BUKAN BCRYPT
    if (password !== user.password) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        nama: user.nama
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        nama: user.nama,
        role: user.role
      }
    });
  });
};




