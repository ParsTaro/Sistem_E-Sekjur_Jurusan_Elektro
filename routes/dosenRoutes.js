const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosen/dosenController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Middleware: semua route di bawah hanya bisa diakses oleh user dengan role 'dosen'
router.use(authenticateToken, authorizeRole('dosen'));

// --- 1. GET semua penugasan aktif dosen login ---
router.get('/penugasan', dosenController.getPenugasanSaya);

// --- 2. PUT update nilai akhir mahasiswa dan status kelulusan otomatis ---
router.put('/penugasan/:id_detail/nilai', dosenController.updateNilaiAkhir);

// --- 3. GET semua riwayat penilaian dosen (yang status_proses = 'selesai') ---
router.get('/riwayat-nilai', dosenController.getRiwayatNilaiDosen);

module.exports = router;
