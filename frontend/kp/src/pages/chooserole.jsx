import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // ikon panah
import chooseImage from "../assets/images/choose.png";
import "../styles/choose.css";

const ChooseRoleSection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "MAPTA";
    }, []);

    return (
        <section className="gradient-bg">
        {/* Tombol back */}
        <button
            onClick={() => navigate(-1)}
            className="back-button"
        >
            <FaArrowLeft size={18} />
        </button>

        <motion.div
            className="choose-contain"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <span className="choose-title">Pilih Peran Pendaftaran</span>

            <div className="choose-wrapper">
            {/* Kolom kiri: siswa/mahasiswa */}
            <motion.div
                className="choose-text"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <span>
                Apakah Anda mendaftar sebagai <b>Siswa/Mahasiswa</b> yang ingin
                mengikuti program magang di Dinas Perpustakaan dan Kearsipan
                Provinsi Jawa Timur? Melalui pendaftaran ini, Anda berkesempatan
                memperoleh pengalaman belajar langsung di lingkungan kerja nyata
                sesuai bidang yang diminati. Pastikan Anda telah menyiapkan data
                diri, dokumen pendukung, serta membaca ketentuan dan persyaratan
                yang berlaku agar proses pendaftaran berjalan lancar dan sesuai
                jadwal.
                </span>
                <Link to="/pendaftaran">
                <button>Daftar Sebagai Siswa</button>
                </Link>
            </motion.div>

            {/* Gambar di tengah */}
            <motion.div
                className="choose-image"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <img src={chooseImage} alt="Image Illustration" />
            </motion.div>

            {/* Kolom kanan: dinas */}
            <motion.div
                className="choose-text"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <span>
                Apakah Anda mendaftar sebagai <b>Dinas</b> untuk mengikuti program
                magang yang diselenggarakan oleh Dinas Perpustakaan dan Kearsipan
                Provinsi Jawa Timur? Program ini ditujukan bagi pegawai atau
                perwakilan dinas yang ingin memperluas wawasan dan mengenal lebih
                dekat lingkungan kerja, sistem, serta prosedur yang berlaku pada
                setiap bidang, sehingga dapat menjadi bekal dalam peningkatan
                kompetensi dan pemahaman kerja di instansi masing-masing.
                </span>
                <Link to="/pendaftarandinas">
                <button>Daftar Sebagai Dinas</button>
                </Link>
            </motion.div>
            </div>
        </motion.div>
        </section>
    );
};

export default ChooseRoleSection;
