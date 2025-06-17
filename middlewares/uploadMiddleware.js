const multer = require('multer');
const path = require('path');

// Storage untuk file bukti pembayaran
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/bukti'); // pastikan folder sudah ada!
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

// File filter: hanya gambar/pdf
const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('File harus gambar/pdf'), false);
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
