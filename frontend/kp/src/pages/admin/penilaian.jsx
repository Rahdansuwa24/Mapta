// PAGE ASPEK PENILAIAN ADMIN + MOTION ANIMASI

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'
import { toast } from "react-toastify";

import "../../styles/dashboard.css";

function Penilaian() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [namaAspek, setNamaAspek] = useState("");
    const [departemen, setDepartemen] = useState("");
    const [kategoriAspek, setKategoriAspek] = useState("");
    const [checked, setChecked] = useState({});

    const [aspekList, setAspekList] = useState([]);

    useEffect(()=>{
        fetchAspek()
    }, [])

    const fetchAspek = async()=>{
        const token = localStorage.getItem("token")
        try{
            const rest = await axios.get("http://localhost:3000/admin/aspek", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            const dataAspek = rest.data.data
            setAspekList(dataAspek)
        }catch(error){
            console.error(error)
            toast.error("Gagal mengambil data aspek")
        }
    }
    // Tambah aspek
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token")
        if (!namaAspek || !kategoriAspek) {
            toast.error("Harap lengkapi semua field!");
            return;
        }

        if (kategoriAspek === "teknis" && !departemen) {
            toast.error("Departemen wajib dipilih untuk aspek teknis!");
            return;
        }

        if (kategoriAspek === "non-teknis" && !departemen) {
            toast.error("Pilih penerapan untuk aspek non teknis (GLOBAL / Departemen tertentu)!");
            return;
        }

        try{
            const data = {
                subjek: namaAspek,
                bidang: departemen,
                aspek: kategoriAspek
            }
            await axios.post("http://localhost:3000/admin/aspek/store", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success("data aspek berhasil ditambahkan")
            fetchAspek()
            setShowModal(false);
            setNamaAspek("");
            setDepartemen("");
            setKategoriAspek("");
        }catch(error){
        console.error(error);
        toast.error("Gagal menyimpan aspek!");
        }
    };

    // Checkbox toggle
    const handleCheckboxChange = (id) => {
        setChecked((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Hapus aspek yang dicentang
    const handleDeleteChecked = async () => {
        const token = localStorage.getItem("token")
        if(window.confirm("Yakin ingin menghapus aspek?")){
            const idsToDelete = aspekList.filter((a)=> checked[a.id_aspek]).map((a)=> a.id_aspek)
            if (idsToDelete.length === 0) {
                alert("Pilih aspek yang ingin dihapus!");
                return;
            }
            try{
                await axios.delete("http://localhost:3000/admin/aspek/delete", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },data: { id_aspek: idsToDelete }
                })
                fetchAspek();
                setChecked({});
                toast.success("Aspek berhasil dihapus")
            }catch(err){
                console.error(err);
                toast.error("Gagal menghapus aspek!");
            }
        }
    };

    // Helper: kelompokkan data by departemen
    const groupByDepartemen = (list) => {
        return list.reduce((acc, item) => {
            if (!acc[item.bidang]) acc[item.bidang] = [];
            acc[item.bidang].push(item);
            return acc;
        }, {});
    };

    const aspekTeknis = groupByDepartemen(
        aspekList.filter((a) => a.aspek === "teknis")
    );

    const aspekNonTeknisGlobal = aspekList.filter(
        (a) => a.aspek === "non-teknis" && a.bidang === "GLOBAL"
    );
    const aspekNonTeknisCustom = groupByDepartemen(
        aspekList.filter(
            (a) => a.aspek === "non-teknis" && a.bidang !== "GLOBAL"
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
                                                    key={a.id_aspek}
                                                    className="aspek-item"
                                                    style={{ marginLeft: "15px" }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked[a.id_aspek] || false}
                                                        onChange={() => handleCheckboxChange(a.id_aspek)}
                                                    />
                                                    {a.subjek}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {(aspekNonTeknisGlobal.length > 0 || Object.keys(aspekNonTeknisCustom).length > 0) && (
                            <motion.div 
                                className="aspek-section"
                                style={{ marginTop: "20px" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h3>Aspek Non Teknis</h3>

                                {aspekNonTeknisGlobal.length > 0 && (
                                    <div className="departemen-group">
                                        <span style={{ fontStyle: "italic", fontWeight: 500, fontSize: "14.5px" }}>
                                            Default (Semua Departemen)
                                        </span>
                                        <div className="aspek-list">
                                            {aspekNonTeknisGlobal.map((a, idx) => (
                                                <motion.label
                                                    key={a.id_aspek}
                                                    className="aspek-item"
                                                    style={{ marginLeft: "15px" }}
                                                    initial={{ opacity: 0, x: -15 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked[a.id_aspek] || false}
                                                        onChange={() => handleCheckboxChange(a.id_aspek)}
                                                    />
                                                    {a.subjek}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                                        checked={checked[a.id_aspek] || false}
                                                        onChange={() => handleCheckboxChange(a.id_aspek)}
                                                    />
                                                    {a.subjek}
                                                </motion.label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

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
                                <div className="peserta-modal-header">
                                    <span>Tambah Aspek Penilaian</span>
                                    <div className="peserta-close-btn" onClick={() => setShowModal(false)}>
                                        <FaTimes />
                                    </div>
                                </div>

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
                                                <option value="teknis">Aspek Teknis</option>
                                                <option value="non-teknis">Aspek Non Teknis</option>
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

                                        {kategoriAspek === "teknis" && (
                                            <div className="form-group">
                                                <label>Departemen</label>
                                                <select
                                                    value={departemen}
                                                    onChange={(e) => setDepartemen(e.target.value)}
                                                >
                                                    <option value="">-- Pilih Departemen --</option>
                                                    <option value="Kesekretariatan">Kesekretariatan</option>
                                                    <option value="Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan">
                                                        Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan
                                                    </option>
                                                    <option value="Pembinaan Perpustakaan">
                                                        Pembinaan Perpustakaan
                                                    </option>
                                                    <option value="Pelayanan Perpustakaan dan Informasi">Pelayanan Perpustakaan dan Informasi</option>
                                                    <option value="Pemberdayaan dan Pengawasan Kearsipan">
                                                        Pemberdayaan dan Pengawasan Kearsipan
                                                    </option>
                                                    <option value="Penyelamatan dan Pemanfaatan Arsip Statis">
                                                        Penyelamatan dan Pemanfaatan Arsip Statis
                                                    </option>
                                                </select>
                                            </div>
                                        )}

                                        {kategoriAspek === "non-teknis" && (
                                            <div className="form-group">
                                                <label>Penerapan</label>
                                                <select
                                                    value={departemen}
                                                    onChange={(e) => setDepartemen(e.target.value)}
                                                >
                                                    <option value="">-- Pilih Penerapan --</option>
                                                    <option value="GLOBAL">Default (Semua Departemen)</option>
                                                    <option value="Kesekretariatan">Kesekretariatan</option>
                                                    <option value="Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan">
                                                        Deposit, Pengembangan, dan Pelestarian bahan Perpustakaan
                                                    </option>
                                                    <option value="Pembinaan Perpustakaan">
                                                        Pembinaan Perpustakaan
                                                    </option>
                                                    <option value="Pelayanan Perpustakaan dan Informasi">Pelayanan Perpustakaan dan Informasi</option>
                                                    <option value="Pemberdayaan dan Pengawasan Kearsipan">
                                                        Pemberdayaan dan Pengawasan Kearsipan
                                                    </option>
                                                    <option value="Penyelamatan dan Pemanfaatan Arsip Statis">
                                                        Penyelamatan dan Pemanfaatan Arsip Statis
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
