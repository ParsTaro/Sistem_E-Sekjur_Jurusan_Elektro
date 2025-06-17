-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Jun 2025 pada 00.49
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `semester_antara`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `matakuliah`
--

CREATE TABLE `matakuliah` (
  `id` int(11) NOT NULL,
  `nama_matakuliah` varchar(100) NOT NULL,
  `prodi` varchar(50) NOT NULL,
  `semester` int(11) NOT NULL,
  `sks` int(11) NOT NULL,
  `harga_per_sks` int(11) NOT NULL DEFAULT 300000,
  `total_harga` int(11) GENERATED ALWAYS AS (`sks` * `harga_per_sks`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `matakuliah`
--

INSERT INTO `matakuliah` (`id`, `nama_matakuliah`, `prodi`, `semester`, `sks`, `harga_per_sks`) VALUES
(94, 'Sistem Operasi', 'D4 INFORMATIKA', 1, 3, 300000),
(95, 'Manajemen Proyek', 'D4 INFORMATIKA', 1, 2, 300000),
(96, 'UI/UX Design', 'D4 INFORMATIKA', 2, 4, 300000),
(97, 'Sistem Informasi', 'D4 INFORMATIKA', 2, 3, 300000),
(98, 'Sistem Embedded', 'D4 INFORMATIKA', 3, 3, 300000),
(99, 'Teknik Tenaga', 'D4 INFORMATIKA', 3, 2, 300000),
(100, 'Etika Profesi', 'D4 INFORMATIKA', 4, 2, 300000),
(101, 'Matematika Teknik', 'D4 INFORMATIKA', 4, 3, 300000),
(102, 'Robotika', 'D4 INFORMATIKA', 5, 2, 300000),
(103, 'Teknik Mikroprosesor', 'D4 INFORMATIKA', 5, 2, 300000),
(104, 'Basis Data', 'D4 INFORMATIKA', 6, 3, 300000),
(105, 'Mobile Programming', 'D4 INFORMATIKA', 6, 4, 300000),
(108, 'Big Data', 'D4 LISTRIK', 1, 3, 300000),
(109, 'Manajemen Proyek', 'D4 LISTRIK', 1, 3, 300000),
(110, 'Mobile Programming', 'D4 LISTRIK', 2, 2, 300000),
(111, 'Teknik Mikroprosesor', 'D4 LISTRIK', 2, 2, 300000),
(112, 'Matematika Teknik', 'D4 LISTRIK', 3, 4, 300000),
(113, 'Teknik Tenaga', 'D4 LISTRIK', 3, 2, 300000),
(114, 'Kecerdasan Buatan', 'D4 LISTRIK', 4, 3, 300000),
(115, 'Rekayasa Perangkat Lunak', 'D4 LISTRIK', 4, 2, 300000),
(116, 'Sensor dan Aktuator', 'D4 LISTRIK', 5, 3, 300000),
(117, 'PLC Dasar', 'D4 LISTRIK', 5, 2, 300000),
(118, 'Cloud Computing', 'D4 LISTRIK', 6, 3, 300000),
(119, 'UI/UX Design', 'D4 LISTRIK', 6, 2, 300000),
(120, 'Pemrograman Web', 'D4 LISTRIK', 7, 3, 300000),
(121, 'Teknik Mikroprosesor', 'D4 LISTRIK', 7, 2, 300000),
(122, 'Teknik Digital', 'D3 LISTRIK', 1, 3, 300000),
(123, 'Etika Profesi', 'D3 LISTRIK', 1, 2, 300000),
(124, 'Robotika', 'D3 LISTRIK', 2, 3, 300000),
(125, 'Teknik Tenaga', 'D3 LISTRIK', 2, 2, 300000),
(126, 'Manajemen Proyek', 'D3 LISTRIK', 3, 3, 300000),
(127, 'Cloud Computing', 'D3 LISTRIK', 3, 2, 300000),
(128, 'Teknik Mikroprosesor', 'D3 LISTRIK', 4, 3, 300000),
(129, 'Metodologi Penelitian', 'D3 LISTRIK', 4, 2, 300000),
(130, 'Sensor dan Aktuator', 'D3 LISTRIK', 5, 2, 300000),
(131, 'Rekayasa Perangkat Lunak', 'D3 LISTRIK', 5, 3, 300000),
(136, 'Sistem Embedded', 'D3 KOMPUTER', 1, 3, 300000),
(137, 'Mobile Programming', 'D3 KOMPUTER', 1, 2, 300000),
(138, 'Bahasa Inggris', 'D3 KOMPUTER', 2, 2, 300000),
(139, 'Teknik Digital', 'D3 KOMPUTER', 2, 3, 300000),
(140, 'Pemrograman Web', 'D3 KOMPUTER', 3, 2, 300000),
(141, 'Sistem Informasi', 'D3 KOMPUTER', 3, 3, 300000),
(142, 'Matematika Teknik', 'D3 KOMPUTER', 4, 3, 300000),
(143, 'Jaringan Komputer', 'D3 KOMPUTER', 4, 2, 300000),
(144, 'Teknik Mikroprosesor', 'D3 KOMPUTER', 5, 2, 300000),
(145, 'Cloud Computing', 'D3 KOMPUTER', 5, 3, 300000),
(150, 'Jaringan Komputer', 'D4 INFORMATIKA', 7, 2, 300000),
(151, 'Bahasa Inggris', 'D4 INFORMATIKA', 7, 3, 300000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengajuan_sa`
--

CREATE TABLE `pengajuan_sa` (
  `id` int(11) NOT NULL,
  `nim` varchar(50) NOT NULL,
  `bukti_pembayaran` varchar(255) NOT NULL,
  `jumlah_pembayaran` int(11) NOT NULL,
  `tanggal_pengajuan` date NOT NULL DEFAULT curdate(),
  `status` enum('pending','valid','invalid') DEFAULT NULL,
  `alasan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengajuan_sa_detail`
--

CREATE TABLE `pengajuan_sa_detail` (
  `id` int(11) NOT NULL,
  `id_pengajuan` int(11) NOT NULL,
  `matakuliah_id` int(11) NOT NULL,
  `dosen_pengampu` varchar(50) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `sks` int(11) DEFAULT NULL,
  `total_harga` int(11) DEFAULT NULL,
  `nilai_awal` enum('A','B','C','D','E') DEFAULT NULL,
  `nilai_akhir` enum('A','B','C','D','E') DEFAULT NULL,
  `status_kelulusan` enum('lulus','tidak lulus') DEFAULT NULL,
  `status_proses` enum('menunggu validasi','menunggu penugasan','dalam penugasan','menunggu penilaian','sudah dinilai','selesai','ditolak') DEFAULT NULL,
  `tanggal_mulai` date DEFAULT NULL,
  `tempat_pelaksanaan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `role` enum('mahasiswa','dosen','prodi','sekjur') NOT NULL,
  `nim` varchar(30) DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `jurusan` varchar(100) DEFAULT NULL,
  `prodi` varchar(100) DEFAULT NULL,
  `angkatan` varchar(10) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `no_telp` varchar(20) DEFAULT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama`, `role`, `nim`, `tempat_lahir`, `tanggal_lahir`, `alamat`, `email`, `jurusan`, `prodi`, `angkatan`, `jenis_kelamin`, `no_telp`, `nip`, `created_at`) VALUES
(2, '19810001', 'dosen123', 'Dosen Matkul', 'dosen', '', '', '0000-00-00', '', '', NULL, 'TEKNIK INFORMATIKA', '', '', '082112223333', '19871', '2025-06-14 04:53:46'),
(3, '19820001', 'prodi123', 'Kaprogdi TI', 'prodi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '082199988877', '198811112023041001', '2025-06-14 04:53:46'),
(4, '19830001', 'sekjur123', 'Sekjur Teknik', 'sekjur', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '082133344455', '198811112023041002', '2025-06-14 04:53:46'),
(5, '123123', '123123', 'angel', 'mahasiswa', '123123', 'talawaan', '0000-00-00', 'manado', 'angelmrcllamaweikere@gmail.com', 'teknik intormatika', 'TEKNIK INFORMATIKA', '2022', 'P', '085756947133', '', '2025-06-15 15:43:46'),
(6, 'DEVIN FERDINAN PITOY', '123123', 'diasjafk', 'mahasiswa', '21312', 'talawaan', '2025-06-20', 'manado', 'angelmrcllamaweikere@gmail.com', NULL, 'TEKNIK LISTRIK', '2022', 'L', '085756947133', '12312', '2025-06-16 21:49:48'),
(8, '55555', '123123', 'diasjafk', 'mahasiswa', '123123123', 'talawaan', '2025-06-27', 'manado', 'angelmrcllamaweikere@gmail.com', NULL, 'TEKNIK KOMPUTER', '2022', 'L', '085756947134', '123123123', '2025-06-16 21:57:00');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `matakuliah`
--
ALTER TABLE `matakuliah`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pengajuan_sa`
--
ALTER TABLE `pengajuan_sa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nim` (`nim`);

--
-- Indeks untuk tabel `pengajuan_sa_detail`
--
ALTER TABLE `pengajuan_sa_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengajuan` (`id_pengajuan`),
  ADD KEY `matakuliah_id` (`matakuliah_id`),
  ADD KEY `idx_dosen_pengampu` (`dosen_pengampu`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `matakuliah`
--
ALTER TABLE `matakuliah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT untuk tabel `pengajuan_sa`
--
ALTER TABLE `pengajuan_sa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT untuk tabel `pengajuan_sa_detail`
--
ALTER TABLE `pengajuan_sa_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pengajuan_sa`
--
ALTER TABLE `pengajuan_sa`
  ADD CONSTRAINT `pengajuan_sa_ibfk_1` FOREIGN KEY (`nim`) REFERENCES `users` (`username`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengajuan_sa_detail`
--
ALTER TABLE `pengajuan_sa_detail`
  ADD CONSTRAINT `pengajuan_sa_detail_ibfk_1` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuan_sa` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuan_sa_detail_ibfk_2` FOREIGN KEY (`matakuliah_id`) REFERENCES `matakuliah` (`id`),
  ADD CONSTRAINT `pengajuan_sa_detail_ibfk_3` FOREIGN KEY (`dosen_pengampu`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
