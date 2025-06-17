const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswa/mahasiswaController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Semua endpoint mahasiswa hanya untuk role mahasiswa!
router.use(authenticateToken, authorizeRole('mahasiswa'));

router.get('/matakuliah', mahasiswaController.getDaftarMatakuliah);
router.get('/dosen', mahasiswaController.getDaftarDosen);
router.post('/pengajuan', upload.single('bukti_pembayaran'), mahasiswaController.uploadPengajuan);
router.get('/pengajuan/history', mahasiswaController.getPengajuanHistory);
router.get('/profil', mahasiswaController.getProfilMahasiswa);

module.exports = router;
