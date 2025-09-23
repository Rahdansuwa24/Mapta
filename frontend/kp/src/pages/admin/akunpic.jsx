// PAGE AKUN PIC ADMIN

import React, { useEffect, useState } from "react";
import SidebarAdmTm from "../../components/sidebar-adm";
import NavbarAdmTm from "../../components/navbar-adm";
import { FaTimes } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import axios from 'axios'

import "../../styles/dashboard.css";

function AkunPIC() {
    useEffect(() => {
        document.title = "Admin MAPTA";
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [departemen, setDepartemen] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [akunList, setAkunList] = useState([]);

    useEffect(()=>{
        fetchDataAkun()
    }, [])


    const fetchDataAkun = async()=>{
            const token = localStorage.getItem("token")
            try{
                const res = await axios.get("http://localhost:3000/admin/pic", {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                const dataAkun = res.data.data
                console.log(dataAkun)
                setAkunList(dataAkun)
            }catch(error){
                alert("gagal mengambil data")
                console.error(error)
            }
    }
    // Tambah / Update akun PIC
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!departemen || !email) {
            alert("Harap lengkapi field departemen dan index!");
            return;
        }

        if (editingIndex === null && !password) {
            alert("Harap lengkapi field password!");
            return;
        }

        const data = {
            bidang: departemen,
            email,
            password
        };

        try{
            if (editingIndex !== null) {
            // mode edit
            const akunId = akunList[editingIndex].id_pic;
            await axios.patch(`http://localhost:3000/admin/pic/update/${akunId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
            })
                alert("data akun berhasil diperbarui")
            } else {
            // mode tambah
            await axios.post(`http://localhost:3000/admin/pic/store`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
            })
                alert("data akun berhasil dibuat")
            }
            setShowModal(false);
            setDepartemen("");
            setEmail("");
            setPassword("");
            setEditingIndex(null)

            try {
                fetchDataAkun();
            } catch (err) {
                console.error("Gagal refresh data:", err);
            }

        }catch(error){
            console.error("Terjadi kesalahan:", error.response?.data);
            alert(error.response?.data?.message || "Gagal menyimpan data. Silakan coba lagi.");

        }

    };

    // Hapus akun
    const handleDelete = async (index) => {
        const akun = akunList[index]
        const akunId = akun.id_users
        const confirmDelete = window.confirm(`Apakah kamu yakin ingin menghapus akun dengan email: ${akun.email}?`)
        if (!confirmDelete) return;
        try{
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:3000/admin/pic/delete/${akunId}`,{
                    headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            alert("Data berhasil dihapus");
            fetchDataAkun(); 
        }catch(error){
            console.error("Terjadi kesalahan:", error.response?.data);
            alert(error.response?.data?.message || "Gagal menghapus data.");
        }
    };

    // Edit akun
    const handleEdit = (index) => {
        const akun = akunList[index];
        setDepartemen(akun.bidang);
        setEmail(akun.email);
        setPassword("");
        setEditingIndex(index);
        setShowModal(true);
    };

    return (
        <div className="app-layout">
        <SidebarAdmTm />
        <div className="content-area">
            <NavbarAdmTm />

            <section className="main">
            <div className="submain">
                <p className="judul-submain">Manajemen Akun PIC</p>
            </div>

            <div className="container-instansi">
                {/* HEADER */}
                <div className="penilaian-header">
                <button
                    className="btn-buat-aspek"
                    onClick={() => {
                    setEditingIndex(null);
                    setDepartemen("");
                    setEmail("");
                    setPassword("");
                    setShowModal(true);
                    }}
                >
                    Tambah Akun PIC
                </button>
                </div>

                {/* TABEL DATA AKUN */}
                <div className="tabel-wrapper" style={{ marginTop: "5rem" }}>
                <table className="table-wrapper">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Departemen</th>
                        <th>Email</th>
                        {/* <th>Password</th> */}
                        <th>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {akunList.map((akun, idx) => (
                        <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{akun.bidang}</td>
                        <td>{akun.email}</td>
                        {/* <td>{akun.password}</td> */}
                        <td className="aksi-cell">
                            <div className="aksi-wrapper">
                            <TbEdit
                                style={{ cursor: "pointer", marginRight: "10px", fontSize: "22px" }}
                                title="Edit Akun"
                                onClick={() => handleEdit(idx)}
                            />
                            <MdDeleteOutline
                                style={{ cursor: "pointer", color: "red", fontSize: "22px" }}
                                title="Hapus Akun"
                                onClick={() => handleDelete(idx)}
                            />
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </section>

            {/* MODAL INPUT AKUN PIC */}
            {showModal && (
            <div className="peserta-overlay" onClick={() => setShowModal(false)}>
                <div
                className="peserta-modal"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Header */}
                <div className="peserta-modal-header">
                    <span>{editingIndex !== null ? "Edit Akun PIC" : "Tambah Akun PIC"}</span>
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
                    {/* Dropdown Departemen */}
                    <div className="form-group">
                        <label>Nama Departemen</label>
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
                        <option value="Pengembangan Sumber Daya">
                            Pengembangan Sumber Daya
                        </option>
                        <option value="Penyelamatan dan Pendayagunaan Kearsipan">
                            Penyelamatan dan Pendayagunaan Kearsipan
                        </option>
                        <option value="Pembinaan dan Pengawasan Kearsipan">
                            Pembinaan dan Pengawasan Kearsipan
                        </option>
                        </select>
                    </div>

                    {/* Input Email */}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Input Password */}
                    <div className="form-group">
                        <label>Password</label>
                        <input
                        type="text"
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Tombol Simpan */}
                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                        {editingIndex !== null ? "Update" : "Simpan"}
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

export default AkunPIC;
