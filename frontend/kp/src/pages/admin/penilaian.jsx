// PAGE ASPEK PENILAIAN ADMIN + MOTION ANIMASI

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import "../../styles/dashboard.css";

function Penilaian() {
    useEffect(() => {
        document.title = "Admin Aspek Penilaian";
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [namaAspek, setNamaAspek] = useState("");
    const [departemen, setDepartemen] = useState("");
    const [kategoriAspek, setKategoriAspek] = useState("");
    const [checked, setChecked] = useState({});

    // Data dummy awal
    const [aspekList, setAspekList] = useState([
        { nama: "Pelayanan Perpustakaan dan Kearsipan", departemen: "Pelayanan Perpustakaan dan Informasi", kategori: "Aspek Teknis" },
        { nama: "Pengelolaan Bahan Pustaka dan Arsip", departemen: "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan", kategori: "Aspek Teknis" },
        { nama: "Preservasi Bahan Pustaka dan Arsip", departemen: "Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan", kategori: "Aspek Teknis" },
        { nama: "Digitalisasi Arsip", departemen: "Penyelamatan dan Pendayagunaan Kearsipan", kategori: "Aspek Teknis" },
        { nama: "Literasi Informasi", departemen: "Pengembangan Sumber Daya", kategori: "Aspek Teknis" },
        { nama: "Manajamem Kearsipan", departemen: "Pembinaan dan Pengawasan Kearsipan", kategori: "Aspek Teknis" },

        { nama: "Kehadiran", kategori: "Aspek Non Teknis", departemen: "GLOBAL" },
        { nama: "Skill/Keahlian", kategori: "Aspek Non Teknis", departemen: "GLOBAL" },
        { nama: "Kreatifitas", kategori: "Aspek Non Teknis", departemen: "GLOBAL" },
        { nama: "Komunikasi", kategori: "Aspek Non Teknis", departemen: "GLOBAL" },
        { nama: "Sikap/Etika", kategori: "Aspek Non Teknis", departemen: "GLOBAL" },
    ]);

    // Tambah aspek
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!namaAspek || !kategoriAspek) {
            alert("Harap lengkapi semua field!");
            return;
        }

        if (kategoriAspek === "Aspek Teknis" && !departemen) {
            alert("Departemen wajib dipilih untuk aspek teknis!");
            return;
        }

        if (kategoriAspek === "Aspek Non Teknis" && !departemen) {
            alert("Pilih penerapan untuk aspek non teknis (GLOBAL / Departemen tertentu)!");
            return;
        }

        setAspekList([
            ...aspekList,
            { nama: namaAspek, departemen, kategori: kategoriAspek },
        ]);

        setShowModal(false);
        setNamaAspek("");
        setDepartemen("");
        setKategoriAspek("");
    };

    // Checkbox toggle
    const handleCheckboxChange = (aspek) => {
        setChecked((prev) => ({
            ...prev,
            [aspek]: !prev[aspek],
        }));
    };

    // Hapus aspek yang dicentang
    const handleDeleteChecked = () => {
        const filtered = aspekList.filter((a) => !checked[a.nama]);
        setAspekList(filtered);
        setChecked({});
    };

    // Helper: kelompokkan data by departemen
    const groupByDepartemen = (list) => {
        return list.reduce((acc, item) => {
            if (!acc[item.departemen]) acc[item.departemen] = [];
            acc[item.departemen].push(item);
            return acc;
        }, {});
    };

    const aspekTeknis = groupByDepartemen(
        aspekList.filter((a) => a.kategori === "Aspek Teknis")
    );

    const aspekNonTeknisGlobal = aspekList.filter(
        (a) => a.kategori === "Aspek Non Teknis" && a.departemen === "GLOBAL"
    );
    const aspekNonTeknisCustom = groupByDepartemen(
        aspekList.filter(
            (a) => a.kategori === "Aspek Non Teknis" && a.departemen !== "GLOBAL"
        )
    );

    return (
        <div className="app-layout">
            <SidebarAdmTm />
            <div className="content-area">
                <NavbarAdmTm />

                <section className="main">
                    <div className="submain">
                        <motion.p 
                            className="judul-submain"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            Aspek Penilaian Peserta Magang
                        </motion.p>
                    </div>

                    <div className="container-instansi">
                        <div className="penilaian-header">
                            <motion.button
                                className="btn-buat-aspek"
                                onClick={() => setShowModal(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tambah Aspek
                            </motion.button>

                            <motion.button
                                className="btn-delete"
                                onClick={handleDeleteChecked}
                                disabled={
                                    Object.values(checked).filter((val) => val === true).length === 0
                                }
                                style={{ marginLeft: "auto" }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaTrash /> Hapus
                            </motion.button>
                        </div>

                        {/* Aspek Teknis */}
                        {Object.keys(aspekTeknis).length > 0 && (
                            <motion.div 
                                className="aspek-section"
                                style={{ marginTop: "80px" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h3>Aspek Teknis</h3>
                                {Object.entries(aspekTeknis).map(([dept, aspekArr], i) => (
                                    <div key={i} className="departemen-group">
                                        <span style={{ fontStyle: "italic", fontWeight: 500, fontSize: "14.5px" }}>
                                            {dept}
                                        </span>
                                        <div style={{ marginBottom: "15px" }} className="aspek-list">
                                            {aspekArr.map((a, idx) => (
                                                <motion.label
                                                    key={idx}
                                                    className="aspek-item"
                                                    style={{ marginLeft: "15px" }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked[a.nama] || false}
                                                        onChange={() => handleCheckboxChange(a.nama)}
                                                    />
                                                    {a.nama}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {/* Aspek Non Teknis */}
                        {(aspekNonTeknisGlobal.length > 0 || Object.keys(aspekNonTeknisCustom).length > 0) && (
                            <motion.div 
                                className="aspek-section"
                                style={{ marginTop: "20px" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h3>Aspek Non Teknis</h3>

                                {/* Global */}
                                {aspekNonTeknisGlobal.length > 0 && (
                                    <div className="departemen-group">
                                        <span style={{ fontStyle: "italic", fontWeight: 500, fontSize: "14.5px" }}>
                                            GLOBAL (Semua Departemen)
                                        </span>
                                        <div className="aspek-list">
                                            {aspekNonTeknisGlobal.map((a, idx) => (
                                                <motion.label
                                                    key={idx}
                                                    className="aspek-item"
                                                    style={{ marginLeft: "15px" }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked[a.nama] || false}
                                                        onChange={() => handleCheckboxChange(a.nama)}
                                                    />
                                                    {a.nama}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Custom per Departemen */}
                                {Object.keys(aspekNonTeknisCustom).map((dept, i) => (
                                    <div key={i} className="departemen-group" style={{ marginTop: "15px" }}>
                                        <span style={{ fontStyle: "italic", fontWeight: 500, fontSize: "14.5px" }}>
                                            {dept}
                                        </span>
                                        <div className="aspek-list">
                                            {aspekNonTeknisCustom[dept].map((a, idx) => (
                                                <motion.label
                                                    key={idx}
                                                    className="aspek-item"
                                                    style={{ marginLeft: "15px" }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked[a.nama] || false}
                                                        onChange={() => handleCheckboxChange(a.nama)}
                                                    />
                                                    {a.nama}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* MODAL INPUT PENILAIAN */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div 
                            className="peserta-overlay"
                            onClick={() => setShowModal(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="peserta-modal"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Header */}
                                <div className="peserta-modal-header">
                                    <span>Tambah Aspek Penilaian</span>
                                    <div className="peserta-close-btn" onClick={() => setShowModal(false)}>
                                        <FaTimes />
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="peserta-modal-body">
                                    <form className="form-penilaian" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Kategori Aspek</label>
                                            <select
                                                value={kategoriAspek}
                                                onChange={(e) => {
                                                    setKategoriAspek(e.target.value);
                                                    setDepartemen("");
                                                }}
                                            >
                                                <option value="">-- Pilih Kategori --</option>
                                                <option value="Aspek Teknis">Aspek Teknis</option>
                                                <option value="Aspek Non Teknis">Aspek Non Teknis</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Nama Aspek Akhir</label>
                                            <input
                                                type="text"
                                                placeholder="Masukkan nama aspek"
                                                value={namaAspek}
                                                onChange={(e) => setNamaAspek(e.target.value)}
                                            />
                                        </div>

                                        {kategoriAspek === "Aspek Teknis" && (
                                            <div className="form-group">
                                                <label>Departemen</label>
                                                <select
                                                    value={departemen}
                                                    onChange={(e) => setDepartemen(e.target.value)}
                                                >
                                                    <option value="">-- Pilih Departemen --</option>
                                                    <option value="Kesekretariatan">Kesekretariatan</option>
                                                    <option value="Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan">
                                                        Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan
                                                    </option>
                                                    <option value="Pelayanan Perpustakaan dan Informasi">
                                                        Pelayanan Perpustakaan dan Informasi
                                                    </option>
                                                    <option value="Pengembangan Sumber Daya">Pengembangan Sumber Daya</option>
                                                    <option value="Penyelamatan dan Pendayagunaan Kearsipan">
                                                        Penyelamatan dan Pendayagunaan Kearsipan
                                                    </option>
                                                    <option value="Pembinaan dan Pengawasan Kearsipan">
                                                        Pembinaan dan Pengawasan Kearsipan
                                                    </option>
                                                </select>
                                            </div>
                                        )}

                                        {kategoriAspek === "Aspek Non Teknis" && (
                                            <div className="form-group">
                                                <label>Penerapan</label>
                                                <select
                                                    value={departemen}
                                                    onChange={(e) => setDepartemen(e.target.value)}
                                                >
                                                    <option value="">-- Pilih Penerapan --</option>
                                                    <option value="GLOBAL">Default (Semua Departemen)</option>
                                                    <option value="Kesekretariatan">Kesekretariatan</option>
                                                    <option value="Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan">
                                                        Deposit, Akuisisi, Pelestarian dan Pengolahan Bahan Perpustakaan
                                                    </option>
                                                    <option value="Pelayanan Perpustakaan dan Informasi">
                                                        Pelayanan Perpustakaan dan Informasi
                                                    </option>
                                                    <option value="Pengembangan Sumber Daya">Pengembangan Sumber Daya</option>
                                                    <option value="Penyelamatan dan Pendayagunaan Kearsipan">
                                                        Penyelamatan dan Pendayagunaan Kearsipan
                                                    </option>
                                                    <option value="Pembinaan dan Pengawasan Kearsipan">
                                                        Pembinaan dan Pengawasan Kearsipan
                                                    </option>
                                                </select>
                                            </div>
                                        )}

                                        <div className="form-actions">
                                            <motion.button 
                                                type="submit" 
                                                className="btn-save"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Simpan
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Penilaian;
