const express = require('express');
const router = express.Router();
const prodiController = require('../controllers/prodi/prodiController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Semua endpoint prodi hanya untuk role prodi!
router.use(authenticateToken, authorizeRole('prodi'));

// Daftar pengajuan valid (siap penugasan)
router.get('/pengajuan', prodiController.getDaftarPengajuan);

// Daftar dosen (untuk assign)
router.get('/dosen', prodiController.getDaftarDosen);

// Proses penugasan dosen (per detail matakuliah)
router.put('/penugasan/:id_detail', prodiController.kirimPenugasan);

// Riwayat penugasan (tabel)
router.get('/riwayat-penugasan', prodiController.getRiwayatPenugasan);

module.exports = router;
