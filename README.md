# MAPTA (Manajemen Pendaftaran dan Penilaian Magang)

Sistem Informasi Manajemen Magang dan Kerja Praktik berbasis web modern yang dirancang untuk mempermudah, mengotomasi, dan mendokumentasikan seluruh siklus kegiatan magang: mulai dari registrasi peserta, seleksi berkas, rotasi divisi, evaluasi/penilaian berkala oleh PIC, hingga penerbitan sertifikat kelulusan digital.

---

## 🚀 Fitur Utama

### 1. Pendaftaran Fleksibel (Peserta)
- **Jalur Pendaftaran Beragam**: Mendukung pendaftaran jalur **Individu**, **Kelompok**, maupun **Dinas/Instansi Khusus**.
- **Unggah Berkas Persyaratan**: Validasi format berkas foto diri (JPG/PNG) dan dokumen pendukung (PDF/DOC) secara otomatis.
- **Monitoring Kuota Real-time**: Calon peserta dapat melihat sisa kuota penerimaan magang secara transparan.

### 2. Manajemen & Seleksi (Admin)
- **Verifikasi & Seleksi Berkas**: Tinjau pendaftar dengan status *Pending*, *Diterima*, atau *Ditolak*.
- **Surat Balasan Otomatis**: Unggah dan distribusikan surat balasan penerimaan atau penolakan ke akun peserta.
- **Pengaturan Kuota Pendaftar**: Kontrol dinamis kuota maksimal penerimaan peserta magang.
- **Manajemen Akun PIC & Pembagian Divisi**: Kelola akun pembimbing lapangan (PIC) beserta bidang/divisinya.
- **Pembuatan Sertifikat Otomatis**: Kompilasi nilai akhir teknis & non-teknis ke format sertifikat PDF resmi menggunakan *Headless Chromium (Puppeteer)*.

### 3. Penjadwalan & Penilaian Kinerja (PIC / Pembimbing)
- **Monitoring Jadwal Divisi**: PIC dapat memantau daftar peserta yang ditugaskan ke divisinya beserta periode tanggal magang.
- **Penilaian Berbobot**: Penilaian berbasis dua aspek:
  - **Aspek Teknis**: Penilaian spesifik keahlian sesuai divisi yang dijalani.
  - **Aspek Non-Teknis**: Penilaian kedisiplinan, etika kerja, dan komunikasi (dengan perhitungan rata-rata otomatis).
- **Alur Draft & Finalisasi**: Nilai dapat disimpan sebagai *draft* sebelum difinalisasi ke rekapitulasi nilai akhir.

### 4. Pelaporan & Kelulusan (Peserta)
- **Unggah Laporan Akhir**: Pengumpulan berkas laporan akhir magang berformat PDF.
- **Transkrip Nilai Digital**: Melihat rincian capaian nilai teknis dan non-teknis secara transparan.
- **Unduh Sertifikat Resmi**: Akses unduh sertifikat berpredikat (*A/B/C*) yang telah disahkan oleh Admin.

### 5. Otomasi & Notifikasi
- **Sistem Cron Job**: Pemeriksaan otomatis status kelulusan peserta yang telah melewati masa berlaku tanggal akhir magang.
- **Notifikasi Lonceng Realtime**: Pembaruan aktivitas pendaftaran masuk secara seketika di dashboard admin.

---

## 🛠️ Tech Stack

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4 | Single Page Application (SPA), Framer Motion, Recharts, React Toastify, React Router v7 |
| **Backend** | Node.js, Express.js | Arsitektur MVC, RESTful API, Route protection |
| **Autentikasi** | JWT (*JSON Web Token*) & Bcryptjs | Role-Based Access Control (`admin`, `pic`, `siswa`) |
| **Database** | MySQL / PostgreSQL | Relasional database dengan penanganan transaksi dan skema terstruktur |
| **File Handler** | Multer | Penanganan unggahan foto profil, berkas dokumen pendukung, dan laporan akhir |
| **Ekspor Dokumen** | Puppeteer & EJS | Render template dokumen EJS ke sertifikat PDF beresolusi tinggi |
| **Email Service** | Nodemailer | Layanan pengiriman email reset sandi otomatis via SMTP |
| **Otomasi** | Node-Cron | Penjadwal tugas otomatis (*scheduler*) pembaruan status peserta |

---

## 📁 Struktur Direktori

```text
├── backend/
│   └── kp/
│       ├── bin/                # HTTP server bootstrap (www)
│       ├── config/             # Konfigurasi database, CORS, dan middlewares
│       │   └── middleware/     # JWT verification, Multer, Rate Limiter
│       ├── cron/               # Penjadwal otomatis (weeklyCheck.js)
│       ├── model/              # Abstraksi database & query bisnis
│       ├── public/             # Penyimpanan berkas statis (foto, laporan, sertifikat)
│       ├── routes/             # Endpoint routing terpisah per role (admin, pic, peserta, auth)
│       ├── views/              # Template EJS untuk sertifikat
│       ├── .env.example        # Contoh variabel lingkungan backend
│       └── app.js              # Inisialisasi Express server
│
├── frontend/
│   └── kp/
│       ├── public/             # Aset publik statis (logo, favicon)
│       ├── src/
│       │   ├── assets/         # Gambar ilustrasi dan ikon UI
│       │   ├── components/     # Komponen UI bersama (Navbar, Sidebar)
│       │   ├── config/         # Konfigurasi API Client (Axios) terpusat & Firebase
│       │   ├── pages/          # Halaman aplikasi (Admin, PIC, Peserta, Auth)
│       │   ├── styles/         # Berkas gaya CSS spesifik komponen
│       │   ├── App.jsx         # Routing & proteksi halaman
│       │   └── main.jsx        # Entrypoint React Vite
│       └── .env.example        # Contoh variabel lingkungan frontend
```

---

## ⚙️ Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- [Node.js](https://nodejs.org/) (versi 18.x atau yang lebih baru)
- Database [MySQL](https://www.mysql.com/) atau [PostgreSQL](https://www.postgresql.org/)

---

### 2. Setup Backend

1. Buka terminal dan masuk ke direktori backend:
   ```bash
   cd "backend/kp"
   ```
2. Pasang semua dependensi:
   ```bash
   npm install
   ```
3. Salin berkas lingkungan dari templat:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan konfigurasi pada berkas `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=mapta
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=rahasia_jwt_anda
   EMAIL_USER=email_anda@gmail.com
   EMAIL_APP_PASSWORD=app_password_gmail_anda
   ```
5. Jalankan server backend:
   ```bash
   npm start
   ```
   Server akan aktif di `http://localhost:3000`.

---

### 3. Setup Frontend

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd "frontend/kp"
   ```
2. Pasang semua dependensi:
   ```bash
   npm install
   ```
3. Salin berkas lingkungan dari templat:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan konfigurasi pada `.env` (pastikan URL backend sesuai):
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```
5. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui peramban di `http://localhost:5173`.

---

## 👥 Hak Akses Pengguna (Role-Based Access)

- **Admin**: Akses penuh ke dashboard analitik, verifikasi calon peserta, penentuan kuota, penyusunan jadwal, penilaian aspek, dan otorisasi sertifikat.
- **PIC (Pembimbing Lapangan)**: Memantau peserta magang di divisinya serta menginput dan mengedit nilai teknis & non-teknis.
- **Siswa (Peserta Magang)**: Mendaftar akun, memantau jadwal rotasi, mengunggah laporan akhir, melihat transkrip nilai, dan mengunduh sertifikat.

---

## 🔒 Catatan Keamanan & Praktik Terbaik

- Seluruh kredensial sensitif (Database, SMTP Password, JWT Secret) dikelola melalui berkas `.env` dan diabaikan dari pelacakan repositori (`.gitignore`).
- Akses API dilindungi oleh middleware verifikasi token JWT (*Bearer Token*) dan *Rate Limiting* untuk mencegah eksploitasi brute-force pada endpoint kritis.
- Seluruh pemanggilan API dari frontend dipusatkan melalui modul `src/config/api.js` yang secara otomatis mengelola autentikasi dan penanganan galat sesi kedaluwarsa.
