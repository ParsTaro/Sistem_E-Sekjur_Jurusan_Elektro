const express = require('express');
const router = express.Router();

// ✅ Controller Sekjur
const sekjurController = require('../controllers/sekjur/sekjurController');

// ✅ Middleware otentikasi + otorisasi khusus Sekjur
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// 🔒 Semua endpoint berikut hanya bisa diakses oleh user role: sekjur
router.use(authenticateToken, authorizeRole('sekjur'));

// =========================
// 🔧 USER MANAGEMENT (opsional Sekjur)
// =========================
router.get('/users', sekjurController.getAllUsers);
router.get('/users/export-csv', sekjurController.exportCSV);
router.post('/users', sekjurController.createUser);
router.get('/users/:id', sekjurController.getUserById);
router.put('/users/:id', sekjurController.updateUser);
router.delete('/users/:id', sekjurController.deleteUser);


// =========================
// 📥 VALIDASI PENGAJUAN
// =========================
router.get('/pengajuan', sekjurController.getAllPengajuan);                         // Semua pengajuan masuk
router.get('/pengajuan/:id/detail', sekjurController.getPengajuanDetail);          // Detail pengajuan by ID
router.put('/pengajuan/:id/validasi', sekjurController.validasiPengajuan);         // Validasi oleh Sekjur
router.delete('/pengajuan/:id', sekjurController.deletePengajuanById);             // ❗ Hapus seluruh pengajuan & semua matakuliah (baru)

// =========================
// 📊 REKAP NILAI & EXPORT
// =========================
router.get('/rekap', sekjurController.getRekapNilai);                               // Rekap untuk ditampilkan
router.get('/rekap/download/csv', sekjurController.downloadRekapCSV);              // Ekspor CSV rekap nilai

// =========================
// 🧹 DELETE DETAIL
// =========================
router.delete('/pengajuan/detail/:id', sekjurController.deleteDetailById);         // Hapus satu matakuliah
router.post('/pengajuan/detail/delete-by-filter', sekjurController.deleteDetailByFilter); // Hapus by filter

// =========================
// 📚 MANAJEMEN MATAKULIAH
// =========================
router.get('/matakuliah', sekjurController.getAllMatakuliah);
router.post('/matakuliah', sekjurController.createMatakuliah);
router.put('/matakuliah/:id', sekjurController.updateMatakuliah);
router.delete('/matakuliah/:id', sekjurController.deleteMatakuliah);
router.get("/matakuliah/export/csv", sekjurController.exportMatakuliahCSV);


// ✅ Export router
module.exports = router;
