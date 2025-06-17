const jwt = require("jsonwebtoken");

// Middleware untuk validasi JWT token
function authenticateToken(req, res, next) {
  // Ambil token dari header Authorization
  let token = req.headers.authorization?.split(" ")[1];

  // ✅ Tambahan: ambil token dari query jika tidak ada di header
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

// Middleware untuk proteksi role
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak: role tidak sesuai" });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRole
};
