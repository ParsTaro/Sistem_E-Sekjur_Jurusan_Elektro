// utils/exportUtils.js

const fs = require("fs");

exports.exportToCSV = (data, res) => {
  const headers = ["NIM", "Nama", "Mata Kuliah", "Nilai", "Indeks", "Status", "Tanggal Input"];
  const rows = data.map(d => [
    d.nim,
    d.nama,
    d.mata_kuliah,
    d.nilai_akhir,
    d.keterangan,
    d.status,
    d.tanggal_input,
  ]);
  let csv = headers.join(",") + "\n";
  rows.forEach(row => {
    csv += row.join(",") + "\n";
  });

  res.setHeader("Content-disposition", "attachment; filename=rekap_nilai.csv");
  res.set("Content-Type", "text/csv");
  res.status(200).send(csv);
};

