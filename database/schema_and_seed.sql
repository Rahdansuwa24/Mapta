-- ========================================================
-- MAPTA (Manajemen Pendaftaran dan Penilaian Magang)
-- Database: mapta
-- Target: TiDB Cloud Serverless / MySQL 8.0
-- Generated for Production Portfolio Showcase (Expanded Dataset)
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_users` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_level` enum('siswa','admin','pic') DEFAULT NULL,
  PRIMARY KEY (`id_users`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 2. Table structure for table `kelompok`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `kelompok`;
CREATE TABLE `kelompok` (
  `id_kelompok` int NOT NULL AUTO_INCREMENT,
  `tanggal_daftar` date DEFAULT NULL,
  PRIMARY KEY (`id_kelompok`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 3. Table structure for table `pic`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pic`;
CREATE TABLE `pic` (
  `id_pic` int NOT NULL AUTO_INCREMENT,
  `bidang` varchar(255) DEFAULT NULL,
  `id_users` int DEFAULT NULL,
  PRIMARY KEY (`id_pic`),
  KEY `id_users` (`id_users`),
  CONSTRAINT `pic_ibfk_1` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 4. Table structure for table `peserta_magang`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `peserta_magang`;
CREATE TABLE `peserta_magang` (
  `id_peserta_magang` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) DEFAULT NULL,
  `nomor_identitas` varchar(255) DEFAULT NULL,
  `foto_diri` varchar(255) DEFAULT NULL,
  `instansi` varchar(255) DEFAULT NULL,
  `tanggal_mulai_magang` date DEFAULT NULL,
  `tanggal_selesai_magang` date DEFAULT NULL,
  `kategori` enum('individu','kelompok') DEFAULT NULL,
  `dokumen_pendukung` varchar(555) DEFAULT NULL,
  `id_users` int DEFAULT NULL,
  `id_kelompok` int DEFAULT NULL,
  `jenjang` enum('siswa','dinas') DEFAULT NULL,
  `status_penerimaan` enum('Dipending','Diterima','Ditolak','Selesai','Final','Non-Aktif') DEFAULT 'Dipending',
  `surat_balasan` varchar(255) DEFAULT NULL,
  `sertifikat` varchar(255) DEFAULT NULL,
  `no_whatsapp` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `laporan_magang` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_peserta_magang`),
  KEY `id_users` (`id_users`),
  KEY `id_kelompok` (`id_kelompok`),
  KEY `status_penerimaan` (`status_penerimaan`),
  CONSTRAINT `peserta_magang_ibfk_1` FOREIGN KEY (`id_users`) REFERENCES `users` (`id_users`) ON DELETE CASCADE,
  CONSTRAINT `peserta_magang_ibfk_2` FOREIGN KEY (`id_kelompok`) REFERENCES `kelompok` (`id_kelompok`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 5. Table structure for table `aspek`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `aspek`;
CREATE TABLE `aspek` (
  `id_aspek` int NOT NULL AUTO_INCREMENT,
  `aspek` enum('teknis','non-teknis') DEFAULT NULL,
  `subjek` varchar(255) DEFAULT NULL,
  `bidang` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_aspek`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 6. Table structure for table `jadwal`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `jadwal`;
CREATE TABLE `jadwal` (
  `id_jadwal` int NOT NULL AUTO_INCREMENT,
  `tanggal_mulai` date DEFAULT NULL,
  `tanggal_selesai` date DEFAULT NULL,
  `id_peserta_magang` int DEFAULT NULL,
  `bidang` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_jadwal`),
  KEY `id_peserta_magang` (`id_peserta_magang`),
  CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`id_peserta_magang`) REFERENCES `peserta_magang` (`id_peserta_magang`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 7. Table structure for table `penilaian`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `penilaian`;
CREATE TABLE `penilaian` (
  `id_penilaian` int NOT NULL AUTO_INCREMENT,
  `penilaian` int DEFAULT NULL,
  `id_aspek` int DEFAULT NULL,
  `id_peserta_magang` int DEFAULT NULL,
  `id_pic` int DEFAULT NULL,
  `status_penilaian` enum('draft','final') DEFAULT 'draft',
  PRIMARY KEY (`id_penilaian`),
  KEY `id_aspek` (`id_aspek`),
  KEY `id_peserta_magang` (`id_peserta_magang`),
  KEY `id_pic` (`id_pic`),
  CONSTRAINT `penilaian_ibfk_1` FOREIGN KEY (`id_aspek`) REFERENCES `aspek` (`id_aspek`),
  CONSTRAINT `penilaian_ibfk_2` FOREIGN KEY (`id_peserta_magang`) REFERENCES `peserta_magang` (`id_peserta_magang`) ON DELETE CASCADE,
  CONSTRAINT `penilaian_ibfk_3` FOREIGN KEY (`id_pic`) REFERENCES `pic` (`id_pic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 8. Table structure for table `final_penilaian_non_teknis`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `final_penilaian_non_teknis`;
CREATE TABLE `final_penilaian_non_teknis` (
  `id_penilaian_final` int NOT NULL AUTO_INCREMENT,
  `nilai` int DEFAULT NULL,
  `id_peserta_magang` int DEFAULT NULL,
  `id_aspek` int DEFAULT NULL,
  PRIMARY KEY (`id_penilaian_final`),
  UNIQUE KEY `uniq_final` (`id_peserta_magang`,`id_aspek`),
  KEY `id_aspek` (`id_aspek`),
  CONSTRAINT `final_penilaian_non_teknis_ibfk_2` FOREIGN KEY (`id_aspek`) REFERENCES `aspek` (`id_aspek`),
  CONSTRAINT `final_penilaian_non_teknis_ibfk_3` FOREIGN KEY (`id_peserta_magang`) REFERENCES `peserta_magang` (`id_peserta_magang`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------
-- 9. Table structure for table `total`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `total`;
CREATE TABLE `total` (
  `id_total` int NOT NULL AUTO_INCREMENT,
  `total` int DEFAULT NULL,
  PRIMARY KEY (`id_total`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================================
-- DATA SEEDING (Password seluruh akun: Password123!)
-- Hash bcrypt: $2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna
-- ========================================================

-- Inisialisasi kuota maksimal peserta magang (Total 25 kuota)
INSERT INTO `total` (`id_total`, `total`) VALUES
(1, 25);

-- Akun Pengguna: Admin, PIC, dan Peserta
INSERT INTO `users` (`id_users`, `email`, `password`, `user_level`) VALUES
(1, 'admin@mapta.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'admin'),
(2, 'admin1@gmail.com', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'admin'),
(3, 'pic.deposit@mapta.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'pic'),
(4, 'pic.psd@mapta.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'pic'),
(5, 'pic.kearsipan@mapta.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'pic'),
-- Siswa Selesai
(6, 'ahmad.fauzi@pens.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(7, 'citra.lestari@ub.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
-- Siswa Diterima (Aktif)
(8, 'dewi.rahmawati@unair.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(9, 'budi.santoso@its.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(10, 'fajar.ramadhan@unesa.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
-- Siswa Dipending (Menunggu Seleksi)
(11, 'nadia.safitri@uinsa.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(12, 'dimas.wahyu@polinema.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(13, 'rina.kartika@polinema.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
-- Siswa Ditolak (Dengan Surat Balasan Penolakan)
(14, 'gilang.permana@umsurabaya.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa'),
(15, 'kevin.sanjaya@upnjatim.ac.id', '$2b$10$Gemku5De7c/prmZwRFNPcu5yOZIrMda.eniFGxqY38KuFQYNiUPna', 'siswa');

-- Data PIC Bidang / Divisi
INSERT INTO `pic` (`id_pic`, `bidang`, `id_users`) VALUES
(1, 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan', 3),
(2, 'Pengembangan Sumber Daya', 4),
(3, 'Penyelamatan dan Pendayagunaan Kearsipan', 5);

-- Aspek Penilaian Realistis (Dinas Perpustakaan & Kearsipan Jatim)
INSERT INTO `aspek` (`id_aspek`, `aspek`, `subjek`, `bidang`) VALUES
(1, 'teknis', 'Katalogisasi & Klasifikasi Bahan Pustaka', 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan'),
(2, 'teknis', 'Digitalisasi & Preservasi Naskah Kuno', 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan'),
(3, 'teknis', 'Pengolahan dan Pengadaan Koleksi Buku', 'Pengembangan Sumber Daya'),
(4, 'teknis', 'Analisis Data Kebutuhan Pemustaka', 'Pengembangan Sumber Daya'),
(5, 'teknis', 'Restorasi dan Preservasi Dokumen Fisik', 'Penyelamatan dan Pendayagunaan Kearsipan'),
(6, 'teknis', 'Manajemen Retensi dan Klasifikasi Arsip', 'Penyelamatan dan Pendayagunaan Kearsipan'),
(7, 'non-teknis', 'Kedisiplinan & Integritas Kerja', 'GLOBAL'),
(8, 'non-teknis', 'Kerjasama Tim & Komunikasi Efektif', 'GLOBAL'),
(9, 'non-teknis', 'Inisiatif, Kreativitas & Tanggung Jawab', 'GLOBAL');

-- Data Kelompok Pendaftaran (2 Kelompok)
INSERT INTO `kelompok` (`id_kelompok`, `tanggal_daftar`) VALUES
(1, '2026-08-15'),
(2, '2026-10-20');

-- Data Peserta Magang (10 Mahasiswa dengan Status Lengkap & Bervariasi)
INSERT INTO `peserta_magang` (`id_peserta_magang`, `nama`, `nomor_identitas`, `foto_diri`, `instansi`, `tanggal_mulai_magang`, `tanggal_selesai_magang`, `kategori`, `dokumen_pendukung`, `id_users`, `id_kelompok`, `jenjang`, `status_penerimaan`, `surat_balasan`, `sertifikat`, `no_whatsapp`, `jabatan`, `laporan_magang`) VALUES
-- Selesai
(1, 'Ahmad Fauzi', '3122500012', 'foto_fauzi.jpg', 'Politeknik Elektronika Negeri Surabaya', '2026-06-01', '2026-09-30', 'individu', 'berkas_fauzi.pdf', 6, NULL, 'siswa', 'Selesai', 'surat_balasan_fauzi.pdf', 'sertifikat_ahmad_fauzi.pdf', '081234567801', 'Web & Data Analyst Intern', 'laporan_magang_fauzi.pdf'),
(2, 'Citra Lestari', '215150201111012', 'foto_citra.jpg', 'Universitas Brawijaya', '2026-06-01', '2026-09-30', 'individu', 'berkas_citra.pdf', 7, NULL, 'siswa', 'Selesai', 'surat_balasan_citra.pdf', 'sertifikat_citra_lestari.pdf', '081234567802', 'Digital Archiving Intern', 'laporan_magang_citra.pdf'),
-- Diterima (Aktif)
(3, 'Dewi Rahmawati', '072211533045', 'foto_dewi.jpg', 'Universitas Airlangga', '2026-08-01', '2026-11-30', 'individu', 'berkas_dewi.pdf', 8, NULL, 'siswa', 'Diterima', 'surat_balasan_dewi.pdf', NULL, '081234567803', 'Library Preservation Intern', NULL),
(4, 'Budi Santoso', '5025211045', 'foto_budi.jpg', 'Institut Teknologi Sepuluh Nopember', '2026-08-01', '2026-11-30', 'kelompok', 'berkas_budi.pdf', 9, 1, 'siswa', 'Diterima', 'surat_balasan_budi.pdf', NULL, '081234567804', 'Systems Infrastructure Intern', NULL),
(5, 'Fajar Ramadhan', '22051204015', 'foto_fajar.jpg', 'Universitas Negeri Surabaya', '2026-09-01', '2026-12-31', 'individu', 'berkas_fajar.pdf', 10, NULL, 'siswa', 'Diterima', 'surat_balasan_fajar.pdf', NULL, '081234567805', 'Resource Management Intern', NULL),
-- Dipending (Menunggu Seleksi)
(6, 'Nadia Safitri', 'UIN22081023', 'foto_nadia.jpg', 'UIN Sunan Ampel Surabaya', '2026-10-01', '2027-01-31', 'individu', 'berkas_nadia.pdf', 11, NULL, 'siswa', 'Dipending', NULL, NULL, '081234567806', 'Calon Peserta', NULL),
(7, 'Dimas Wahyu', '2231710041', 'foto_dimas.jpg', 'Politeknik Negeri Malang', '2026-11-01', '2027-02-28', 'kelompok', 'berkas_dimas.pdf', 12, 2, 'siswa', 'Dipending', NULL, NULL, '081234567807', 'Calon Peserta', NULL),
(8, 'Rina Kartika', '2231710042', 'foto_rina.jpg', 'Politeknik Negeri Malang', '2026-11-01', '2027-02-28', 'kelompok', 'berkas_rina.pdf', 13, 2, 'siswa', 'Dipending', NULL, NULL, '081234567808', 'Calon Peserta', NULL),
-- Ditolak (Menampilkan Fitur Penolakan & Pengiriman Surat Penolakan)
(9, 'Gilang Permana', '20211112003', 'foto_gilang.jpg', 'Universitas Muhammadiyah Surabaya', '2026-08-01', '2026-11-30', 'individu', 'berkas_gilang.pdf', 14, NULL, 'siswa', 'Ditolak', 'surat_penolakan_gilang.pdf', NULL, '081234567809', 'Calon Peserta', NULL),
(10, 'Kevin Sanjaya', '22081010045', 'foto_kevin.jpg', 'UPN Veteran Jawa Timur', '2026-09-01', '2026-12-31', 'individu', 'berkas_kevin.pdf', 15, NULL, 'siswa', 'Ditolak', 'surat_penolakan_kevin.pdf', NULL, '081234567810', 'Calon Peserta', NULL);

-- Jadwal Rotasi Divisi Peserta Magang
INSERT INTO `jadwal` (`id_jadwal`, `tanggal_mulai`, `tanggal_selesai`, `id_peserta_magang`, `bidang`) VALUES
(1, '2026-06-01', '2026-07-31', 1, 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan'),
(2, '2026-08-01', '2026-09-30', 1, 'Pengembangan Sumber Daya'),
(3, '2026-06-01', '2026-07-31', 2, 'Penyelamatan dan Pendayagunaan Kearsipan'),
(4, '2026-08-01', '2026-09-30', 2, 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan'),
(5, '2026-08-01', '2026-09-30', 3, 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan'),
(6, '2026-10-01', '2026-11-30', 3, 'Penyelamatan dan Pendayagunaan Kearsipan'),
(7, '2026-08-01', '2026-09-30', 4, 'Penyelamatan dan Pendayagunaan Kearsipan'),
(8, '2026-10-01', '2026-11-30', 4, 'Pengembangan Sumber Daya'),
(9, '2026-09-01', '2026-10-31', 5, 'Pengembangan Sumber Daya'),
(10, '2026-11-01', '2026-12-31', 5, 'Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan');

-- Penilaian Teknis & Non-Teknis (Ahmad Fauzi - id 1, Selesai)
INSERT INTO `penilaian` (`id_penilaian`, `penilaian`, `id_aspek`, `id_peserta_magang`, `id_pic`, `status_penilaian`) VALUES
(1, 92, 1, 1, 1, 'final'),
(2, 90, 2, 1, 1, 'final'),
(3, 88, 3, 1, 2, 'final'),
(4, 91, 4, 1, 2, 'final'),
(5, 95, 7, 1, 1, 'final'),
(6, 92, 8, 1, 1, 'final'),
(7, 94, 9, 1, 1, 'final');

-- Penilaian Teknis & Non-Teknis (Citra Lestari - id 2, Selesai)
INSERT INTO `penilaian` (`id_penilaian`, `penilaian`, `id_aspek`, `id_peserta_magang`, `id_pic`, `status_penilaian`) VALUES
(8, 88, 5, 2, 3, 'final'),
(9, 86, 6, 2, 3, 'final'),
(10, 85, 1, 2, 1, 'final'),
(11, 87, 2, 2, 1, 'final'),
(12, 88, 7, 2, 3, 'final'),
(13, 85, 8, 2, 3, 'final'),
(14, 86, 9, 2, 3, 'final');

-- Penilaian Teknis & Non-Teknis (Dewi Rahmawati - id 3, Sedang Berjalan / Draft)
INSERT INTO `penilaian` (`id_penilaian`, `penilaian`, `id_aspek`, `id_peserta_magang`, `id_pic`, `status_penilaian`) VALUES
(15, 87, 1, 3, 1, 'final'),
(16, 85, 2, 3, 1, 'draft'),
(17, 90, 7, 3, 1, 'draft'),
(18, 88, 8, 3, 1, 'draft');

-- Penilaian Teknis & Non-Teknis (Budi Santoso - id 4, Sedang Berjalan / Draft)
INSERT INTO `penilaian` (`id_penilaian`, `penilaian`, `id_aspek`, `id_peserta_magang`, `id_pic`, `status_penilaian`) VALUES
(19, 89, 5, 4, 3, 'final'),
(20, 86, 6, 4, 3, 'draft');

-- Final Rekapitulasi Non-Teknis
INSERT INTO `final_penilaian_non_teknis` (`id_penilaian_final`, `nilai`, `id_peserta_magang`, `id_aspek`) VALUES
(1, 95, 1, 7),
(2, 92, 1, 8),
(3, 94, 1, 9),
(4, 88, 2, 7),
(5, 85, 2, 8),
(6, 86, 2, 9);

SET FOREIGN_KEY_CHECKS = 1;
