# Database Panduan MAPTA (TiDB Cloud / MySQL)

Folder ini berisi skema database dan data awal (*seed*) resmi untuk sistem **MAPTA (Manajemen Pendaftaran dan Penilaian Magang)**.

## Berkas Tersedia

* **`schema_and_seed.sql`**: Berisi seluruh DDL tabel (`users`, `peserta_magang`, `pic`, `aspek`, `jadwal`, `penilaian`, `final_penilaian_non_teknis`, `kelompok`, `total`) serta data dummy realistis (10 mahasiswa lintas status, 3 PIC bidang, aspek resmi Dinas Perpustakaan Jatim, dan kuota awal).

## Akun Default untuk Pengujian (Semua Password: `Password123!`)

| Peran (Role) | Email | Deskripsi |
| :--- | :--- | :--- |
| **Admin** | `admin@mapta.id` | Akses penuh verifikasi berkas, persetujuan sertifikat, dan kuota |
| **PIC Deposit** | `pic.deposit@mapta.id` | Pembimbing Bidang Deposit & Pelestarian Pustaka |
| **PIC PSD** | `pic.psd@mapta.id` | Pembimbing Bidang Pengembangan Sumber Daya |
| **PIC Kearsipan** | `pic.kearsipan@mapta.id` | Pembimbing Bidang Penyelamatan & Pendayagunaan Kearsipan |
| **Siswa (Selesai)** | `ahmad.fauzi@pens.ac.id` | Status Selesai, nilai Grade A, sertifikat terbit |
| **Siswa (Aktif)** | `dewi.rahmawati@unair.ac.id` | Status Diterima, sedang menjalani rotasi divisi |
| **Siswa (Pending)**| `budi.santoso@its.ac.id` | Status Dipending, menunggu verifikasi berkas admin |

## Cara Impor ke TiDB Cloud Serverless

1. Buka dashboard **TiDB Cloud** > **SQL Editor**.
2. Buat database:
   ```sql
   CREATE DATABASE IF NOT EXISTS mapta;
   USE mapta;
   ```
3. Salin seluruh isi file `schema_and_seed.sql` dan jalankan (**Run**).
