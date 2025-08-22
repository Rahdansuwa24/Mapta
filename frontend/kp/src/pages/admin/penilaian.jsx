// PAGE ASPEK PENILAIAN ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes, FaTrash } from "react-icons/fa";

import "../../styles/dashboard.css";

function Penilaian() {
    useEffect(() => {
        document.title = "Admin Aspek Penilaian";
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [namaAspek, setNamaAspek] = useState("");
    const [kategoriAspek, setKategoriAspek] = useState("");
    const [checked, setChecked] = useState({});

    // ✅ Data dummy awal
    const [aspekList, setAspekList] = useState([
        { nama: "Pelayanan Perpustakaan dan Kearsipan", kategori: "Aspek Teknis" },
        { nama: "Pengelolaan Bahan Pustaka dan Arsip", kategori: "Aspek Teknis" },
        { nama: "Preservasi Bahan Pustaka dan Arsip", kategori: "Aspek Teknis" },
        { nama: "Digitalisasi Arsip", kategori: "Aspek Teknis" },
        { nama: "Literasi Informasi", kategori: "Aspek Teknis" },
        { nama: "Manajamem Kearsipan", kategori: "Aspek Teknis" },
        { nama: "Teknologi Informasi", kategori: "Aspek Teknis" },
        { nama: "Inovasi Layanan Perpustakaan", kategori: "Aspek Teknis" },
        { nama: "Pengelolaan Koleksi Digital", kategori: "Aspek Teknis" },
        { nama: "Pengembangan SDM Perpustakaan", kategori: "Aspek Teknis" },
        { nama: "Pelayanan Referensi dan Konsultasi", kategori: "Aspek Teknis" },
        { nama: "Pengelolaan Ruang Baca", kategori: "Aspek Teknis" },
        { nama: "Sistem Informasi Kearsipan", kategori: "Aspek Teknis" },
        { nama: "Pengolahan Data Bibliografi", kategori: "Aspek Teknis" },
        { nama: "Layanan Informasi Publik", kategori: "Aspek Teknis" },
        { nama: "Evaluasi Program Perpustakaan", kategori: "Aspek Teknis" },
        { nama: "Pengelolaan Keamanan Arsip", kategori: "Aspek Teknis" },


        { nama: "Kehadiran", kategori: "Aspek Non Teknis" },
        { nama: "Skill/Keahlian", kategori: "Aspek Non Teknis" },
        { nama: "Kreatifitas", kategori: "Aspek Non Teknis" },
        { nama: "Komunikasi", kategori: "Aspek Non Teknis" },
        { nama: "Sikap/Etika", kategori: "Aspek Non Teknis" },
    ]);

    // ✅ Tambah aspek
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!namaAspek || !kategoriAspek) {
        alert("Harap lengkapi semua field!");
        return;
        }
        setAspekList([...aspekList, { nama: namaAspek, kategori: kategoriAspek }]);
        setShowModal(false);
        setNamaAspek("");
        setKategoriAspek("");
    };

    // ✅ Checkbox toggle
    const handleCheckboxChange = (aspek) => {
        setChecked((prev) => ({
        ...prev,
        [aspek]: !prev[aspek],
        }));
    };

    // ✅ Hapus aspek yang dicentang
    const handleDeleteChecked = () => {
        const filtered = aspekList.filter((a) => !checked[a.nama]);
        setAspekList(filtered);
        setChecked({});
    };

    const aspekTeknis = aspekList.filter((a) => a.kategori === "Aspek Teknis");
    const aspekNonTeknis = aspekList.filter(
        (a) => a.kategori === "Aspek Non Teknis"
    );

    return (
        <div className="app-layout">
        <SidebarAdmTm />
        <div className="content-area">
            <NavbarAdmTm />

            <section className="main">
            <div className="submain">
                <p className="judul-submain">Aspek Penilaian Peserta Magang</p>
            </div>

            <div className="container-instansi">
                {/* HEADER UNTUK PENILAIAN */}
                <div className="penilaian-header">
                    <button
                    className="btn-buat-aspek"
                    onClick={() => setShowModal(true)}
                    >
                    Tambah Aspek
                    </button>

                    <button
                    className="btn-delete"
                    onClick={handleDeleteChecked}
                    disabled={
                        Object.values(checked).filter((val) => val === true).length === 0
                    }
                    style={{ marginLeft: "auto" }}
                    >
                    <FaTrash /> Hapus
                    </button>
                </div>

                {/* Aspek Teknis */}
                {aspekTeknis.length > 0 && (
                    <div className="aspek-section" style={{ marginTop: "80px" }}>
                    <h3>Aspek Teknis</h3>
                    <div className="aspek-list">
                        {aspekTeknis.map((a, idx) => (
                        <label key={idx} className="aspek-item">
                            <input
                            type="checkbox"
                            checked={checked[a.nama] || false}
                            onChange={() => handleCheckboxChange(a.nama)}
                            />
                            {a.nama}
                        </label>
                        ))}
                    </div>
                    </div>
                )}

                {/* Aspek Non Teknis */}
                {aspekNonTeknis.length > 0 && (
                    <div className="aspek-section" style={{ marginTop: "20px" }}>
                    <h3>Aspek Non Teknis</h3>
                    <div className="aspek-list">
                        {aspekNonTeknis.map((a, idx) => (
                        <label key={idx} className="aspek-item">
                            <input
                            type="checkbox"
                            checked={checked[a.nama] || false}
                            onChange={() => handleCheckboxChange(a.nama)}
                            />
                            {a.nama}
                        </label>
                        ))}
                    </div>
                    </div>
                )}
                </div>
            </section>

            {/* MODAL INPUT PENILAIAN */}
            {showModal && (
            <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                <div
                    className="peserta-modal"
                    onClick={(e) => e.stopPropagation()}
                    >
                    {/* Header */}
                    <div className="peserta-modal-header">
                        <span>Tambah Aspek Penilaian</span>
                        <div
                        className="peserta-close-btn"
                        onClick={() => setShowModal(false)}
                        >
                        <FaTimes />
                        </div>
                    </div>

                    {/* Body */}
                    <div className="peserta-modal-body">
                        <form className="form-penilaian" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nama Aspek</label>
                            <input
                            type="text"
                            placeholder="Masukkan nama aspek"
                            value={namaAspek}
                            onChange={(e) => setNamaAspek(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Kategori Aspek</label>
                            <select
                            value={kategoriAspek}
                            onChange={(e) => setKategoriAspek(e.target.value)}
                            >
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Aspek Teknis">Aspek Teknis</option>
                            <option value="Aspek Non Teknis">Aspek Non Teknis</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save">
                            Simpan
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }

export default Penilaian;
