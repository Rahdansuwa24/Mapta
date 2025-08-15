import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsArrowUpCircle } from "react-icons/bs";

import "../styles/pendaftaran.css";
import logoMapta from "../assets/images/logo_mapta.png";

export default function PendaftaranMagang() {
    useEffect(() => {
        document.title = "Form Pendaftaran";
    }, []);

    const [sections, setSections] = useState([0]);
    const [dokumenLabels, setDokumenLabels] = useState(["Dokumen:"]);
    const [kategoriPertama, setKategoriPertama] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Scroll event untuk tombol scroll top
    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const addSection = () => {
        setSections((prev) => [...prev, prev.length]);
        setDokumenLabels((prev) => [...prev, "Dokumen:"]);
        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
    };

    const removeSection = (index) => {
        setSections((prev) => prev.filter((_, idx) => idx !== index));
        setDokumenLabels((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleFileChange = (e, index) => {
        const updatedLabels = [...dokumenLabels];
        updatedLabels[index] = e.target.files.length ? e.target.files[0].name : "Dokumen:";
        setDokumenLabels(updatedLabels);
    };

    const renderFormSection = (index, withTopInfo) => (
        <motion.div
            className={`form-box ${index === 0 ? "first" : ""}`}
            key={index}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
        >
            {withTopInfo && (
                <div className="top-info">
                    <button
                        type="button"
                        onClick={addSection}
                        disabled={kategoriPertama !== "kelompok"}
                        style={{
                            opacity: kategoriPertama === "kelompok" ? 1 : 0.5,
                            cursor:
                                kategoriPertama === "kelompok" ? "pointer" : "not-allowed",
                        }}
                    >
                        Tambah
                    </button>
                    Pilih jenis pendaftaran: individu atau kelompok. Jika
                    berkelompok, isi data anggota pertama dan klik "Tambah
                    Anggota" untuk menambahkan.
                </div>
            )}

            {index !== 0 && (
                <button
                    type="button"
                    onClick={() => removeSection(index)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "#FF5C5C",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                    title="Hapus Form"
                >
                    X
                </button>
            )}

            <div className="form-section">
                {/* KOLOM KIRI */}
                <div className="kolom">
                    <div className="foto-jenjang">
                        <label className="upload-box">
                            Upload Foto
                            <input type="file" />
                        </label>
                        <div className="samping-foto">
                            <select>
                                <option value="">Pilih Jenjang</option>
                                <option value="siswa">Siswa</option>
                                <option value="mahasiswa">Mahasiswa</option>
                            </select>
                            <select
                                value={index === 0 ? kategoriPertama : ""}
                                onChange={(e) => {
                                    if (index === 0) {
                                        setKategoriPertama(e.target.value);
                                    }
                                }}
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="individu">Individu</option>
                                <option value="kelompok">Kelompok</option>
                            </select>
                        </div>
                    </div>
                    <input type="email" placeholder="Email Aktif" />
                    <input type="password" placeholder="Buat Password" />
                    <input type="password" placeholder="Ketik Ulang Password" />
                </div>

                {/* KOLOM KANAN */}
                <div className="kolom">
                    <input type="text" placeholder="Nama Lengkap" />
                    <input type="text" placeholder="Instansi" />
                    <input type="text" placeholder="NIP/NIM" />

                    <div className="row-dua">
                        <input
                            type="text"
                            placeholder="Tanggal Mulai Magang"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Tanggal Selesai Magang"
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text";
                            }}
                        />
                    </div>

                    <label className="input-file-wrap">
                        <span className="placeholder-text">{dokumenLabels[index]}</span>
                        <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, index)}
                        />
                    </label>
                </div>

                <p>
                    Note: Tulis nama instansi lengkap, misal{" "}
                    <b>SMK Negeri 1 Surabaya</b> (bukan SMKN 1 SBY) atau{" "}
                    <b>Universitas Airlangga</b> (bukan UNAIR).
                </p>
            </div>
        </motion.div>
    );

    return (
        <section className="pendaftaran-page">
            <section className="hero">
                <div className="header">
                    <div className="logo-wrap">
                        <img src={logoMapta} alt="MAPTA Logo" />
                        <p>MAPTA</p>
                    </div>
                    <a href="#">
                        &#9432; Kuota magang tersisa 5. Pendaftaran ditutup saat
                        kuota penuh
                    </a>
                </div>
                <div className="title">
                    <h1>Formulir Pendaftaran Magang</h1>
                    <hr />
                    <p>
                        Silakan lengkapi data diri dan dokumen yang diperlukan
                        secara lengkap dan benar.
                        <br />
                        Data ini akan digunakan sebagai dasar seleksi dan
                        proses administrasi magang di lingkungan Dinas.
                    </p>
                </div>
            </section>

            <form>
                <AnimatePresence>
                    {sections.map((_, idx) => renderFormSection(idx, idx === 0))}
                </AnimatePresence>

                <div className="submit-btn">
                    <button type="submit">Daftar</button>
                </div>
            </form>

            {showScrollTop && (
                <button
                    className="scroll-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    title="Scroll ke Atas"
                >
                    <BsArrowUpCircle />
                </button>
            )}

        </section>
    );
}
