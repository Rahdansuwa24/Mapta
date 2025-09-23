// src/pages/LandingMapta.jsx
import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";
import { FaArrowRight, FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";

import logoMapta from "../assets/images/logo_mapta.png";
import notificationImg from "../assets/images/notification.png";
import gedungImg from "../assets/images/gedung.jpg";
import group1Img from "../assets/images/Group1.png";
import group2Img from "../assets/images/Group2.png";
import "../styles/landingmapta.css";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    const listStagger = {
    show: {
        transition: {
        staggerChildren: 0.15,
        },
    },
    };

    const LandingMapta = () => {
    useEffect(() => {
        document.title = "MAPTA";
        window.scrollTo(0, 0);
    }, []);

    const [openIndex, setOpenIndex] = useState(null);

    const faqList = [
        {
        q: "Apakah peserta dapat melihat jadwal penempatan, dan nilai magang mereka?",
        a: "Ya, peserta dapat melihat jadwal magang masing-masing beserta informasi penempatan di departemen atau bidang tertentu. Setelah periode magang selesai, peserta juga dapat mengecek nilai atau hasil penilaian yang diberikan oleh PIC bidangnya.",
        },
        {
        q: "Kapan mendapat pemberitahuan diterima atau ditolak?",
        a: "Proses seleksi membutuhkan waktu kurang lebih 2 minggu sejak pendaftaran. Hasil seleksi akan dikirim melalui email yang digunakan saat pendaftaran.",
        },
        {
        q: "Penulisan instansi yang benar bagaimana?",
        a: `Penulisan instansi harus ditulis lengkap tanpa singkatan.
    Contoh benar: Universitas Airlangga
    Contoh salah: UNAIR
    Contoh benar: SMK Negeri 1 Surabaya
    Contoh salah: SMKN 1 Sby`,
        },
        {
        q: "Jika berkelompok bagaimana cara daftarnya?",
        a: `Jika mendaftar secara kelompok:
    - Pilih kategori Kelompok pada form pendaftaran.
    - Setelah memilih, tombol Tambah akan aktif.
    - Klik Tambah untuk menambahkan data anggota kelompok satu per satu.
    - Jumlah form anggota dapat ditambahkan sesuai kebutuhan.`,
        },
        {
        q: "Bagaimana cara mendapatkan sertifikat magang?",
        a: "Sertifikat akan tersedia setelah seluruh nilai dari setiap departemen atau bidang selesai dihitung dan direkap. Untuk mengunduhnya, peserta cukup login ke aplikasi MAPTA, masuk ke menu Sertifikat, lalu klik Download Sertifikat. Sertifikat hanya tersedia maksimal 3 bulan sejak diterbitkan.",
        },
    ];

    const steps = [
        { t: "Klik Daftar", d: "Pilih tombol Daftar di navigasi untuk menuju halaman Form Pendaftaran." },
        { t: "Perhatikan Catatan", d: "Baca dengan seksama note/perintah sebelum mulai mengisi data." },
        { t: "Pilih Kategori", d: "Kelompok → tombol “Tambah” aktif setelah pilih kategori. Individu → isi data langsung tanpa tombol “Tambah”." },
        { t: "Pilih Jenjang", d: "SMK/SMA/Mahasiswa → pilih Siswa. Pegawai/ASN → pilih Dinas" },
        { t: "Isi Instansi Lengkap", d: "Tuliskan nama sekolah/universitas tanpa singkatan." },
        { t: "Upload Dokumen (Wajib untuk Siswa)", d: "Surat pernyataan/proposal dari kampus atau sekolah dan Dokumen pendukung lain. Untuk Pegawai/ASN, dokumen tidak diwajibkan." },
        { t: "Tunggu Konfirmasi Email", d: "Setelah selesai melengkapi semua data dan mengunggah dokumen, klik Daftar dan tunggu proses konfirmasi melalui email dan Anda akan menerima balasan apakah pendaftaran diterima atau ditolak." },
        { t: "Login", d: "Jika diterima, masuk menggunakan email & password yang sudah dibuat." },
    ];

    return (
        <section className="landing-mapta">
        {/* HERO */}
        <motion.section
            className="mapta-hero"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <header className="mapta-header">
                <div className="mapta-logo">
                    <img src={logoMapta} alt="MAPTA Logo" />
                    <span>MAPTA</span>
                </div>
                <nav className="mapta-nav">
                    <ScrollLink to="profil" smooth={true} duration={500}>Profil</ScrollLink>
                    <ScrollLink to="tatacara" smooth={true} duration={500}>Tata Cara</ScrollLink>
                    <ScrollLink to="faq" smooth={true} duration={500}>FAQ's</ScrollLink>
                </nav>
                <div className="mapta-auth">
                    <Link to="/choose-role">
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mapta-btn daftar active:translate-y-[2px] active:shadow-inner transition-all duration-150"
                        >
                        Daftar
                        </motion.button>
                    </Link>

                    <Link to="/login">
                        <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mapta-btn login active:translate-y-[2px] active:shadow-inner transition-all duration-150"
                        >
                        Login
                        </motion.button>
                    </Link>
                </div>
            </header>

            <main className="mapta-main">
                <motion.div className="mapta-text" variants={fadeUp}>
                    <span>
                    BELAJAR DAN BERKARYA<br />DI DISPERPUSIP<br />JAWA TIMUR
                    </span>
                </motion.div>
            </main>
        </motion.section>

        {/* PROFIL*/}
        <section className="mapta-profil" id="profil" >
            <span className="mapta-profil-title">About MAPTA</span>
            <div className="mapta-profil-content">
                <motion.div className="mapta-profil-text" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <span>
                    <b>MAPTA</b> (Magang Perpustakaan dan Kearsipan) merupakan aplikasi berbasis web yang dirancang untuk mempermudah proses administrasi magang di Dinas Perpustakaan dan Kearsipan Provinsi Jawa Timur. Aplikasi ini hadir sebagai sarana digital yang mendukung transparansi dan efisiensi, sehingga peserta magang dapat dengan mudah mengakses berbagai informasi terkait program yang dijalani.
                    </span>
                </motion.div>

                <motion.img
                    src={notificationImg}
                    alt="Profil Illustration"
                    className="mapta-profil-img"
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                />

                <motion.div className="mapta-profil-text" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    <span>
                    Melalui <b>MAPTA</b>, peserta dapat mengetahui jadwal penempatan magang di bidang tertentu, memantau perkembangan hasil evaluasi, serta memperoleh sertifikat resmi setelah menyelesaikan program. Dengan sistem yang terintegrasi, MAPTA memberikan pengalaman magang yang lebih terarah, terukur, dan profesional.
                    </span>
                </motion.div>
            </div>
        </section>

        {/* ORGANISASI */}
        <motion.section
            className="org-contain"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <section className="org-section">
                <div className="org-container">
                    <motion.div className="org-image-box" variants={fadeUp}>
                        <img src={gedungImg} alt="Gedung Perpustakaan" />
                        <motion.a
                            href="https://disperpusip.jatimprov.go.id/susunan-organisasi/"
                            className="org-btn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>Pengenalan Susunan Organisasi</span>
                            <span className="arrow"><FaArrowRight /></span>
                        </motion.a>
                    </motion.div>

                    <motion.div className="org-list" variants={listStagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                    {[
                        "Bidang Kesekretariatan",
                        "Bidang Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan",
                        "Bidang Pelayanan Perpustakaan dan Informasi",
                        "Bidang Pengembangan Sumber Daya",
                        "Bidang Penyelamatan dan Pendayagunaan Kearsipan",
                        "Bidang Pembinaan dan Pengawasan Kearsipan",
                    ].map((item, idx) => (
                        <motion.div key={idx} className="org-item" variants={fadeUp}>
                        <span className="number">{idx + 1}</span>
                        {item}
                        </motion.div>
                    ))}
                    </motion.div>
                </div>
            </section>

            <section className="daftar-section">
                <p>
                    Pendaftaran magang dibuka bagi peserta yang ingin mengikuti program magang di lingkungan Dinas Perpustakaan dan Kearsipan Provinsi Jawa Timur.
                </p>
                <Link to="/choose-role">
                    <motion.a href="#" className="btn-daftar">
                    <span className="text">Daftar</span>
                    <span className="arrow"><FaArrowRight /></span>
                </motion.a>
                </Link>
            </section>
        </motion.section>

        {/* TATA CARA */}
        <motion.section
            className="tata-cara"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            id="tatacara"
        >
            <span className="judul">Tata Cara Pendaftaran</span>
            <div className="tata-cara-body">
                <div className="mockup">
                    <img src={group1Img} alt="Formulir Pendaftaran Magang" />
                </div>

                <div className="content">
                    <motion.div className="steps" variants={listStagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <ul>
                            {steps.map((s, idx) => (
                            <motion.li key={idx} variants={fadeUp}>
                                <div className="text">
                                <strong>{s.t}</strong>
                                <br />
                                {s.d}
                                </div>
                                <span className="dot"></span>
                            </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </motion.section>

        {/* FAQ */}
        <section className="faq-section"  id="faq">
            <div className="faq-content">
                <span className="faq-title">FAQ</span>
                {faqList.map((item, idx) => (
                    <motion.div
                    className={`faq-item ${openIndex === idx ? "active" : ""}`}
                    key={idx}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    >
                        <button
                            className="faq-question"
                            aria-expanded={openIndex === idx}
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                            {item.q}
                            <span className="arrow"><FaAngleDown /></span>
                        </button>
                        <motion.div
                            className="faq-answer"
                            initial={{ height: 0, opacity: 0 }}
                            animate={openIndex === idx ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {item.a.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <motion.div className="faq-image" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <img src={group2Img} alt="Mockup Jadwal dan Nilai Peserta" />
            </motion.div>
        </section>

        {/* FOOTER */}
        <motion.footer
            className="footer-section"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="footer-content">
                <div className="footer-left">
                    <span>
                    Mulai Perjalanan
                    <br />
                    Magangmu di Disperpusip
                    <br />
                    Jawa Timur
                    </span>
                </div>

                <div className="footer-center">
                    <p>
                    <strong>MAPTA</strong> – Magang Perpustakaan dan Kearsipan
                    </p>
                    <p>
                    <b>MAPTA</b> © 2025 oleh Vernanda M.H.M & R Danang S.P
                    </p>
                    <p>
                    Mahasiswa Politeknik Elektronika Negeri Surabaya (PENS) Informatics Engineering
                    </p>
                </div>

                <div className="footer-right">
                    <p>
                    <strong>
                        Dinas Perpustakaan dan Kearsipan
                        <br />
                        Provinsi Jawa Timur
                    </strong>
                    </p>
                    <p>
                    <strong>Perpustakaan Jatim</strong> – Jl. Menur Pumpungan No.32,
                    Menur Pumpungan, Kec. Sukolilo, Surabaya, Jawa Timur 60118
                    </p>
                    <p>
                    <strong>Kearsipan Jatim</strong> – Jl. Jagir Wonokromo No.350,
                    RT.011/RW.01, Sidosermo, Kec. Wonocolo, Surabaya, Jawa Timur 60239
                    </p>
                </div>
            </div>
            <div className="footer-mapta">MAPTA</div>
        </motion.footer>
    </section>
    );
};

export default LandingMapta;
